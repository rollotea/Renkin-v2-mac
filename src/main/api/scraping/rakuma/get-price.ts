import { Page } from "puppeteer";
import { timeout } from "../api/timeout";

export async function getPrice(page: Page) {
  const element = await page.waitForSelector(
    "meta[property='product:price:amount']",
    timeout
  );
  const price = await element?.evaluate((el) => el.getAttribute("content"));

  // const element = await page.$("meta[name='product:price:amount']");
  if (price) {
    // const price = await page.evaluate((el) => el.content, element);
    return price;
  } else {
    throw new Error("商品価格の取得に失敗しました");
  }
}
