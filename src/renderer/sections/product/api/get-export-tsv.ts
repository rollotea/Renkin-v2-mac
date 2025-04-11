import Papa from "papaparse";
import Encoding from "encoding-japanese";
import { GridRowId, GridRowModel } from "@mui/x-data-grid";
import {
  mapFirstRow,
  mapSecondRow,
  baseObject,
} from "../../../assets/data/export-tsv";
export const getExportTsv = (rowData: Map<GridRowId, GridRowModel>) => {
  // export const getExportTsv = (rowData: Map<GridRowId, GridRowModel>) => {
  const firstRow = mapFirstRow();
  const secondRow = mapSecondRow();
  const baseRow = baseObject();
  const itemDetailRows = Array.from(rowData.values()).map((row) => ({
    ...row,
    ...baseRow,
    "Version=2024.0405": row.sku,
    "settings=contentLanguageTag=ja_JP&feedType=113&headerLanguageTag=ja_JP&metadataVersion=MatprodVkxBUHJvZC0xMTQ0&primaryMarketplaceId=amzn1.mp.o.A1VC38T7YXB528&templateIdentifier=02a2bf65-f3d4-4c17-a875-ac4db5407f03&timestamp=2021-10-25T16%3A47%3A43.222Z":
      row.name,
    "Unnamed: 10": row.price,
    "Unnamed: 11": row.main,
    画像: row.sub_1,
    "Unnamed: 14": row.sub_2,
    "Unnamed: 15": row.sub_3,
    "Unnamed: 16": row.sub_4,
    "Unnamed: 17": row.sub_5,
    "Unnamed: 18": row.sub_6,
    "Unnamed: 19": row.sub_7,
    "Unnamed: 20": row.sub_8,
    "Unnamed: 28": row.name,
    商品検索情報: row.name,
  }));
  const csv = Papa.unparse([firstRow, secondRow, ...itemDetailRows], {
    delimiter: "\t",
  });
  const tsvArray = Encoding.stringToCode(csv);
  const sjisArray = Encoding.convert(tsvArray, { to: "SJIS", from: "UNICODE" });
  const sjisUint8Array = new Uint8Array(sjisArray);
  const blob = new Blob([sjisUint8Array], {
    type: "text/tab-separated-values;",
  });
  // const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "custom_data.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
