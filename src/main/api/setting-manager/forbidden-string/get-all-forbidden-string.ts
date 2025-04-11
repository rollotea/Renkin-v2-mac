import { db } from "../../../main";

import { ForbiddenStringRow } from "../../../types/setting/forbidden-string";
export function getAllForbiddenString() {
  // const db = new Database("sample.db");
  const stmt = db.prepare("SELECT * FROM forbidden_string");
  const result = stmt.all() as ForbiddenStringRow[];
  return result;
}
