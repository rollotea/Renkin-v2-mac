import { db } from "../../../main";

import { File } from "../../../types/file";

export function fetchFileById(id: string) {
  // const db = new Database("sample.db");
  const stmt = db.prepare("SELECT * FROM files WHERE id = ?");
  const file = stmt.get(id) as File;
  return file;
}
