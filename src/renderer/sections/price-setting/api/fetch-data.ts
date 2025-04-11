import { Dispatch, SetStateAction } from "react";
import { PriceSettingRow } from "../../../../main/types/setting/price-setting";

export const fetchAllPriceSetting = async (
  setTableData: Dispatch<SetStateAction<PriceSettingRow[]>>
) => {
  const data = await window.electron.ipcRenderer.getAllPriceSetting();
  setTableData(data);
};
