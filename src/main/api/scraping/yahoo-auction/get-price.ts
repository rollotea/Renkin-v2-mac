import { Page } from "puppeteer";
import { timeout } from "../api/timeout";
export async function getPrice(page: Page) {
  await page.waitForSelector("script#__NEXT_DATA__", timeout);
  // const price = await element?.evaluate((el) => el.getAttribute("content"));
  const jsonScripts = await page.$eval(
    "script#__NEXT_DATA__",
    (script) => script.textContent
  );

  // const element = await page.$("meta[name='product:price:amount']");
  if (jsonScripts) {
    const price = JSON.parse(jsonScripts).props.initialState.item.detail.price;
    return price;
  } else {
    throw new Error("商品価格の取得に失敗しました");
  }
}
