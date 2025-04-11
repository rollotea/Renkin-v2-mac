import { db } from "../../../main";

export const deleteScrapingTemplates = (ids: string[]) => {
  // const db = new Database("sample.db");

  // プレースホルダーを動的に作成
  const placeholders = ids.map(() => "?").join(",");

  // SQL文を準備
  const stmt = db.prepare(
    `DELETE FROM scraping_templates WHERE id IN (${placeholders})`
  );

  // 実行
  stmt.run(ids);
};
