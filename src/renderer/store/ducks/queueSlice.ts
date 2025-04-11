import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { IFile, IFileFilters } from "../../types/file";
import { TaskState } from "../../../main/types/task-state";
import { RootState } from "../store";

export type Item = {
  id: string;
  file: IFile;
  status: "Pending" | "Canceled" | "Completed" | "In Progress";
};
export type Queue = {
  list: Item[];
};
const initialState: Queue = {
  list: [],
};
export type File = {
  id: string;
  name: string;
  size: number;
  isFavorited: number;
  createdAt: string;
};

export const queueSlice = createSlice({
  name: "queue",
  initialState,
  reducers: {
    addQueueFiles: (state, action: PayloadAction<File>) => {
      const ifile: IFile = {
        id: action.payload.id,
        url: "",
        name: action.payload.name,
        size: action.payload.size,
        type: "",
        tags: [],
        isFavorited: !!action.payload.isFavorited,
        createdAt: action.payload.createdAt,
        modifiedAt: "",
        shared: [],
      };
      const isDuplicate = state.list.some((item) => item.file.id === ifile.id);
      const newItem: Item = {
        id: action.payload.id,
        file: ifile,
        status: "Pending",
      };
      if (!isDuplicate) {
        state.list.push(newItem);
      } else {
        console.log(`File "${action.payload.name}" はすでに存在します`);
      }
    },
    deleteQueueFile: (state, action: PayloadAction<{ id: string }>) => {
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
  addQueueFiles,
  deleteQueueFile,
  // setTaskStateInQueue,
} = queueSlice.actions;

export const selectQueueFiles = (state: RootState) => state.queueFiles.list;

export default queueSlice.reducer;
