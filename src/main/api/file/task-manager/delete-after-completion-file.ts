import Database from "better-sqlite3";
import { db } from "../../../main";

const getTaskIdFromAfterCompletionFileById = (db: Database, id: string) => {
  const stmt = db.prepare(
    "SELECT task_id FROM after_completion_file WHERE id = ?"
  );
  const result = stmt.get(id);
  if (result) {
    return result.task_id;
  }
};
const deleteTaskResultByTaskId = (db: Database, task_id: string) => {
  const stmt = db.prepare("DELETE FROM task_result WHERE task_id = ?");
  stmt.run(task_id);
};
export const deleteRecordsFromAfterCompletionFileById = (
  ids: string[]
): void => {
  // const db = new Database("sample.db");

  if (ids.length === 0) return; // 空の配列なら処理しない
  for (const id of ids) {
    const task_id = getTaskIdFromAfterCompletionFileById(db, id);
    if (task_id) {
      deleteTaskResultByTaskId(db, task_id);
    }
  }

  const placeholders = ids.map(() => "?").join(",");
  const stmt = db.prepare(
    `DELETE FROM after_completion_file WHERE id IN (${placeholders})`
  );

  // トランザクションを適用（複数の削除を一括で処理）
  const deleteTransaction = db.transaction(() => {
    stmt.run(...ids);
  });

  deleteTransaction(); // 実行
  // db.close();
};

// 単一のIDを削除する関数
export const deleteRecordFromAfterCompletionFileById = (id: string): void => {
  // const db = new Database("sample.db");
  const task_id = getTaskIdFromAfterCompletionFileById(db, id);
  if (task_id) {
    deleteTaskResultByTaskId(db, task_id);
  }
  const stmt = db.prepare("DELETE FROM after_completion_file WHERE id = ?");
  stmt.run(id);
  // db.close();
};
