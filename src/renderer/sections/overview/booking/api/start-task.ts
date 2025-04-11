import { PresetFilters } from "../../../../../main/types/setting/preset-filters";
import { Item } from "../../../../store/ducks/queueSlice";
import type { ScrapingTemplateItem } from "../../../../store/ducks/scrapingTemplateQueueSlice";
export const startTask = async (
  items: ScrapingTemplateItem[],
  presetFilters: PresetFilters
) => {
  window.electron.ipcRenderer.startTask(items, presetFilters);
};
