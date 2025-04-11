import { db } from "../../../main";

import path from "path";
import { File } from "../../../types/file";
import { CheckFileSize } from "./check-file-size";

export function CreateNewFile(filePath: string) {
  const fileName = path.basename(filePath);
  const size = CheckFileSize(filePath);
  // const db = new Database("sample.db");
  // db.prepare(
  //   `
  //   CREATE TABLE IF NOT EXISTS files (
  //     id INTEGER PRIMARY KEY,
  //     name TEXT,
  //     size INTEGER,
  //     isFavorited INTEGER,
  //     createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  //   );
  //   `
  // ).run();
  const insert = db.prepare(
    "INSERT INTO files (name, size, isFavorited) VALUES (@name, @size, @isFavorited)"
  );
  insert.run({ name: fileName, size: size, isFavorited: 0 });
}
