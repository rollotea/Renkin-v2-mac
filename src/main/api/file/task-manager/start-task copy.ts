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

export async function startTask(
  mainWindow: BrowserWindow,
  items: ScrapingTemplateItem[],
  control: { shouldCancelTaskFlag: boolean }
) {
  control.shouldCancelTaskFlag = false;
  const browser = await puppeteer.launch();
  for (const item of items) {
    if (control.shouldCancelTaskFlag) {
      mainWindow.webContents.send("task-manager:notify-task-canceled", {
        stopped: item.file.name,
      });
      return;
    }
    const task_id = uuidv7();
    const imageDir = `${item.file.name}_${new Date()
      .toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })
      .replace(/[/\s:]/g, "-")}`;

    const taskState: TaskState = {
      item: item,
      total: 0,
      completed: 0,
      canceled: 0,
      status: "In Progress",
    };
    mainWindow.webContents.send("message-from-main", {
      text: taskState,
    });

    const records = getRecordsFromInput(item.file.id);
    taskState.total = records.length;

    for (const [idx, record] of records.entries()) {
      if (control.shouldCancelTaskFlag) {
        taskState.status = "Canceled";
        mainWindow.webContents.send("message-from-main", {
          text: taskState,
        });
        mainWindow.webContents.send("task-manager:notify-task-canceled", {
          stopped: item.file.name,
        });
        return;
      }
      const janCode = record.商品コード;
      if (janCode) {
        const result = await taskInLoop(browser, record, task_id, imageDir);
        if (result) {
          taskState.completed += 1;
          WriteTaskResult(result);
        } else {
          taskState.canceled += 1;
        }
        // const url = await getUrl(browser, janCode);
        // if (url) {
        //   const result = await getItemDetails(browser, url);
        //   if (result && result.imageLink) {
        //     await downloadImage(result.imageLink, janCode);
        //     taskState.completed += 1;
        //   } else {
        //     console.log("失敗！！");
        //     taskState.canceled += 1;
        //   }
        // } else {
        //   console.log("失敗！");
        //   taskState.canceled += 1;
        // }
      } else {
        console.log("商品コードなし");
        taskState.canceled += 1;
      }
      mainWindow.webContents.send("message-from-main", {
        text: taskState,
      });
    }

    if (!control.shouldCancelTaskFlag) {
      writeAfterCompletionFile({
        imageDir: imageDir,
        task_id: task_id,
        file_id: item.file.id,
        fileName: item.file.name,
        total: taskState.total,
        completed: taskState.completed,
        canceled: taskState.canceled,
      });
      taskState.status = "Completed";
    }
    mainWindow.webContents.send("message-from-main", {
      text: taskState,
    });
  }
  await browser.close();
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
