import { Page } from "puppeteer";
import { timeout } from "../api/timeout";
import { PresetFilters } from "../../../types/setting/preset-filters";
import { FilterError } from "../../../custom-error/filter-error";

export async function getName(page: Page, filter: string[]) {
  const element = await page.waitForSelector(
    "meta[name='twitter:title']",
    timeout
  );
  const name = await element?.evaluate((el) => el.getAttribute("content"));
  // const element = await page.$("meta[name='twitter:title']");
  if (name) {
    for (const forbiddenString of filter) {
      if (name.includes(forbiddenString)) {
        throw new FilterError(forbiddenString);
      }
    }
    return name;
  } else {
    throw new Error("商品名の取得に失敗しました");
  }
}
