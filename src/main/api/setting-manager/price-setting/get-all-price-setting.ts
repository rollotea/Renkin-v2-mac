import { db } from "../../../main";

import type { PriceSettingRow } from "../../../types/setting/price-setting";

export function getAllPriceSetting() {
  // const db = new Database("sample.db");
  const stmt = db.prepare("SELECT * FROM price_setting");
  const result = stmt.all() as PriceSettingRow[];
  return result;
}
