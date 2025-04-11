import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ScrapingTemplateRow } from "../../../main/types/scraping/scraping-template";
import { TaskState } from "../../../main/types/task-state";
import { RootState } from "../store";

export type ScrapingTemplateItem = {
  id: string;
  scrapingTemplate: ScrapingTemplateRow;
  status: "Pending" | "Canceled" | "Completed" | "In Progress";
};
export type ScrapingTemplateQueue = {
  list: ScrapingTemplateItem[];
};
const initialState: ScrapingTemplateQueue = {
  list: [],
};

export const scrapingTemplateQueueSlice = createSlice({
  name: "scrapingTemplateQueue",
  initialState,
  reducers: {
    addScrapingTemplateToQueue: (
      state,
      action: PayloadAction<ScrapingTemplateRow>
    ) => {
      const isDuplicate = state.list.some(
        (item) => item.scrapingTemplate.id === action.payload.id
      );
      const newItem: ScrapingTemplateItem = {
        id: action.payload.id,
        scrapingTemplate: action.payload,
        status: "Pending",
      };
      if (!isDuplicate) {
        state.list.push(newItem);
      } else {
        throw new Error("already exists");
        // console.log(`File "${action.payload.title}" はすでに存在します`);
      }
    },
    removeScrapingTemplateFromQueue: (
      state,
      action: PayloadAction<{ id: string }>
    ) => {
      const newQueueFiles = state.list.filter(
        (item) => item.id !== action.payload.id
      );
      state.list = newQueueFiles;
    },
    setTaskStateInQueue: (state, action: PayloadAction<TaskState>) => {
      if (!action.payload) return;
      state.list = state.list.map((item) =>
        item.id === action.payload.item?.id
          ? { ...item, status: action.payload.status }
          : item
      );
    },
  },
});

export const {
  addScrapingTemplateToQueue,
  removeScrapingTemplateFromQueue,
  setTaskStateInQueue,
} = scrapingTemplateQueueSlice.actions;

export const selectScrapingTemplateQueue = (state: RootState) =>
  state.scrapingTemplateQueue.list;

export default scrapingTemplateQueueSlice.reducer;
