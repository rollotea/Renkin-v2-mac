import { db } from "../../../main";

import { AfterCompletionFileRow } from "../../../types/after-completion-file";

export function getAfterCompletionFileByTaskId(
  task_id: string
): AfterCompletionFileRow {
  // const db = new Database("sample.db");
  const stmt = db.prepare(
    "SELECT * FROM after_completion_file WHERE task_id = ?"
  );
  const file = stmt.get(task_id);
  return file;
}
