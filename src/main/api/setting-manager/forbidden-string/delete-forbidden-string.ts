import { db } from "../../../main";

export const deleteForbiddenString = (id: string) => {
  // const db = new Database("sample.db");
  const stmt = db.prepare("DELETE FROM forbidden_string WHERE id = ?");
  stmt.run(id);
};
