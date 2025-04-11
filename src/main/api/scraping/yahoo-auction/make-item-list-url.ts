import { ScrapingTemplateItem } from "../../../../renderer/store/ducks/scrapingTemplateQueueSlice";
import { newYahooAuctionCategories } from "./url-map";

export async function makeItemListUrl(item: ScrapingTemplateItem) {
  const baseUrl = "https://auctions.yahoo.co.jp/category/list/";
  const endpoint = newYahooAuctionCategories[item.scrapingTemplate.category];
  const url = new URL(endpoint, baseUrl);
  // url.searchParams.set(
  //   "search_condition_id",
  //   newYahooAuctionCategories[item.scrapingTemplate.category]
  // );
  url.searchParams.set("min", item.scrapingTemplate.minPrice.toString());
  url.searchParams.set("max", item.scrapingTemplate.maxPrice.toString());
  url.searchParams.set("auccat", "25464");
  url.searchParams.set("fixed", "1");
  url.searchParams.set("istatus", "1");
  url.searchParams.set("is_postage_mode", "1");
  url.searchParams.set("dest_pref_code", "13");
  url.searchParams.set("abatch", "2");
  url.searchParams.set("exflg", "1");
  url.searchParams.set("b", "1");
  url.searchParams.set("n", "100");
  // url.searchParams.set("s1", "featured");
  url.searchParams.set("mode", "1");

  if (item.scrapingTemplate.sort === "おすすめ順") {
    url.searchParams.set("s1", "score2");
  }
  if (item.scrapingTemplate.sort === "おすすめ順") {
    url.searchParams.set("s1", "new");
  }
  // url.searchParams.set("page_token", "v1%3A0");
  // if (item.scrapingTemplate.anonymousDelivery) {
  //   url.searchParams.set("shipping_method", "anonymous");
  // }
  return url;
}
