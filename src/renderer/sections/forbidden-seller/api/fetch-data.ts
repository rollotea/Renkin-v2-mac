import { Dispatch, SetStateAction } from "react";
import { ForbiddenSellerRow } from "../../../../main/types/setting/forbidden-seller";

export const fetchAllForbiddenSeller = async (
  setTableData: Dispatch<SetStateAction<ForbiddenSellerRow[]>>
) => {
  const data = await window.electron.ipcRenderer.getAllForbiddenSeller();
  setTableData(data);
};
