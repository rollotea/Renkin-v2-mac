import { db } from "../../../main";

import * as fs from "fs";
import { TaskResult } from "../../../types/task-result";
import path from "path";

export function checkImageDirectly(task_id: string, taskResults: TaskResult[]) {
  // const db = new Database("sample.db");
  const stmt = db.prepare(
    "SELECT * FROM after_completion_file WHERE task_id = ?"
  );
  const file = stmt.get(task_id);
  const imageDir = file.imageDir;
  if (file) {
    for (const task of taskResults) {
      for (let i = 1; i <= task.imageQuantity; i++) {
        const targetPath = path.join(
          "image",
          imageDir,
          task.janCode,
          `${task.janCode}-${i}.jpg`
        );
        if (!fs.existsSync(targetPath)) {
          throw new Error(`ファイルが存在しません: ${targetPath}`);
        }
      }
    }
  }
}
