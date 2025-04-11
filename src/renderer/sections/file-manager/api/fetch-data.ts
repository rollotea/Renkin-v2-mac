import { Dispatch, SetStateAction } from "react";
import { IFile } from "../../../types/file";

export const fetchData = async (
  setTableData: Dispatch<SetStateAction<IFile[]>>
) => {
  const _allFiles = await window.electron.ipcRenderer.fetchData();
  setTableData(_allFiles);
};
