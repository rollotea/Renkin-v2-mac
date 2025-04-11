import { db } from "../../../main";

import { ForbiddenSellerRow } from "../../../types/setting/forbidden-seller";

export function getAllForbiddenSeller() {
  // const db = new Database("sample.db");
  const stmt = db.prepare("SELECT * FROM forbidden_seller");
  const result = stmt.all() as ForbiddenSellerRow[];
  return result;
}
