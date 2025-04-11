import type { DisplayItemDetailRow } from "../../../types/scraping/item-detail";
import { getAllForbiddenString } from "../../setting-manager/forbidden-string/get-all-forbidden-string";
export function mapForbiddenString(
  displayItemDetailRow: DisplayItemDetailRow[],
  presetForbiddenString: string[]
) {
  const forbiddenString = new Set(
    getAllForbiddenString().map((data) => data.target)
  );
  const result: DisplayItemDetailRow[] = displayItemDetailRow.map((data) => {
    const matches = [...forbiddenString, ...presetForbiddenString].filter(
      (target) =>
        data.name.includes(target) || data.description.includes(target)
    );
    if (matches.length > 0) {
      return {
        ...data,
        isValid: false,
        filter: { ...data.filter, ForbiddenStrings: matches },
      };
    } else {
      return data;
    }
  });
  return result;
}
