import { db } from "../../../main";

export const deletePriceSetting = (id: string) => {
  // const db = new Database("sample.db");
  const stmt = db.prepare("DELETE FROM price_setting WHERE id = ?");
  stmt.run(id);
};
