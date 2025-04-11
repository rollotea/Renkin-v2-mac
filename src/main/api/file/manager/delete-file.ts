import Database from "better-sqlite3";
import { db } from "../../../main";

import { string } from "zod";

const deleteFromInput = (db: Database, file_id: string | string[]) => {
  if (Array.isArray(file_id)) {
    const placeholders = file_id.map(() => "?").join(",");

    // SQL文を準備
    const stmt = db.prepare(
      `DELETE FROM input WHERE file_id IN (${placeholders})`
    );

    // 実行
    stmt.run(...file_id);
  } else {
    const stmt = db.prepare("DELETE FROM input WHERE file_id = ?");

    // 削除を実行（age = 30 のレコードをすべて削除）
    stmt.run(file_id);
  }
};

export const deleteRecordsById = (id: string[]): void => {
  // const db = new Database("sample.db");

  // プレースホルダーを動的に作成
  const placeholders = id.map(() => "?").join(",");

  // SQL文を準備
  const stmt = db.prepare(`DELETE FROM files WHERE id IN (${placeholders})`);

  // 実行
  const result = stmt.run(...id);
  deleteFromInput(db, id);
};

export const deleteRecordById = (id: string): void => {
  // const db = new Database("sample.db");

  const stmt = db.prepare("DELETE FROM files WHERE id = ?");

  // 実行
  const result = stmt.run(id);
  deleteFromInput(db, id);
};
