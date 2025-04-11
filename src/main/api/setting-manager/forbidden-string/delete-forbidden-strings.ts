import { db } from "../../../main";

export const deleteForbiddenStrings = (ids: string[]): void => {
  // const db = new Database("sample.db");

  if (ids.length === 0) return;

  const placeholders = ids.map(() => "?").join(",");
  const stmt = db.prepare(
    `DELETE FROM forbidden_string WHERE id IN (${placeholders})`
  );

  const deleteTransaction = db.transaction(() => {
    stmt.run(...ids);
  });

  deleteTransaction(); // 実行
  // db.close();
};
