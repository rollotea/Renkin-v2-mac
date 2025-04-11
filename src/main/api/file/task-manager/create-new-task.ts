import { db } from "../../../main";

import { ScrapingTemplate } from "../../../types/scraping/scraping-template";
export function createNewTask(scrapingTemplate: ScrapingTemplate) {
  // const db = new Database("sample.db");
  const insert = db.prepare(
    "INSERT INTO scraping_templates (title,platform,sort,category,endValue,minPrice,maxPrice,freeShipping,anonymousDelivery,errorLimit) VALUES (@title,@platform,@sort,@category,@endValue,@minPrice,@maxPrice,@freeShipping,@anonymousDelivery,@errorLimit)"
  );
  insert.run({
    ...scrapingTemplate,
    freeShipping: scrapingTemplate.freeShipping ? 1 : 0,
    anonymousDelivery: scrapingTemplate.anonymousDelivery ? 1 : 0,
  });
}
