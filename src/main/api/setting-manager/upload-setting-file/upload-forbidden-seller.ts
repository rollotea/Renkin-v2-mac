import Papa from "papaparse";
import * as fs from "fs";
import { db } from "../../../main";

export const uploadForbiddenSeller = (filePath: string) => {
  const insert = db.prepare(
    "INSERT OR IGNORE INTO forbidden_seller (seller) VALUES (@seller)"
  );

  const InsertMany = db.transaction((dataRows: { seller_name: string }[]) => {
    for (const data of dataRows) {
      if (data.seller_name) {
        insert.run({
          seller: data.seller_name,
        });
      }
    }
  });

  const csvFile = fs.readFileSync(filePath, "utf8");
  Papa.parse(csvFile, {
    // download: true,
    header: true,
    complete: (results) => {
      InsertMany(results.data);
    },
  });
};
