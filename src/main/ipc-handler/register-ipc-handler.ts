// import { ipcMain } from "electron";
// import { handleFileUpload } from "../api/file/write-json-data";
// import { getAllFile } from "../api/file/manager/get-all-file";
// import {
//   deleteRecordsById,
//   deleteRecordById,
// } from "../api/file/manager/delete-file";
// import {
//   deleteRecordFromAfterCompletionFileById,
//   deleteRecordsFromAfterCompletionFileById,
// } from "../api/file/task-manager/delete-after-completion-file";
// import { initializeDataBase } from "../api/file/manager/database-initialize";
// import { fetchFileById } from "../api/file/manager/fetch-file-data-by-id";
// import { startTask } from "../api/file/task-manager/start-task";
// import { getAfterCompletionFile } from "../api/file/output/get-after-completion-file";
// import { outputCsv } from "../api/file/output/output-csv";
// import { createNewTask } from "../api/file/task-manager/create-new-task";
// import { getScrapingTemplates } from "../api/file/task-manager/get-scraping-templates";
// const ipcHandlers = {
//   "input-file-manager:upload-file": async (event, files) =>
//     handleFileUpload(event, files),
//   "input-file-manager:fetch-data": async () => getAllFile(),
//   "output-file-manager:fetch-after-completion-file": async () =>
//     getAfterCompletionFile(),
//   "input-file-manager:delete-items": async (event, id) => deleteRecordsById(id),
//   "input-file-manager:delete-item": async (event, id) => deleteRecordById(id),
//   "input-file-manager:fetch-file-by-id": async (event, id) => fetchFileById(id),
//   "task-manager:start-task": async (event, items) =>
//     startTask(mainWindow!, items, control),
//   "output-file-manager:output-csv": async (event, id) => outputCsv(id),
//   "task-manager:cancel-task": async (event) => {
//     control.shouldCancelTaskFlag = true;
//   },
//   "output-file-manager:delete-items": async (event, ids) =>
//     deleteRecordsFromAfterCompletionFileById(ids),
//   "output-file-manager:delete-item": async (event, id) =>
//     deleteRecordFromAfterCompletionFileById(id),
//   "config:get-asset-path": async () => ({ dirName: __dirname }),
//   "task-manager:create-new-task": async (event, scrapingTemplate) =>
//     createNewTask(scrapingTemplate),
//   "task-manager:get-scraping-templates": async () => getScrapingTemplates(),
// };

// export const registerIpcHandlers = () => {
//   for (const [channel, handler] of Object.entries(ipcHandlers)) {
//     ipcMain.handle(channel, handler);
//   }
// };
