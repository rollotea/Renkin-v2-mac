import type { DisplayItemDetailRow } from "../../../types/scraping/item-detail";
import {
  ReplacementString,
  ReplacementStringRow,
} from "../../../types/setting/replacement-string";
import { getAllForbiddenString } from "../../setting-manager/forbidden-string/get-all-forbidden-string";
import { getAllReplacementString } from "../../setting-manager/replacement-string/get-all-replacement-string";
export function mapReplacementString(
  displayItemDetailRow: DisplayItemDetailRow[],
  preset: { target: string; value: string }[]
) {
  const replacementString = getAllReplacementString().map((data) => ({
    target: data.target,
    value: data.value,
  }));

  return displayItemDetailRow.map((data) => {
    let updatedName = data.name;
    let updatedDescription = data.description;
    let isModified = false;
    let replacementPairs: ReplacementString[] = [];

    // let replacementPairs: { target: string; value: string }[] = [];
    // const preset = presetReplacementString as ReplacementStringRow[];

    [...replacementString, ...preset].forEach((data) => {
      if (
        updatedName.includes(data.target) ||
        updatedDescription.includes(data.target)
      ) {
        updatedName = updatedName.replace(
          new RegExp(data.target, "g"),
          data.value
        );
        updatedDescription = updatedDescription.replace(
          new RegExp(data.target, "g"),
          data.value
        );
        isModified = true;
        replacementPairs.push({ target: data.target, value: data.value });
      }
    });

    if (isModified) {
      return {
        ...data,
        name: updatedName,
        description: updatedDescription,
        filter: { ...data.filter, ReplacementPairs: replacementPairs },
      };
    }

    return data;
  });
  // const replacementString = new Set(getAllReplacementString());
  // const result: DisplayItemDetailRow[] = displayItemDetailRow.map((data) => {
  //   const matches = [...replacementString].map(
  //     (el) =>
  //     {

  //     }
  //       data.name.includes(el.target) || data.description.includes(el.target)
  //   );
  //   if (matches.length > 0) {
  //     return {
  //       ...data,
  //       isValid: false,
  //       filter: { ...data.filter, ReplacementPairs: matches },
  //     };
  //   } else {
  //     return data;
  //   }
  // });
  // return result;
}
