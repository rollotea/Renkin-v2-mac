import { getOutputBaseCsv } from "./get-base-csv";
import * as aq from "arquero";
import * as fs from "fs";
import { getRecordsFromTaskResult } from "./get-records-from-task-result";
import { mapTaskResultToBase } from "./map-task-result-to-base";
import { checkImageDirectly } from "./check-image-directly";
import path from "path";
import { getAfterCompletionFile } from "./get-after-completion-file";
import { getAfterCompletionFileByTaskId } from "./get-after-completion-file-by-task-id";
export async function outputCsv(id: string) {
  try {
    const taskResult = getRecordsFromTaskResult(id);
    checkImageDirectly(id, taskResult);
    const base = await getOutputBaseCsv();
    const records = mapTaskResultToBase(base, taskResult);
    const df = aq.from(records);
    const csv = df.toCSV(); // CSV文字列に変換
    const imageDir = getAfterCompletionFileByTaskId(id).imageDir;
    const savePath = path.join("output", `${imageDir}.csv`);
    if (!fs.existsSync("output")) {
      fs.mkdirSync("output", { recursive: true });
    }
    fs.writeFileSync(savePath, csv);
    return { success: true, message: `CSVを正常に出力しました: ${savePath}` };
  } catch (error) {
    return {
      success: false,
      message: `エラーが発生しました: ${(error as Error).message}`,
    };
  }
}
