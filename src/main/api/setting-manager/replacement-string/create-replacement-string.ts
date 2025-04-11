import { db } from "../../../main";

import { ReplacementString } from "../../../types/setting/replacement-string";

export function createReplacementString(replacementString: ReplacementString) {
  // const db = new Database("sample.db");
  const insert = db.prepare(
    "INSERT INTO replacement_string (target, value) VALUES (@target, @value)"
  );
  insert.run(replacementString);
}
