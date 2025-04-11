import Papa from "papaparse";
import * as fs from "fs";
import { db } from "../../../main";

export const uploadPriceSetting = (filePath: string) => {
  const insert = db.prepare(
    "INSERT OR IGNORE INTO price_setting (range, value) VALUES (@range, @value)"
  );

  const InsertMany = db.transaction(
    (dataRows: { range_value: string; price: string }[]) => {
      for (const data of dataRows) {
        if (data.range_value && data.price) {
          insert.run({
            range: data.range_value,
            value: data.price,
          });
        }
      }
    }
  );

  const csvFile = fs.readFileSync(filePath, "utf8");
  Papa.parse(csvFile, {
    // download: true,
    header: true,
    complete: (results) => {
      InsertMany(results.data);
    },
  });
};
