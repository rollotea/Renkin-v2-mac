import { db } from "../../../main";

export const deleteReplacementString = (id: string) => {
  // const db = new Database("sample.db");
  const stmt = db.prepare("DELETE FROM replacement_string WHERE id = ?");
  stmt.run(id);
};
