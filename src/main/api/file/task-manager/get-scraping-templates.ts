import { db } from "../../../main";

import { ScrapingTemplateRow } from "../../../types/scraping/scraping-template";
import dayjs from "dayjs";
export function getScrapingTemplates() {
  // const db = new Database("sample.db");
  const stmt = db.prepare("SELECT * FROM scraping_templates");
  const result = stmt.all() as ScrapingTemplateRow[];
  // const data = result.map((data) => ({
  //   ...data,
  //   createdAt: dayjs(data.createdAt),
  // }));
  return result;
}
