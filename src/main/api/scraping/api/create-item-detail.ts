import { db } from "../../../main";

import type { ItemDetail } from "../../../types/scraping/item-detail";
import { AlreadyExistsError } from "../../../custom-error/already-exists";
export function createItemDetail(itemDetail: ItemDetail) {
  try {
    // const db = new Database("sample.db");
    const insert = db.prepare(
      "INSERT INTO item_detail (url,sku,name,price,seller,main,sub_1,sub_2,sub_3,sub_4,sub_5,sub_6,sub_7,sub_8,description) VALUES (@url,@sku,@name,@price,@seller,@main,@sub_1,@sub_2,@sub_3,@sub_4,@sub_5,@sub_6,@sub_7,@sub_8,@description)"
    );
    insert.run(itemDetail);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("UNIQUE constraint failed")) {
        throw new AlreadyExistsError(itemDetail.url);
      }
    }
    throw new Error();
  }
}
