import { ScrapingTemplateItem } from "../../../../renderer/store/ducks/scrapingTemplateQueueSlice";
import { newYahooCategories } from "./url-map";

export async function makeItemListUrl(item: ScrapingTemplateItem) {
  const baseUrl = "https://paypayfleamarket.yahoo.co.jp";
  const endpoint = "search";
  const url = new URL(endpoint, baseUrl);
  url.searchParams.set(
    "categoryIds",
    newYahooCategories[item.scrapingTemplate.category]
  );
  url.searchParams.set("minPrice", item.scrapingTemplate.minPrice.toString());
  url.searchParams.set("maxPrice", item.scrapingTemplate.maxPrice.toString());
  url.searchParams.set("conditions", "NEW");
  url.searchParams.set("open", "1");

  if (item.scrapingTemplate.sort === "おすすめ順") {
    url.searchParams.set("sort", "ranking");
    url.searchParams.set("order", "asc");
  }
  if (item.scrapingTemplate.sort === "新しい順") {
    url.searchParams.set("sort", "openTime");
    url.searchParams.set("order", "desc");
  }
  // url.searchParams.set("status", "on_sale");
  // url.searchParams.set("page_token", "v1:A0");
  // url.searchParams.set("page_token", "v1%3A0");
  // if (item.scrapingTemplate.anonymousDelivery) {
  //   url.searchParams.set("shipping_method", "anonymous");
  // }
  return url;
}
