import type { DisplayItemDetailRow } from "../../../types/scraping/item-detail";
import { getAllForbiddenSeller } from "../../setting-manager/forbidden-seller/get-all-forbidden-seller";
export function mapSeller(
  displayItemDetailRow: DisplayItemDetailRow[],
  presetSeller: string[]
) {
  const forbiddenSeller = new Set(
    getAllForbiddenSeller().map((data) => data.seller)
  );
  const result: DisplayItemDetailRow[] = displayItemDetailRow.map((data) => {
    if (
      forbiddenSeller.has(data.seller) ||
      new Set(presetSeller).has(data.seller)
    ) {
      return {
        ...data,
        isValid: false,
        filter: { ...data.filter, ForbiddenSeller: data.seller },
      };
    } else {
      return data;
    }
  });
  return result;
}
