import { db } from "../../main";

import type { DisplayItemDetailRow } from "../../types/scraping/item-detail";
import { mapSeller } from "./map/map-seller";
import { mapForbiddenString } from "./map/map-forbidden-string";
import { initialFilter } from "../../types/scraping/item-detail";
import { mapPriceSetting } from "./map/map-price-setting";
import { mapReplacementString } from "./map/map-replacement-string";
import { PresetFilters } from "../../types/setting/preset-filters";
export function getItemDetail(
  id: string,
  presetFilters: PresetFilters
): DisplayItemDetailRow {
  // const db = new Database("sample.db");
  const stmt = db.prepare("SELECT * FROM item_detail WHERE id = ?");
  let result: DisplayItemDetailRow[] = [
    { ...stmt.get(id), isValid: true, filter: initialFilter },
  ];
  result = mapSeller(result, presetFilters.seller);
  result = mapForbiddenString(result, presetFilters.forbiddenString);
  result = mapPriceSetting(result);
  result = mapReplacementString(result, presetFilters.replacementString);
  return result[0];
}
