// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";
import { File } from "./types/file";
import { Item } from "../renderer/store/ducks/queueSlice";
import { ScrapingTemplate } from "./types/scraping/scraping-template";
import { ForbiddenString } from "./types/setting/forbidden-string";
import { ForbiddenSeller } from "./types/setting/forbidden-seller";
import { ReplacementString } from "./types/setting/replacement-string";
import { ScrapingTemplateItem } from "../renderer/store/ducks/scrapingTemplateQueueSlice";
import { PriceSetting } from "./types/setting/price-setting";
import { PresetFilters } from "./types/setting/preset-filters";
import { SettingType } from "./types/setting/setting-type";
// import { fetchAfterCompletionFile } from "../renderer/sections/output-file-manager/api/fetch-data";
export type Channels =
  | "ipc-example"
  | "task-manager:notify-task-canceled"
  | "message-from-main";

console.log("process", process);
const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    uploadFile: (files: (File | string)[]) =>
      ipcRenderer.invoke("input-file-manager:upload-file", files),
    uploadSettingFile: (type: SettingType, files: (File | string)[]) =>
      ipcRenderer.invoke("setting-manager:upload-setting-file", type, files),
    fetchData: () => ipcRenderer.invoke("input-file-manager:fetch-data"),
    fetchAfterCompletionFile: () =>
      ipcRenderer.invoke("output-file-manager:fetch-after-completion-file"),
    deleteItems: (id: string[]) =>
      ipcRenderer.invoke("input-file-manager:delete-items", id),
    deleteItem: (id: string) =>
      ipcRenderer.invoke("input-file-manager:delete-item", id),
    fetchFileById: (id: string): Promise<File | null> =>
      ipcRenderer.invoke("input-file-manager:fetch-file-by-id", id),
    startTask: (items: ScrapingTemplateItem[], presetFilters: PresetFilters) =>
      ipcRenderer.invoke("task-manager:start-task", items, presetFilters),
    onMessage: (callback: any) =>
      ipcRenderer.on("message-from-main", (event, data) => callback(data)),
    outputCsv: (id: string) =>
      ipcRenderer.invoke("output-file-manager:output-csv", id),
    cancelTask: () => ipcRenderer.invoke("task-manager:cancel-task"),
    deleteRecordsFromAfterCompletionFileById: (ids: string[]) =>
      ipcRenderer.invoke("output-file-manager:delete-items", ids),
    deleteRecordFromAfterCompletionFileById: (id: string) =>
      ipcRenderer.invoke("output-file-manager:delete-item", id),
    createNewTask: (scrapingTemplate: ScrapingTemplate) =>
      ipcRenderer.invoke("task-manager:create-new-task", scrapingTemplate),
    getScrapingTemplates: () =>
      ipcRenderer.invoke("task-manager:get-scraping-templates"),
    getScrapingTemplate: (id: string) =>
      ipcRenderer.invoke("task-manager:get-scraping-template"),
    deleteScrapingTemplate: (id: string) =>
      ipcRenderer.invoke("task-manager:delete-scraping-template", id),
    deleteScrapingTemplates: (ids: string[]) =>
      ipcRenderer.invoke("task-manager:delete-scraping-templates", ids),
    createPriceSetting: (priceSetting: PriceSetting) =>
      ipcRenderer.invoke("setting-manager:create-price-setting", priceSetting),
    deletePriceSetting: (id: string) =>
      ipcRenderer.invoke("setting-manager:delete-price-setting", id),
    deletePriceSettings: (ids: string[]) =>
      ipcRenderer.invoke("setting-manager:delete-price-settings", ids),
    getAllPriceSetting: () =>
      ipcRenderer.invoke("setting-manager:get-all-price-setting"),
    deleteItemDetail: (id: string) =>
      ipcRenderer.invoke("item-display-manager:delete-item-detail", id),
    deleteItemDetails: (ids: string[]) =>
      ipcRenderer.invoke("item-display-manager:delete-item-details", ids),

    getAssetPath: () => {
      if (process.platform === "darwin") {
        if (process.env.NODE_ENV === "development") {
          // return "/Users/koyamaryuji/Documents/Renkin-v2/release/build/mac-arm64/Renkin Revolution.app/Contents/Resources/app.asar"
          return "";
        }
          return process.execPath.replace(
            /Frameworks\/.+ Helper.app\/Contents\/MacOS\/.+ Helper/,
            "Resources/assets"
            // "Resources/app.asar"
          )
        }
      if (process.env.NODE_ENV === "development") {
        // return process.execPath
        //   .replace(/\\/g, "/")
        //   .replace("node_modules/electron/dist/electron.exe", "release/app");
        return "";
      }
      return process.execPath
        .replace(
          `\\${process.execPath.split(/[/\\]/).pop()}`,
          "/resources/app.asar"
        )
        .replace(/\\/g, "/");
    },
    createForbiddenString: (forbiddenString: ForbiddenString) =>
      ipcRenderer.invoke(
        "setting-manager:create-forbidden-string",
        forbiddenString
      ),
    getAllForbiddenString: () =>
      ipcRenderer.invoke("setting-manager:get-all-forbidden-string"),
    createForbiddenSeller: (forbiddenSeller: ForbiddenSeller) =>
      ipcRenderer.invoke(
        "setting-manager:create-forbidden-seller",
        forbiddenSeller
      ),
    getAllForbiddenSeller: () =>
      ipcRenderer.invoke("setting-manager:get-all-forbidden-seller"),
    createReplacementString: (replacementString: ReplacementString) =>
      ipcRenderer.invoke(
        "setting-manager:create-replacement-string",
        replacementString
      ),
    getAllReplacementString: () =>
      ipcRenderer.invoke("setting-manager:get-all-replacement-string"),
    getAllItemDetail: (presetFilters: PresetFilters) =>
      ipcRenderer.invoke(
        "item-display-manager:get-all-item-detail",
        presetFilters
      ),
    deleteForbiddenSeller: (id: string) =>
      ipcRenderer.invoke("setting-manager:delete-forbidden-seller", id),
    deleteForbiddenSellers: (ids: string[]) =>
      ipcRenderer.invoke("setting-manager:delete-forbidden-sellers", ids),
    deleteForbiddenString: (id: string) =>
      ipcRenderer.invoke("setting-manager:delete-forbidden-string", id),
    deleteForbiddenStrings: (ids: string[]) =>
      ipcRenderer.invoke("setting-manager:delete-forbidden-strings", ids),
    deleteReplacementString: (id: string) =>
      ipcRenderer.invoke("setting-manager:delete-replacement-string", id),
    deleteReplacementStrings: (ids: string[]) =>
      ipcRenderer.invoke("setting-manager:delete-replacement-strings", ids),
    getItemDetail: (id: string, presetFilters: PresetFilters) =>
      ipcRenderer.invoke(
        "item-display-manager:get-item-detail",
        id,
        presetFilters
      ),

    // notifyTaskCanceled: (callback: any) =>
    //   ipcRenderer.on(
    //     "task-manager:notify-task-canceled",
    //     (event, notification) => callback(notification)
    //   ),
  },
};

contextBridge.exposeInMainWorld("electron", electronHandler);

export type ElectronHandler = typeof electronHandler;
