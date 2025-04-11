export type AfterCompletionFile = {
  imageDir: string;
  task_id: string;
  file_id: string;
  fileName: string;
  total: number;
  completed: number;
  canceled: number;
};

export type AfterCompletionFileRow = {
  id: string;
  imageDir: string;
  task_id: string;
  file_id: string;
  fileName: string;
  total: number;
  completed: number;
  canceled: number;
};
