import { db } from "../../../main";

import type { PriceSetting } from "../../../types/setting/price-setting";

export function createPriceSetting(priceSetting: PriceSetting) {
  // const db = new Database("sample.db");
  const insert = db.prepare(
    "INSERT INTO price_setting (range,value) VALUES (@range,@value)"
  );
  insert.run(priceSetting);
}
