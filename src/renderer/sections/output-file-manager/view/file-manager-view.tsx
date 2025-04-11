import type { IFile, IFileFilters } from "../../../types/file";

import { useState, useCallback, useEffect } from "react";
import { useBoolean, useSetState } from "minimal-shared/hooks";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import { fIsAfter, fIsBetween } from "../../../utils/format-time";

import { DashboardContent } from "../../../layouts/dashboard";
import { _allFiles, FILE_TYPE_OPTIONS } from "../../../_mock";

import { toast } from "../../../components/snackbar";
import { Iconify } from "../../../components/iconify";
import { fileFormat } from "../../../components/file-thumbnail";
import { EmptyContent } from "../../../components/empty-content";
import { ConfirmDialog } from "../../../components/custom-dialog";
import { useTable, rowInPage, getComparator } from "../../../components/table";

import { FileManagerTable } from "../file-manager-table";
import { FileManagerFilters } from "../file-manager-filters";
import { FileManagerGridView } from "../file-manager-grid-view";
import { FileManagerFiltersResult } from "../file-manager-filters-result";
import { FileManagerNewFolderDialog } from "../file-manager-new-folder-dialog";
// import { fetchData } from "../api/fetch-data";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  selectQueueFiles,
  addQueueFiles,
} from "../../../store/ducks/queueSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../store/store";
import { AfterCompletionFileRow } from "../../../../main/types/after-completion-file";
import { fetchAfterCompletionFile } from "../api/fetch-after-completion-file";
// ----------------------------------------------------------------------

export function OutputFileManagerView() {
  const queueIds = useSelector(selectQueueFiles); // 状態を取得
  const dispatch = useDispatch<AppDispatch>();
  const table = useTable({ defaultRowsPerPage: 10 });

  const dateRange = useBoolean();
  const confirmDialog = useBoolean();
  const enqueueConfirmDialog = useBoolean();
  const newFilesDialog = useBoolean();

  const [displayMode, setDisplayMode] = useState("list");

  const [tableData, setTableData] = useState<AfterCompletionFileRow[]>([]);
  // const [tableData, setTableData] = useState<IFile[]>(_allFiles);
  // const fetchData = async () => {
  //   const _allFiles = await window.electron.ipcRenderer.fetchData();
  //   setTableData(_allFiles);
  // };
  useEffect(() => {
    fetchAfterCompletionFile(setTableData);
  }, [newFilesDialog]);

  const filters = useSetState<IFileFilters>({
    name: "",
    type: [],
    startDate: null,
    endDate: null,
  });
  const { state: currentFilters } = filters;

  const dateError = fIsAfter(currentFilters.startDate, currentFilters.endDate);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: currentFilters,
    dateError,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!currentFilters.name ||
    currentFilters.type.length > 0 ||
    (!!currentFilters.startDate && !!currentFilters.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleChangeView = useCallback(
    (event: React.MouseEvent<HTMLElement>, newView: string | null) => {
      if (newView !== null) {
        setDisplayMode(newView);
      }
    },
    []
  );

  const handleDeleteItem = useCallback(
    async (id: string) => {
      // const deleteRow = tableData.filter((row) => row.id !== id);

      // toast.success("Delete success!");

      // setTableData(deleteRow);

      // table.onUpdatePageDeleteRow(dataInPage.length);
      try {
        await window.electron.ipcRenderer.deleteRecordFromAfterCompletionFileById(
          id
        ); // データベースから削除
        toast.success("Delete success!");

        await fetchAfterCompletionFile(setTableData); // 🔥 削除後に最新のデータを取得

        table.onUpdatePageDeleteRows(dataInPage.length, dataFiltered.length);
      } catch (error) {
        console.error("Error deleting files:", error);
        toast.error("Error deleting files.");
      }
    },
    [dataInPage.length, table, tableData]
  );

  const handleDeleteItems = useCallback(async () => {
    try {
      await window.electron.ipcRenderer.deleteRecordsFromAfterCompletionFileById(
        table.selected
      ); // データベースから削除
      toast.success("Delete success!");
      console.log("table.selected", table.selected);

      await fetchAfterCompletionFile(setTableData); // 🔥 削除後に最新のデータを取得

      table.onUpdatePageDeleteRows(dataInPage.length, dataFiltered.length);
    } catch (error) {
      console.error("Error deleting files:", error);
      toast.error("Error deleting files.");
    }
  }, [dataFiltered.length, dataInPage.length, table, tableData]);
  const handleOutputItem = useCallback(
    async (id: string) => {
      // const deleteRow = tableData.filter((row) => row.id !== id);

      // toast.success("Delete success!");

      // setTableData(deleteRow);

      // table.onUpdatePageDeleteRow(dataInPage.length);
      try {
        const result = await window.electron.ipcRenderer.outputCsv(id); // データベースから削除
        if (result.success) {
          toast.success("Output success!");
        } else {
          toast.error(result.message);
        }
        await fetchAfterCompletionFile(setTableData); // 🔥 削除後に最新のデータを取得

        table.onUpdatePageDeleteRows(dataInPage.length, dataFiltered.length);
      } catch (error) {
        console.error("Error output files:", error);
        toast.error("Error output files.");
      }
    },
    [dataInPage.length, table, tableData]
  );

  const renderFilters = () => (
    <Box
      sx={{
        gap: 2,
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: { xs: "flex-end", md: "center" },
      }}
    >
      <FileManagerFilters
        filters={filters}
        dateError={dateError}
        onResetPage={table.onResetPage}
        openDateRange={dateRange.value}
        onOpenDateRange={dateRange.onTrue}
        onCloseDateRange={dateRange.onFalse}
        options={{ types: FILE_TYPE_OPTIONS }}
      />

      <ToggleButtonGroup
        size="small"
        value={displayMode}
        exclusive
        onChange={handleChangeView}
      >
        <ToggleButton value="list">
          <Iconify icon="solar:list-bold" />
        </ToggleButton>

        <ToggleButton value="grid">
          <Iconify icon="mingcute:dot-grid-fill" />
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );

  const renderResults = () => (
    <FileManagerFiltersResult
      filters={filters}
      totalResults={dataFiltered.length}
      onResetPage={table.onResetPage}
    />
  );

  const renderNewFilesDialog = () => (
    <FileManagerNewFolderDialog
      open={newFilesDialog.value}
      onClose={newFilesDialog.onFalse}
    />
  );

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete"
      content={
        <>
          Are you sure want to delete <strong> {table.selected.length} </strong>{" "}
          items?
        </>
      }
      action={
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            handleDeleteItems();
            confirmDialog.onFalse();
          }}
        >
          Delete
        </Button>
      }
    />
  );

  const renderEnqueueConfirmDialog = () => (
    <ConfirmDialog
      open={enqueueConfirmDialog.value}
      onClose={enqueueConfirmDialog.onFalse}
      title="Enqueue"
      content={
        <>
          日本語Are you sure want to delete{" "}
          <strong> {table.selected.length} </strong> items?
        </>
      }
      action={
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            handleEnqueueItems();
            enqueueConfirmDialog.onFalse();
          }}
        >
          Enqueue
        </Button>
      }
    />
  );

  const renderList = () => (
    <FileManagerTable
      table={table}
      dataFiltered={dataFiltered}
      onDeleteRow={handleDeleteItem}
      onOutputRow={handleOutputItem}
      notFound={notFound}
      onOpenConfirm={confirmDialog.onTrue}
      onOpneEnqueueConfirm={enqueueConfirmDialog.onTrue}
    />
  );

  return (
    <>
      <DashboardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h4">Output</Typography>
          {/* <Button
            variant="contained"
            startIcon={<Iconify icon="eva:cloud-upload-fill" />}
            onClick={newFilesDialog.onTrue}
          >
            Upload
          </Button> */}
        </Box>

        <Stack spacing={2.5} sx={{ my: { xs: 3, md: 5 } }}>
          {/* {renderFilters()}
          {canReset && renderResults()} */}
        </Stack>

        {notFound ? <EmptyContent filled sx={{ py: 10 }} /> : renderList()}
      </DashboardContent>

      {renderNewFilesDialog()}
      {renderConfirmDialog()}
      {renderEnqueueConfirmDialog()}
    </>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  dateError: boolean;
  inputData: AfterCompletionFileRow[];
  // inputData: IFile[];
  filters: IFileFilters;
  comparator: (a: any, b: any) => number;
};

function applyFilter({
  inputData,
  comparator,
  filters,
  dateError,
}: ApplyFilterProps) {
  const { name, type, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter((file) =>
      file.fileName.toLowerCase().includes(name.toLowerCase())
    );
  }

  // if (type.length) {
  //   inputData = inputData.filter((file) =>
  //     type.includes(fileFormat(file.type))
  //   );
  // }

  // if (!dateError) {
  //   if (startDate && endDate) {
  //     inputData = inputData.filter((file) =>
  //       fIsBetween(file.createdAt, startDate, endDate)
  //     );
  //   }
  // }

  return inputData;
}
