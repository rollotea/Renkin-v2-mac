import { Page } from "puppeteer";
import { timeout } from "../api/timeout";
import { FilterError } from "../../../custom-error/filter-error";
export async function getDescription(page: Page, filter: string[]) {
  const element = await page.waitForSelector(
    "div#description > section > div > div",
    timeout
  );
  const description = await element?.evaluate((el) => el.textContent);

  if (description) {
    for (const forbiddenString of filter) {
      if (description.includes(forbiddenString)) {
        throw new FilterError(forbiddenString);
      }
    }
    return description;
  } else {
    throw new Error("商品説明の取得に失敗しました");
  }
}
