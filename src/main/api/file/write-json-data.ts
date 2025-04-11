import path from "path";
import { Input } from "../../types/input";
import { MapJsonData } from "./map-json-data";
import { CreateNewFile } from "./manager/create-new-file";
import { GetJsonData } from "./get-json-data";
import { checkExist } from "./manager/check-exist";
import { getFileId } from "./manager/get-file-id";
import { db } from "../../main";

export async function handleFileUpload(event: any, inputFiles: string[]) {
  if (inputFiles) {
    inputFiles.map((file) => {
      const fileName = path.basename(file);
      // 同盟のファイルの有無の確認
      if (checkExist(fileName)) {
      } else {
        // filesテーブルに書き込み
        CreateNewFile(file);
        // fileIdの取得
        const fileId = getFileId(fileName);
        // inputテーブルに書き込み
        if (fileId) {
          const jsonData = GetJsonData(file);
          WriteJsonData(jsonData, file, fileId);
        }
      }
    });
  }
}

function WriteJsonData(jsonData: unknown[], filePath: string, fileId: number) {
  const fileName = path.basename(filePath);
  const inputData: Input[] = MapJsonData(jsonData);
  // const db = new Database("sample.db");
  // db.prepare(
  //   `
  //   CREATE TABLE IF NOT EXISTS input (
  //     id INTEGER PRIMARY KEY,
  //     ファイル名 TEXT,
  //     file_id INTEGER,
  //     レコードid INTEGER,
  //     カテゴリ名 TEXT,
  //     ブランド名称 TEXT,
  //     品番 TEXT,
  //     外箱_W INTEGER,
  //     外箱_D INTEGER,
  //     外箱_H INTEGER,
  //     外箱_重量 INTEGER,
  //     価格COM名 TEXT,
  //     メーカー商品ページ TEXT
  //   )
  // `
  // ).run();
  const insert = db.prepare(
    "INSERT INTO input (ファイル名, file_id, レコードid, カテゴリ名,ブランド名称,商品コード,品番,外箱_W,外箱_D,外箱_H,外箱_重量,Amazon_ASIN,価格COM名,メーカー商品ページ) VALUES (@ファイル名,@file_id,@レコードid,@カテゴリ名,@ブランド名称,@商品コード,@品番,@外箱_W,@外箱_D, @外箱_H, @外箱_重量, @Amazon_ASIN,@価格COM名, @メーカー商品ページ)"
  );

  const InsertMany = db.transaction((inputData: Input[], fileName: string) => {
    for (const [index, data] of inputData.entries()) {
      insert.run({
        ...data,
        ファイル名: fileName,
        レコードid: index,
        file_id: fileId,
      });
    }
  });
  InsertMany(inputData, fileName);
  // CreateNewFile(filePath);
}
