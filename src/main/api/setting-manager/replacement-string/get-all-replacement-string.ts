import { db } from "../../../main";

import { ReplacementStringRow } from "../../../types/setting/replacement-string";

export function getAllReplacementString() {
  // const db = new Database("sample.db");
  const stmt = db.prepare("SELECT * FROM replacement_string");
  const result = stmt.all() as ReplacementStringRow[];
  return result;
}
