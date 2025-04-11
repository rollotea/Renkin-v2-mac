import { db } from "../../../main";

import { AfterCompletionFile } from "../../../types/after-completion-file";

export function writeAfterCompletionFile(
  after_completion_file: AfterCompletionFile
) {
  // const db = new Database("sample.db");
  const insert = db.prepare(
    "INSERT INTO after_completion_file (imageDir,task_id,file_id,fileName,total,completed,canceled) VALUES (@imageDir,@task_id,@file_id,@fileName,@total,@completed,@canceled)"
  );
  insert.run({
    imageDir: after_completion_file.imageDir,
    task_id: after_completion_file.task_id,
    file_id: after_completion_file.file_id,
    fileName: after_completion_file.fileName,
    total: after_completion_file.total,
    completed: after_completion_file.completed,
    canceled: after_completion_file.canceled,
  });
}
