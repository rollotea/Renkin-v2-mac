import { BrowserWindow } from "electron";
import puppeteer, { Page, Puppeteer, Browser } from "puppeteer";
import { ScrapingTemplateItem } from "../../../../renderer/store/ducks/scrapingTemplateQueueSlice";
import { makeItemListUrl } from "./make-item-list-url";
import { getItemList } from "./get-item-list";
import { getItemDetail } from "./get-item-detail";
import { ItemDetail } from "../../../types/scraping/item-detail";
import { createItemDetail } from "../api/create-item-detail";
import { TaskState } from "../../../types/task-state";
import { PresetFilters } from "../../../types/setting/preset-filters";
import { FilterError } from "../../../custom-error/filter-error";
import { AlreadyExistsError } from "../../../custom-error/already-exists";

export async function startMercariScraping(
  taskState: TaskState,
  // browser: Browser,
  page: Page,
  mainWindow: BrowserWindow,
  item: ScrapingTemplateItem,
  control: { shouldCancelTaskFlag: boolean },
  presetFilters: PresetFilters
) {
  const itemListUrl = await makeItemListUrl(item);

  let count = 0;
  while (true) {
    itemListUrl.searchParams.set("page_token", `v1:${count}`);
    count++;
    let itemUrlList: string[] | undefined = undefined;
    if (
      item.scrapingTemplate.endValue <= taskState.completed ||
      item.scrapingTemplate.errorLimit <= taskState.canceled
    ) {
      taskState.status = "Completed";
      mainWindow.webContents.send("message-from-main", {
        text: taskState,
      });
      return;
    }

    if (control.shouldCancelTaskFlag) {
      mainWindow.webContents.send("task-manager:notify-task-canceled", {
        stopped: item.scrapingTemplate.title,
      });
      return;
    }
    try {
      itemUrlList = await getItemList(page, itemListUrl);
    } catch (error) {
      taskState.canceled += 1;
      taskState.errorType.other += 1;
    } finally {
      mainWindow.webContents.send("message-from-main", {
        text: taskState,
      });
    }
    if (itemUrlList) {
      for (const itemUrl of itemUrlList) {
        if (control.shouldCancelTaskFlag) {
          mainWindow.webContents.send("task-manager:notify-task-canceled", {
            stopped: item.scrapingTemplate.title,
          });
          return;
        }
        if (
          item.scrapingTemplate.endValue <= taskState.completed ||
          item.scrapingTemplate.errorLimit <= taskState.canceled
        ) {
          taskState.status = "Completed";
          mainWindow.webContents.send("message-from-main", {
            text: taskState,
          });
          return;
        }
        try {
          // page = await browser.newPage();
          const itemDetail: ItemDetail = await getItemDetail(
            page,
            itemUrl,
            presetFilters
          );
          createItemDetail(itemDetail);
          taskState.completed += 1;
        } catch (error) {
          taskState.canceled += 1;
          if (error instanceof FilterError) {
            taskState.errorType.filter += 1;
          }
          if (error instanceof AlreadyExistsError) {
            taskState.errorType.alreadyExists += 1;
          }
        } finally {
          mainWindow.webContents.send("message-from-main", {
            text: taskState,
          });
        }
      }
    }
  }
}
