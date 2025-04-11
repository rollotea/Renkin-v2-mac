import { db } from "../../../main";

import { ScrapingTemplateRow } from "../../../types/scraping/scraping-template";
export function getScrapingTemplate(id: string) {
  // const db = new Database("sample.db");
  const stmt = db.prepare("SELECT * FROM scraping_templates WHERE id = ?");
  const result = stmt.get(id) as ScrapingTemplateRow;
  // const data = result.map((data) => ({
  //   ...data,
  //   createdAt: dayjs(data.createdAt),
  // }));
  return result;
}
