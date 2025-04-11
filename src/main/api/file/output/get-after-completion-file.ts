import { db } from "../../../main";

import { AfterCompletionFileRow } from "../../../types/after-completion-file";

export function getAfterCompletionFile(): AfterCompletionFileRow[] {
  const getAllRecord = (): AfterCompletionFileRow[] => {
    // const db = new Database("sample.db");
    const stmt = db.prepare("SELECT * FROM after_completion_file");
    const files = stmt.all();
    return files;
  };
  const files = getAllRecord();
  const _files = files.map((file) => ({
    id: file.id.toString(),
    imageDir: file.imageDir,
    task_id: file.task_id,
    file_id: file.file_id.toString(),
    fileName: file.fileName,
    // type: `${file.fileName.split(".").pop()}`,
    total: file.total,
    completed: file.completed,
    canceled: file.canceled,
  }));
  return _files;
}
