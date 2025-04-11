import { Dispatch, SetStateAction } from "react";
import { ForbiddenStringRow } from "../../../../main/types/setting/forbidden-string";

export const fetchAllForbiddenString = async (
  setTableData: Dispatch<SetStateAction<ForbiddenStringRow[]>>
) => {
  const data = await window.electron.ipcRenderer.getAllForbiddenString();
  setTableData(data);
};
