import * as fs from "fs";

export function CheckFileSize(filePath: string) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}
