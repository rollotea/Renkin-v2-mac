import { Browser, Page } from "puppeteer";
import { timeout } from "../api/timeout";

export async function getItemList(page: Page, itemListUrl: URL) {
  await page.goto(itemListUrl.toString(), {
    waitUntil: "domcontentloaded",
    timeout: 20000,
  });
  // await page.waitForNavigation({ timeout: 20000 });
  await page.setViewport({ width: 1080, height: 5500 });

  await page.waitForSelector(
      "div#item-grid li[data-testid='item-cell'] > div > a",
      timeout
    );
  // await page.goto(itemListUrl.toString(), { waitUntil: "load" });
  const elements = await page.$$(
    "div#item-grid li[data-testid='item-cell'] > div > a"
  );
  if (elements) {
    const itemUrlList = await Promise.all(
      elements.map((el) => page.evaluate((el) => el.href, el))
    );
    return itemUrlList;
  } else {
    console.log("itemUrlLIstとれなかった");
  }
}
