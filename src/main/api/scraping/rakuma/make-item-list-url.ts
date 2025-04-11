import { ScrapingTemplateItem } from "../../../../renderer/store/ducks/scrapingTemplateQueueSlice";
import { newRakumaCategories } from "./url-map";

export async function makeItemListUrl(item: ScrapingTemplateItem) {
  const baseUrl = `https://fril.jp/category/${
    newRakumaCategories[item.scrapingTemplate.category]
  }/page/1`;
  const endpoint = newRakumaCategories[item.scrapingTemplate.category];
  const url = new URL(endpoint, baseUrl);
  url.searchParams.set("transaction", "selling");
  url.searchParams.set("min", item.scrapingTemplate.minPrice.toString());
  url.searchParams.set("max", item.scrapingTemplate.maxPrice.toString());

  if (item.scrapingTemplate.sort === "おすすめ順") {
    url.searchParams.set("order", "desc");
    url.searchParams.set("sort", "relevance");
  }
  if (item.scrapingTemplate.sort === "新しい順") {
    url.searchParams.set("order", "desc");
    url.searchParams.set("sort", "created_at");
  }
  // url.searchParams.set("item_condition_id", "1");
  // url.searchParams.set("shipping_payer_id", "2");
  // url.searchParams.set("status", "on_sale");
  // url.searchParams.set("page_token", "v1:A0");
  // url.searchParams.set("page_token", "v1%3A0");
  // if (item.scrapingTemplate.anonymousDelivery) {
  //   url.searchParams.set("shipping_method", "anonymous");
  // }
  return url;
}
