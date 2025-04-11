import Papa from "papaparse";
import * as fs from "fs";
import { db } from "../../../main";

export const uploadReplacementString = (filePath: string) => {
  const insert = db.prepare(
    "INSERT OR IGNORE INTO replacement_string (target, value) VALUES (@target, @value)"
  );

  const InsertMany = db.transaction(
    (dataRows: { original_string: string; replace_string: string }[]) => {
      for (const data of dataRows) {
        if (data.original_string) {
          insert.run({
            target: data.original_string,
            value: data.replace_string,
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
