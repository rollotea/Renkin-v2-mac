import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../store";
import { Input } from "../../../main/types/input";
import { File } from "../../../main/types/file";
import { TaskState } from "../../../main/types/task-state";
import type { ErrorType } from "../../../main/types/scraping/error-type";
const initialState: TaskState = {
  item: null,
  endValue: 0,
  completed: 0,
  canceled: 0,
  errorLimit: 0,
  errorType: { filter: 0, alreadyExists: 0, other: 0 },
  status: "Pending",
};

export const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setTask: (state, action: PayloadAction<{ taskState: TaskState }>) => {
      state.item = action.payload.taskState.item;
      state.endValue = action.payload.taskState.endValue;
      state.completed = action.payload.taskState.completed;
      state.canceled = action.payload.taskState.canceled;
      state.errorLimit = action.payload.taskState.errorLimit;
      state.errorType = action.payload.taskState.errorType;
      state.status = action.payload.taskState.status;
    },
    resetTask: () => initialState,
  },
});

export const { setTask, resetTask } = taskSlice.actions;

export const selectTask = (state: RootState) => state.task;

export default taskSlice.reducer;
