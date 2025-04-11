/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import * as fs from "fs";
import * as xlsx from "xlsx";
import { WorkBook, WorkSheet } from "xlsx";
import path from "path";
import { app, BrowserWindow, shell, ipcMain, screen, dialog } from "electron";
import { autoUpdater } from "electron-updater";
import log from "electron-log";
import MenuBuilder from "./menu";
import { resolveHtmlPath } from "./util";
import { handleFileUpload } from "./api/file/write-json-data";
import { getAllFile } from "./api/file/manager/get-all-file";
import {
  deleteRecordsById,
  deleteRecordById,
} from "./api/file/manager/delete-file";
import {
  deleteRecordFromAfterCompletionFileById,
  deleteRecordsFromAfterCompletionFileById,
} from "./api/file/task-manager/delete-after-completion-file";
import { initializeDataBase } from "./api/file/manager/database-initialize";
import { fetchFileById } from "./api/file/manager/fetch-file-data-by-id";
import { startTask } from "./api/file/task-manager/start-task";
import { getAfterCompletionFile } from "./api/file/output/get-after-completion-file";
import { outputCsv } from "./api/file/output/output-csv";
import { createNewTask } from "./api/file/task-manager/create-new-task";
import { getScrapingTemplates } from "./api/file/task-manager/get-scraping-templates";
import { createForbiddenString } from "./api/setting-manager/forbidden-string/create-forbidden-string";
import { ForbiddenString } from "./types/setting/forbidden-string";
import { getAllForbiddenString } from "./api/setting-manager/forbidden-string/get-all-forbidden-string";
import { getAllForbiddenSeller } from "./api/setting-manager/forbidden-seller/get-all-forbidden-seller";
import { ForbiddenSeller } from "./types/setting/forbidden-seller";
import { createForbiddenSeller } from "./api/setting-manager/forbidden-seller/create-forbidden-seller";
import { ReplacementString } from "./types/setting/replacement-string";
import { createReplacementString } from "./api/setting-manager/replacement-string/create-replacement-string";
import { getAllReplacementString } from "./api/setting-manager/replacement-string/get-all-replacement-string";
import { getAllItemDetail } from "./api/item-display.ts/get-all-item-detail";
import { deleteForbiddenSeller } from "./api/setting-manager/forbidden-seller/delete-forbidden-seller";
import { deleteForbiddenSellers } from "./api/setting-manager/forbidden-seller/delete-forbidden-sellers";
import { deleteForbiddenString } from "./api/setting-manager/forbidden-string/delete-forbidden-string";
import { deleteForbiddenStrings } from "./api/setting-manager/forbidden-string/delete-forbidden-strings";
import { deleteReplacementString } from "./api/setting-manager/replacement-string/delete-replacement-string";
import { deleteReplacementStrings } from "./api/setting-manager/replacement-string/delete-replacement-strings";
import { getItemDetail } from "./api/item-display.ts/get-item-detail";
import { getScrapingTemplate } from "./api/file/task-manager/get-scraping-template";
import { deleteScrapingTemplate } from "./api/file/task-manager/delete-scraping-template";
import { deleteScrapingTemplates } from "./api/file/task-manager/delete-scraping-templates";
import { createPriceSetting } from "./api/setting-manager/price-setting/create-price-setting";
import { PriceSettingRow } from "./types/setting/price-setting";
import { deletePriceSetting } from "./api/setting-manager/price-setting/delete-price-setting";
import { deletePriceSettings } from "./api/setting-manager/price-setting/delete-price-settings";
import { getAllPriceSetting } from "./api/setting-manager/price-setting/get-all-price-setting";
import { deleteItemDetail } from "./api/item-display.ts/delete-item-detail";
import { deleteItemDetails } from "./api/item-display.ts/delete-item-details";
import Darabase from "better-sqlite3";
import { uploadSettingFile } from "./api/setting-manager/upload-setting-file/upload-setting-file";

const dbPath = path.join(app.getPath("userData"), "app.db");
const db = new Darabase(dbPath);
export { db };

initializeDataBase();

class AppUpdater {
  constructor() {
    log.transports.file.level = "info";
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
// let shouldCancelTaskFlag = false;
const control = { shouldCancelTaskFlag: false };
ipcMain.on("ipc-example", async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply("ipc-example", msgTemplate("pong"));
});

if (process.env.NODE_ENV === "production") {
  const sourceMapSupport = require("source-map-support");
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === "development" || process.env.DEBUG_PROD === "true";

if (isDebug) {
  require("electron-debug")();
}
const installExtensions = async () => {
  const installer = require("electron-devtools-installer");
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ["REACT_DEVELOPER_TOOLS"];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, "assets")
    : path.join(__dirname, "../../assets");

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };
  // eslint-disable-next-line no-restricted-globals
  mainWindow = new BrowserWindow({
    // show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath("icon.png"),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, "preload.js")
        : path.join(__dirname, "../../.erb/dll/preload.js"),
    },
  });
  // mainWindow.webContents.send("config:get-asset-path", __dirname),
  // mainWindow.webContents.openDevTools();
  if (process.env.NODE_ENV === "production") {
    mainWindow.loadURL(resolveHtmlPath(`${__dirname}/../renderer/index.html`));
  } else {
    mainWindow.loadURL(resolveHtmlPath("index.html"));
  }
  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.webContents.insertCSS(`
      ul {
        padding-inline-start: 0;
      }
      li::marker {
        content: "";
      }
      .simplebar-placeholder {
        display: none;
      }
    `);
  });
  // mainWindow.loadURL(resolveHtmlPath('index.html'));
  // mainWindow.loadURL(resolveHtmlPath('/'));
  mainWindow.on("ready-to-show", () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: "deny" };
  });
  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (url.startsWith("file://")) {
      event.preventDefault();
      mainWindow.webContents.loadURL(
        resolveHtmlPath(`${__dirname}/../renderer/index.html`)
      );
    }
  });
  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on("window-all-closed", () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    ipcMain.handle("input-file-manager:upload-file", async (event, files) => {
      await handleFileUpload(event, files);
    });
    ipcMain.handle(
      "setting-manager:upload-setting-file",
      async (event, type, files) => {
        uploadSettingFile(type, files);
      }
    );
    ipcMain.handle("input-file-manager:fetch-data", async () => {
      return getAllFile();
    });
    ipcMain.handle(
      "output-file-manager:fetch-after-completion-file",
      async () => {
        return getAfterCompletionFile();
      }
    );
    ipcMain.handle("input-file-manager:delete-items", async (event, id) => {
      return deleteRecordsById(id);
    });
    ipcMain.handle("input-file-manager:delete-item", async (event, id) => {
      return deleteRecordById(id);
    });
    ipcMain.handle("input-file-manager:fetch-file-by-id", async (event, id) => {
      return fetchFileById(id);
    });
    ipcMain.handle(
      "task-manager:start-task",
      async (event, items, presetFilters) => {
        return startTask(mainWindow!, items, control, presetFilters);
      }
    );
    ipcMain.handle("output-file-manager:output-csv", async (event, id) => {
      const output = outputCsv(id);
      return output;
    });
    ipcMain.handle("task-manager:cancel-task", async (event) => {
      control.shouldCancelTaskFlag = true;
    });
    ipcMain.handle("output-file-manager:delete-items", async (event, ids) => {
      return deleteRecordsFromAfterCompletionFileById(ids);
    });
    ipcMain.handle("output-file-manager:delete-item", async (event, id) => {
      return deleteRecordFromAfterCompletionFileById(id);
    });
    ipcMain.handle("config:get-asset-path", async (event) => {
      return { dirName: __dirname };
    });
    ipcMain.handle(
      "task-manager:create-new-task",
      async (event, scrapingTemplate) => {
        return createNewTask(scrapingTemplate);
      }
    );
    ipcMain.handle("task-manager:get-scraping-templates", async (event) => {
      return getScrapingTemplates();
    });
    ipcMain.handle(
      "task-manager:get-scraping-template",
      async (event, id: string) => {
        return getScrapingTemplate(id);
      }
    );
    ipcMain.handle(
      "setting-manager:create-forbidden-string",
      async (event, forbiddenString: ForbiddenString) => {
        return createForbiddenString(forbiddenString);
      }
    );
    ipcMain.handle(
      "setting-manager:get-all-forbidden-string",
      async (event) => {
        return getAllForbiddenString();
      }
    );
    ipcMain.handle(
      "setting-manager:create-forbidden-seller",
      async (event, forbiddenSeller: ForbiddenSeller) => {
        return createForbiddenSeller(forbiddenSeller);
      }
    );
    ipcMain.handle(
      "setting-manager:get-all-forbidden-seller",
      async (event) => {
        return getAllForbiddenSeller();
      }
    );
    ipcMain.handle(
      "setting-manager:create-replacement-string",
      async (event, replacementString: ReplacementString) => {
        return createReplacementString(replacementString);
      }
    );
    ipcMain.handle(
      "setting-manager:get-all-replacement-string",
      async (event) => {
        return getAllReplacementString();
      }
    );
    ipcMain.handle(
      "item-display-manager:get-all-item-detail",
      async (event, presetFilters) => {
        return getAllItemDetail(presetFilters);
      }
    );
    ipcMain.handle(
      "setting-manager:delete-forbidden-seller",
      async (event, id: string) => {
        return deleteForbiddenSeller(id);
      }
    );
    ipcMain.handle(
      "setting-manager:delete-forbidden-sellers",
      async (event, ids: string[]) => {
        return deleteForbiddenSellers(ids);
      }
    );
    ipcMain.handle(
      "setting-manager:delete-forbidden-string",
      async (event, id: string) => {
        return deleteForbiddenString(id);
      }
    );
    ipcMain.handle(
      "setting-manager:delete-forbidden-strings",
      async (event, ids: string[]) => {
        return deleteForbiddenStrings(ids);
      }
    );
    ipcMain.handle(
      "setting-manager:delete-replacement-string",
      async (event, id: string) => {
        return deleteReplacementString(id);
      }
    );
    ipcMain.handle(
      "setting-manager:delete-replacement-strings",
      async (event, ids: string[]) => {
        return deleteReplacementStrings(ids);
      }
    );
    ipcMain.handle(
      "item-display-manager:get-item-detail",
      async (event, id: string, presetFilters) => {
        return getItemDetail(id, presetFilters);
      }
    );
    ipcMain.handle(
      "task-manager:delete-scraping-template",
      async (event, id: string) => {
        return deleteScrapingTemplate(id);
      }
    );
    ipcMain.handle(
      "task-manager:delete-scraping-templates",
      async (event, ids: string[]) => {
        return deleteScrapingTemplates(ids);
      }
    );
    ipcMain.handle(
      "setting-manager:create-price-setting",
      async (event, priceSetting: PriceSettingRow) => {
        return createPriceSetting(priceSetting);
      }
    );
    ipcMain.handle(
      "setting-manager:delete-price-setting",
      async (event, id: string) => {
        return deletePriceSetting(id);
      }
    );
    ipcMain.handle(
      "setting-manager:delete-price-settings",
      async (event, ids: string[]) => {
        return deletePriceSettings(ids);
      }
    );
    ipcMain.handle("setting-manager:get-all-price-setting", async (event) => {
      return getAllPriceSetting();
    });
    ipcMain.handle(
      "item-display-manager:delete-item-detail",
      async (event, id: string) => {
        return deleteItemDetail(id);
      }
    );
    ipcMain.handle(
      "item-display-manager:delete-item-details",
      async (event, ids: string[]) => {
        return deleteItemDetails(ids);
      }
    );

    createWindow();
    app.on("activate", () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
