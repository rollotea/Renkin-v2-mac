import { Dispatch, SetStateAction } from "react";
import { AfterCompletionFileRow } from "../../../../main/types/after-completion-file";
export const fetchAfterCompletionFile = async (
  setTableData: Dispatch<SetStateAction<AfterCompletionFileRow[]>>
) => {
  const _allFiles = await window.electron.ipcRenderer.fetchAfterCompletionFile();
  setTableData(_allFiles);
};
