import { db } from "../../../main";

import { File } from "../../../types/file";

export function getAllFile() {
  const getAllRecord = (): File[] => {
    // const db = new Database("sample.db");
    const stmt = db.prepare("SELECT * FROM files");
    const files = stmt.all() as File[];
    return files;
  };
  const files = getAllRecord();
  const _files = files.map((file) => ({
    id: file.id,
    name: file.name,
    url: null,
    shred: null,
    // tags: null,
    size: file.size,
    createdAt: file.createdAt,
    modified: file.createdAt,
    type: `${file.name.split(".").pop()}`,
    isFavorited: file.isFavorited === 0 ? false : true,
  }));
  return _files;
}
