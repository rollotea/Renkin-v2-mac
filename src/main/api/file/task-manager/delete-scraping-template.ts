import { db } from "../../../main";

export const deleteScrapingTemplate = (id: string): void => {
  // const db = new Database("sample.db");

  const stmt = db.prepare("DELETE FROM scraping_templates WHERE id = ?");

  stmt.run(id);
};
