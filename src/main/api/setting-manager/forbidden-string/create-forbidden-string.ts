import { db } from "../../../main";

import { ForbiddenString } from "../../../types/setting/forbidden-string";
export function createForbiddenString(forbiddenString: ForbiddenString) {
  // const db = new Database("sample.db");
  const insert = db.prepare(
    "INSERT INTO forbidden_string (target) VALUES (@target)"
  );
  insert.run(forbiddenString);
}
