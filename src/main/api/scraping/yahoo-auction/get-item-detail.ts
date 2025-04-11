import { Browser, Page } from "puppeteer";
import type { ItemDetail } from "../../../types/scraping/item-detail";
import { getName } from "./get-name";
import { v7 as uuidv7 } from "uuid";
import { getPrice } from "./get-price";
import { getDescription } from "./get-description";
import { getImageLink } from "./get-image-link-list";
import { getSeller } from "./get-seller";
import { PresetFilters } from "../../../types/setting/preset-filters";
export async function getItemDetail(
  page: Page,
  itemUrl: string,
  filter: PresetFilters
): Promise<ItemDetail> {
  // const baseUrl = "https://jp.mercari.com";
  // const url = new URL(itemUrl, baseUrl);
  // console.log(url.href);
  await page.goto(itemUrl, {
    waitUntil: "domcontentloaded",
    // waitUntil: "load",
    timeout: 10000,
  });
  // await page.waitForNavigation();
  // await page.goto(itemUrl.toString(), { waitUntil: "load" });
  // const element = await page.$("h1");
  const name = await getName(page, filter.forbiddenString);
  const price = await getPrice(page);
  const seller = await getSeller(page, filter.seller);
  const description = await getDescription(page, filter.forbiddenString);
  const imageLink = await getImageLink(page);

  const itemDetails: ItemDetail = {
    url: itemUrl,
    sku: uuidv7(),
    name: name,
    price: price,
    seller: seller,
    description: description,
    ...imageLink,
  };
  return itemDetails;
}
