import path from "path";
import { db } from "../../../main";
import { SettingType } from "../../../types/setting/setting-type";
import { uploadPriceSetting } from "./upload-price-setting";
import { uploadForbiddenSeller } from "./upload-forbidden-seller";
import { uploadReplacementString } from "./upload-replacement-string";
import { uploadForbiddenString } from "./upload-forbidden-string";

export function uploadSettingFile(type: SettingType, inputFiles: string[]) {
  if (inputFiles.length < 1) {
    throw new Error("No file");
  }
  const result: string[] = [];
  if (type.type === "price") {
    for (const inputFile of inputFiles) {
      try {
        uploadPriceSetting(inputFile);
        result.push(`${inputFile}: Success!`);
      } catch (error) {
        if (error instanceof Error) {
          result.push(error.message);
        }
      }
    }
  }
  if (type.type === "forbiddenSeller") {
    for (const inputFile of inputFiles) {
      try {
        uploadForbiddenSeller(inputFile);
        result.push(`${inputFile}: Success!`);
      } catch (error) {
        if (error instanceof Error) {
          result.push(error.message);
        }
      }
    }
  }
  if (type.type === "forbiddenString") {
    for (const inputFile of inputFiles) {
      try {
        uploadForbiddenString(inputFile);
        result.push(`${inputFile}: Success!`);
      } catch (error) {
        if (error instanceof Error) {
          result.push(error.message);
        }
      }
    }
  }
  if (type.type === "replacementString") {
    for (const inputFile of inputFiles) {
      try {
        uploadReplacementString(inputFile);
        result.push(`${inputFile}: Success!`);
      } catch (error) {
        if (error instanceof Error) {
          result.push(error.message);
        }
      }
    }
  }
  console.log(result);
  return result;
}
