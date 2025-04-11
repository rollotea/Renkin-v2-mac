import { db } from "../../../main";

import csv from "csv-parser";
import fs from "fs";
import path from "path";

export function getOutputBaseCsv(): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const filePath = path.join(
      __dirname.replace("\\dist\\main", ""),
      "assets",
      "output_base.csv"
    );
    const results: any[] = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results)) // ここでデータを返す
      .on("error", (error) => reject(error)); // エラーハンドリング
  });
}
