import { db } from "../../../main";

export function checkExist(fileName: string) {
  // const db = new Database("sample.db");
  const stmt = db.prepare("SELECT COUNT(*) AS count FROM files WHERE name = ?");
  const result = stmt.get(fileName) as { count: number };
  const exists = result.count > 0;
  return exists;
}
