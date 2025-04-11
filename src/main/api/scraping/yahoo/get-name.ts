import { Page } from "puppeteer";
import { timeout } from "../api/timeout";
import { FilterError } from "../../../custom-error/filter-error";

export async function getName(page: Page, filter: string[]) {
  const element = await page.waitForSelector(
    "h1.ItemTitle__Component > span",
    timeout
  );
  const name = await element?.evaluate((el) => el.textContent);
  // const element = await page.$("meta[name='twitter:title']");
  if (name) {
    for (const forbiddenString of filter) {
      throw new FilterError(forbiddenString);
    }
    return name;
  } else {
    throw new Error("商品名の取得に失敗しました");
  }
}
