import { ScrapingTemplateItem } from "../../../../renderer/store/ducks/scrapingTemplateQueueSlice";
import { newMercariCategories } from "./url-map";
import { oldMercariCategories } from "./url-map";
export async function makeItemListUrl(item: ScrapingTemplateItem) {
  const baseUrl = "https://jp.mercari.com";
  const endpoint = "search";
  const url = new URL(endpoint, baseUrl);
  url.searchParams.set(
    "category_id",
    oldMercariCategories[item.scrapingTemplate.category]
  );
  // url.searchParams.set(
  //   "search_condition_id",
  //   newMercariCategories[item.scrapingTemplate.category]
  // );
  url.searchParams.set("price_min", item.scrapingTemplate.minPrice.toString());
  url.searchParams.set("price_max", item.scrapingTemplate.maxPrice.toString());
  url.searchParams.set("item_condition_id", "1");
  url.searchParams.set("shipping_payer_id", "2");
  url.searchParams.set("status", "on_sale");
  // url.searchParams.set("page_token", "v1%3A0");
  if (item.scrapingTemplate.anonymousDelivery) {
    url.searchParams.set("shipping_method", "anonymous");
  }
  return url;
}
