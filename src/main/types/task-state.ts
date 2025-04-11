import { Item } from "../../renderer/store/ducks/queueSlice";
import type { ScrapingTemplateItem } from "../../renderer/store/ducks/scrapingTemplateQueueSlice";
import type { ErrorType } from "./scraping/error-type";
export type TaskState = {
  item: ScrapingTemplateItem | null;
  endValue: number;
  completed: number;
  canceled: number;
  errorLimit: number;
  errorType: ErrorType;
  status: "Pending" | "Canceled" | "Completed" | "In Progress";
};
// export type TaskState = {
//   item: Item | null;
//   total: number;
//   completed: number;
//   canceled: number;
//   status: "Pending" | "Canceled" | "Completed" | "In Progress";
// };
