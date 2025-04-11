import { db } from "../../../main";

export function getFileId(fileName: string) {
  // const db = new Database("sample.db");
  const stmt = db.prepare("SELECT * FROM files WHERE name = ?");
  const result = stmt.get(fileName) as
    | { id: number; size: number; isFavorited: number; created_at: string }
    | undefined;
  if (result) {
    return result.id;
  } else {
    return undefined;
  }
}
