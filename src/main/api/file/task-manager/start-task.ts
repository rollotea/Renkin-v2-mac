import axios from "axios";
import * as path from "path";
import * as fs from "fs";
import { v7 as uuidv7 } from "uuid";
import puppeteer, { Page, Puppeteer, Browser } from "puppeteer";
import { getRecordsFromInput } from "./get-records-from-input";
import { Item } from "../../../../renderer/store/ducks/queueSlice";
import { TaskState } from "../../../types/task-state";
import { BrowserWindow } from "electron";
import { TaskResult } from "../../../types/task-result";
import { InputColumns } from "../../../types/input-columns";
import { WriteTaskResult } from "./write-task-result";
import { writeAfterCompletionFile } from "./write-after-completion-file";
import { ScrapingTemplateItem } from "../../../../renderer/store/ducks/scrapingTemplateQueueSlice";
import { startMercariScraping } from "../../scraping/marcari/mercari-scraping";
import { startYahooAuctionScraping } from "../../scraping/yahoo-auction/yahoo-auction-scraping";
import { startYahooScraping } from "../../scraping/yahoo/yahoo-scraping";
import { startRakumaScraping } from "../../scraping/rakuma/rakuma-scraping";
import { PresetFilters } from "../../../types/setting/preset-filters";
import { getAllForbiddenString } from "../../setting-manager/forbidden-string/get-all-forbidden-string";
import { getAllForbiddenSeller } from "../../setting-manager/forbidden-seller/get-all-forbidden-seller";

export async function startTask(
  mainWindow: BrowserWindow,
  items: ScrapingTemplateItem[],
  control: { shouldCancelTaskFlag: boolean },
  presetFilters: PresetFilters
) {
  control.shouldCancelTaskFlag = false;
  const taskState: TaskState = {
    item: items[0],
    errorLimit: 0,
    endValue: items[0].scrapingTemplate.endValue,
    completed: 0,
    canceled: 0,
    errorType: { filter: 0, alreadyExists: 0, other: 0 },
    status: "In Progress",
  };
  mainWindow.webContents.send("message-from-main", {
    text: taskState,
  });
  const forbiddenString = getAllForbiddenString().map((data) => data.target);
  const forbiddenSeller = getAllForbiddenSeller().map((data) => data.seller);
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox",
      // "--disable-dev-shm-usage", // /dev/shmの使用を無効化
      // "--no-zygote", // Zygoteプロセスを無効化
      // "--single-process", // 単一プロセスで実行
      // "--disable-software-rasterizer", // ソフトウェアラスタライザーを無効化
    ],
  });
  for (const item of items) {
    if (control.shouldCancelTaskFlag) {
      mainWindow.webContents.send("task-manager:notify-task-canceled", {
        stopped: item.scrapingTemplate.title,
      });
      return;
    }
    taskState.item = item;
    taskState.errorLimit = item.scrapingTemplate.errorLimit;
    taskState.endValue = item.scrapingTemplate.endValue;
    mainWindow.webContents.send("message-from-main", {
      text: taskState,
    });
    try {
      const page = await browser.newPage();
      // page.on("request", (interceptedRequest) => {
      //   if (interceptedRequest.isInterceptResolutionHandled()) return;
      //   if (
      //     interceptedRequest.url().endsWith(".png") ||
      //     interceptedRequest.url().endsWith(".jpg")
      //   )
      //     interceptedRequest.abort();
      //   else interceptedRequest.continue();
      // });
      if (item.scrapingTemplate.platform === "Mercari") {
        await startMercariScraping(taskState, page, mainWindow, item, control, {
          ...presetFilters,
          seller: [...presetFilters.seller, ...forbiddenSeller],
          forbiddenString: [
            ...presetFilters.forbiddenString,
            ...forbiddenString,
          ],
        });
      }
      if (item.scrapingTemplate.platform === "Rakuma") {
        await startRakumaScraping(taskState, page, mainWindow, item, control, {
          ...presetFilters,
          seller: [...presetFilters.seller, ...forbiddenSeller],
          forbiddenString: [
            ...presetFilters.forbiddenString,
            ...forbiddenString,
          ],
        });
      }
      if (item.scrapingTemplate.platform === "Yahoo") {
        await startYahooScraping(taskState, page, mainWindow, item, control, {
          ...presetFilters,
          seller: [...presetFilters.seller, ...forbiddenSeller],
          forbiddenString: [
            ...presetFilters.forbiddenString,
            ...forbiddenString,
          ],
        });
      }
      if (item.scrapingTemplate.platform === "Yahoo Auction") {
        await startYahooAuctionScraping(
          taskState,
          page,
          mainWindow,
          item,
          control,
          {
            ...presetFilters,
            seller: [...presetFilters.seller, ...forbiddenSeller],
            forbiddenString: [
              ...presetFilters.forbiddenString,
              ...forbiddenString,
            ],
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
  }
  // await browser.close();
  taskState.status = "Completed";
  mainWindow.webContents.send("message-from-main", {
    text: taskState,
  });
  console.log("おわり！");
}

async function taskInLoop(
  browser: Browser,
  record: InputColumns,
  task_id: string,
  now: string
): Promise<TaskResult | undefined> {
  const url = await getUrl(browser, record.商品コード);
  if (url) {
    const result = await getItemDetails(browser, url);
    if (result && result.imageLink) {
      await downloadImage(now, result.imageLink, record.商品コード);
      return {
        input_id: record.id,
        task_id: task_id,
        file_id: record.file_id,
        description: result.description,
        price: result.price,
        spec: result.spec,
        url: url,
        name: result.name,
        brand: record.ブランド名称,
        janCode: record.商品コード,
        category: record.カテゴリ名,
        imageQuantity: result.imageLink.length,
      };
    } else {
      console.log("失敗！！");
    }
  } else {
    console.log("失敗！");
  }
}

async function getUrl(browser: Browser, janCode: string) {
  const page = await browser.newPage();

  await page.goto(
    `https://houjin.biccamera.com/product/result.aspx?ctid1=&ctid2=&ctid3=&ctid=&keyword_and=&keyword_or=&keyword_not=&product_maker=&product_name=&product_code=${janCode}&price_from=&price_to=&sale_date_from_year=&sale_date_from_month=&sale_date_from_day=&sale_date_to_year=&sale_date_to_month=&sale_date_to_day=&order_by=DEFAULT`,
    { waitUntil: "load" }
  );

  await page.setViewport({ width: 1080, height: 1024 });
  const element = await page.$(
    "div.contents_body > ul > li > div.list-name > a[href]"
  );
  if (element) {
    const url = await page.evaluate(
      'document.querySelector("div.contents_body > ul > li > div.list-name > a[href]").getAttribute("href")'
    );
    return url as string;
  }
  page.close();
}

async function getItemDetails(browser: Browser, url: string) {
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "load" });
  await page.setViewport({ width: 1080, height: 1024 });
  const name = await getName(page);
  const description = await getDescription(page);
  const spec = await getSpec(page);
  const imageLink = await getImageLink(page);
  const price = await getPrice(page);
  if (
    typeof name === "string" &&
    typeof description === "string" &&
    typeof spec === "string" &&
    Array.isArray(imageLink) &&
    typeof price === "string"
  ) {
    return { name, description, spec, imageLink, price };
  }
}

async function getName(page: Page) {
  const element = await page.$("span#PROD-CURRENT-NAME[itemprop='name']");
  if (element) {
    const description = await page.evaluate((el) => el.innerHTML, element);
    return description;
  }
}
async function getDescription(page: Page) {
  const element = await page.$("#frm_add_cart > div:nth-child(9)");
  if (element) {
    const description = await page.evaluate((el) => el.innerHTML, element);
    return description;
  }
}

async function getSpec(page: Page) {
  const element = await page.$("#frm_add_cart > div.contents > table");
  if (element) {
    const spec = await page.evaluate((el) => el.outerHTML, element);
    return spec;
  }
}

async function getImageLink(page: Page) {
  const elements = await page.$$(
    "#frm_add_cart > div > div > div > ul > li > a > img"
  );
  if (elements) {
    const imageLink = await Promise.all(
      elements.map((el) => page.evaluate((el) => el.src, el))
    );
    return imageLink;
  }
}

async function getPrice(page: Page) {
  const element = await page.$(
    "#frm_add_cart > div:nth-child(7) > div.product_detail_item_main > div:nth-child(4) > span"
  );
  if (element) {
    const text = await page.evaluate((el) => el.innerText, element);
    const price: string = text
      .replace("通常価格　¥", "")
      .replace(",", "")
      .replace("(税別)", "");
    return price;
  }
}

async function downloadImage(
  now: string,
  imageLink: string[],
  janCode: string
) {
  for (const [i, url] of imageLink.entries()) {
    try {
      // 画像データを取得
      const response = await axios({
        url,
        method: "GET",
        responseType: "stream", // ストリームとして画像を取得
      });
      const savePath = path.join(
        "image",
        now,
        janCode,
        `${janCode}-${i + 1}.jpg`
      );

      // 保存先のディレクトリを作成（必要であれば）
      const dir = path.dirname(savePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // ストリームをファイルに保存
      const writer = fs.createWriteStream(savePath);
      response.data.pipe(writer);

      // 保存完了の通知
      // writer.on("finish", () => {
      //   console.log("画像のダウンロードが完了しました");
      // });

      writer.on("error", (err) => {
        console.error("エラーが発生しました:", err);
      });
    } catch (error) {
      console.error("画像のダウンロード中にエラーが発生しました:", error);
    }
  }
}
