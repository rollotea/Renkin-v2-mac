import { Browser, Page } from "puppeteer";
import { timeout } from "../api/timeout";

export async function getItemList(page: Page, itemListUrl: URL) {
  await page.goto(itemListUrl.toString(), {
    waitUntil: "domcontentloaded",
    timeout: 10000,
  });
  // await page.waitForNavigation();
  await page.setViewport({ width: 1080, height: 1024 });
  await page.waitForSelector(
    "li.Product > div > a",
    timeout
  );

  const elements = await page.$$("li.Product > div > a");
  if (elements) {
    const itemUrlList = await Promise.all(
      elements.map((el) => page.evaluate((el) => el.href, el))
    );
    return itemUrlList;
  } else {
    console.log("itemUrlLIstとれなかった");
  }
}
