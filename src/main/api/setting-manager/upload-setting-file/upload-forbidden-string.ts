import Papa from "papaparse";
import * as fs from "fs";
import { db } from "../../../main";

export const uploadForbiddenString = (filePath: string) => {
  const insert = db.prepare(
    "INSERT OR IGNORE INTO forbidden_string (target) VALUES (@target)"
  );

  const InsertMany = db.transaction(
    (dataRows: { character_name: string }[]) => {
      for (const data of dataRows) {
        if (data.character_name) {
          insert.run({
            target: data.character_name,
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
