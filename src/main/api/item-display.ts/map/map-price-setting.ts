import type { DisplayItemDetailRow } from "../../../types/scraping/item-detail";
import { getAllForbiddenString } from "../../setting-manager/forbidden-string/get-all-forbidden-string";
import { getAllPriceSetting } from "../../setting-manager/price-setting/get-all-price-setting";
import { getAllPriceSettingByAsc } from "../../setting-manager/price-setting/get-all-price-setting-by-asc";
export function mapPriceSetting(displayItemDetailRow: DisplayItemDetailRow[]) {
  const priceSettings = getAllPriceSettingByAsc();
  const result: DisplayItemDetailRow[] = displayItemDetailRow.map((data) => {
    let updatedData = { ...data };
    for (const priceSetting of priceSettings) {
      if (Number(data.price) <= priceSetting.range) {
        updatedData = {
          ...data,
          price: priceSetting.value.toString(),
          filter: {
            ...data.filter,
            MappedPrice: {
              beforeMap: Number(data.price),
              afterMap: priceSetting.value,
            },
          },
        };
        break;
      }
    }
    return updatedData;
    // const matches = [...forbiddenString].filter(

    //   (target) =>
    //     data.name.includes(target) || data.description.includes(target)
    // );
    // if (matches.length > 0) {
    //   return {
    //     ...data,
    //     isValid: false,
    //     filter: { ...data.filter, ForbiddenStrings: matches },
    //   };
    // } else {
    //   return data;
    // }
  });
  return result;
}
