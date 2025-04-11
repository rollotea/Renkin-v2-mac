import { Dispatch, SetStateAction } from "react";
import { ReplacementStringRow } from "../../../../main/types/setting/replacement-string";

export const fetchAllReplacementString = async (
  setTableData: Dispatch<SetStateAction<ReplacementStringRow[]>>
) => {
  const data = await window.electron.ipcRenderer.getAllReplacementString();
  setTableData(data);
};
