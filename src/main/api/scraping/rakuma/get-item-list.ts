import { Browser, Page } from "puppeteer";
import { PresetFilters } from "../../../types/setting/preset-filters";
import { timeout } from "../api/timeout";

export async function getItemList(page: Page, itemListUrl: URL) {
  await page.goto(itemListUrl.toString(), {
    waitUntil: "domcontentloaded",
    timeout: 10000,
  });
  // await page.waitForNavigation();
  await page.setViewport({ width: 1080, height: 1024 });
  // await page.goto(itemListUrl.toString(), { waitUntil: "load" });
  await page.waitForSelector(
      "div.item-box > div > a",
      timeout
    );

  const elements = await page.$$("div.item-box > div > a");
  if (elements) {
    const itemUrlList = await Promise.all(
      elements.map((el) => page.evaluate((el) => el.href, el))
    );
    return itemUrlList;
  } else {
    throw new Error();
  }
}
