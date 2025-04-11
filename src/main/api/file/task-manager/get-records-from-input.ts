import { db } from "../../../main";

import { InputColumns } from "../../../types/input-columns";

export function getRecordsFromInput(file_id: string) {
  // const db = new Database("sample.db");
  const stmt = db.prepare("SELECT * FROM input WHERE file_id = ?");
  const result = stmt.all(file_id) as InputColumns[];
  return result;
}
