import { db } from "../../../main";

import { TaskResult } from "../../../types/task-result";

export function getRecordsFromTaskResult(task_id: string) {
  // const db = new Database("sample.db");
  const stmt = db.prepare("SELECT * FROM task_result WHERE task_id = ?");
  const result = stmt.all(task_id) as TaskResult[];
  return result;
}
