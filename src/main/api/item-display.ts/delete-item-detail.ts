import { db } from "../../main";

export const deleteItemDetail = (id: string) => {
  // const db = new Database("sample.db");
  const stmt = db.prepare("DELETE FROM item_detail WHERE id = ?");
  stmt.run(id);
};
