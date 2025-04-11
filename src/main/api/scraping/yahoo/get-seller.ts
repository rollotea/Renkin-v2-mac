import { Page } from "puppeteer";
import { timeout } from "../api/timeout";
import { FilterError } from "../../../custom-error/filter-error";

export async function getSeller(page: Page, filter: string[]) {
  const element = await page.waitForSelector("div.UserInfo__Name", timeout);
  const seller = await element?.evaluate((el) => el.textContent);

  // const element = await page.$("div.merUserObject > div > div > p");
  if (seller) {
    if (new Set(filter).has(seller)) {
      throw new FilterError(seller);
    }
    return seller;
  } else {
    throw new Error("出品者情報の取得に失敗しました");
  }
}
