import path from "path";
import { TaskResult } from "../../../types/task-result";

export function mapTaskResultToBase(base: any[], taskResult: TaskResult[]) {
  const records = [];
  for (const [i, result] of taskResult.entries()) {
    const newBase0 = { ...base[0] }; // または Object.assign({}, base[0])
    const newBase1 = { ...base[1] };
    newBase0["商品管理番号（商品URL）"] = `ecc-test-${i + 1}`;
    newBase1["商品管理番号（商品URL）"] = `ecc-test-${i + 1}`;
    newBase0["商品番号"] = `ECC-TEST-${i + 1}`;
    newBase0["商品名"] = result.name;
    newBase0["ジャンルID"] = result.category;
    newBase0["PC用商品説明文"] = result.description + "\n" + result.spec;
    newBase0["スマートフォン用商品説明文"] =
      result.description + "\n" + result.spec;
    newBase1["SKU管理番号"] = `ECC-TEST-${i + 1}`;
    newBase1["販売価格"] = result.price;
    newBase1["カタログID"] = result.janCode;
    newBase1["商品属性（値）3"] = result.brand;
    for (let i = 1; i <= result.imageQuantity && i <= 20; i++) {
      newBase0[`商品画像パス${i}`] = `${result.janCode}/${result.janCode}_${i}`;
    }
    records.push(newBase0);
    records.push(newBase1);
  }
  return records;
}
