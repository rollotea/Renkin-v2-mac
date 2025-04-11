import { db } from "../../../main";

import { ForbiddenSeller } from "../../../types/setting/forbidden-seller";
export function createForbiddenSeller(forbiddenSeller: ForbiddenSeller) {
  // const db = new Database("sample.db");
  const insert = db.prepare(
    "INSERT INTO forbidden_seller (seller) VALUES (@seller)"
  );
  insert.run(forbiddenSeller);
}
