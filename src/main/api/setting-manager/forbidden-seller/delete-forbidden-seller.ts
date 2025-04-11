import { db } from "../../../main";

export const deleteForbiddenSeller = (id: string) => {
  // const db = new Database("sample.db");
  const stmt = db.prepare("DELETE FROM forbidden_seller WHERE id = ?");
  stmt.run(id);
};
