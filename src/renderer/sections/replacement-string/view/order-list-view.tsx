import type { TableHeadCellProps } from "../../../components/table";
import type { IOrderItem, IOrderTableFilters } from "../../../types/order";

import { useState, useCallback, useEffect } from "react";
import { varAlpha } from "minimal-shared/utils";
import { useBoolean, useSetState } from "minimal-shared/hooks";

import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import TableBody from "@mui/material/TableBody";
import IconButton from "@mui/material/IconButton";

import { paths } from "../../../routes/paths";

import { fIsAfter, fIsBetween } from "../../../utils/format-time";

import { DashboardContent } from "../../../layouts/dashboard";
import { _orders, ORDER_STATUS_OPTIONS } from "../../../_mock";

import { Label } from "../../../components/label";
import { toast } from "../../../components/snackbar";
import { Iconify } from "../../../components/iconify";
import { Scrollbar } from "../../../components/scrollbar";
import { ConfirmDialog } from "../../../components/custom-dialog";
import { CustomBreadcrumbs } from "../../../components/custom-breadcrumbs";
import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from "../../../components/table";

import { OrderTableRow } from "../order-table-row";
import { OrderTableToolbar } from "../order-table-toolbar";
import { OrderTableFiltersResult } from "../order-table-filters-result";
import { ForbiddenStringRow } from "../../../../main/types/setting/forbidden-string";
import { fetchAllReplacementString } from "../api/fetch-data";
import { ReplacementStringRow } from "../../../../main/types/setting/replacement-string";
import { FileManagerNewFolderDialog } from "../../file-manager/file-manager-new-folder-dialog";
// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  ...ORDER_STATUS_OPTIONS,
];

const TABLE_HEAD: TableHeadCellProps[] = [
  // { id: "orderNumber", label: "Order", width: 88 },
  { id: "name", label: "Target String" },
  { id: "orderNumber", label: "Replacement String" },
  { id: "empty-1", label: "", width: 120 },
  { id: "empty-2", label: "", width: 140 },
  { id: "empty-3", label: "", width: 110 },
  { id: "createdAt", label: "Date", width: 140 },
  // { id: "totalQuantity", label: "Items", width: 120, align: "center" },
  // { id: "totalAmount", label: "Price", width: 140 },
  // { id: "status", label: "Status", width: 110 },
  { id: "empty-4", width: 88 },
];

// ----------------------------------------------------------------------

export function ReplacementStringListView() {
  const table = useTable({ defaultOrderBy: "orderNumber" });

  const confirmDialog = useBoolean();
  const newFilesDialog = useBoolean();

  // const [tableData, setTableData] = useState<IOrderItem[]>(_orders);
  const [tableData, setTableData] = useState<ReplacementStringRow[]>([]);
  useEffect(() => {
    fetchAllReplacementString(setTableData);
  }, [newFilesDialog]);

  const filters = useSetState<IOrderTableFilters>({
    name: "",
    status: "all",
    startDate: null,
    endDate: null,
  });
  const { state: currentFilters, setState: updateFilters } = filters;

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
    currentFilters.status !== "all" ||
    (!!currentFilters.startDate && !!currentFilters.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const renderNewFilesDialog = () => (
    <FileManagerNewFolderDialog
      type={{ type: "replacementString" }}
      open={newFilesDialog.value}
      onClose={newFilesDialog.onFalse}
    />
  );

  const handleDeleteRow = useCallback(
    async (id: string) => {
      try {
        const promise = window.electron.ipcRenderer.deleteReplacementString(id);
        toast.promise(promise, {
          loading: "Loading...",
          success: () => `Deleted!`,
          error: "Error",
          closeButton: false,
        });
        fetchAllReplacementString(setTableData);
      } catch (error) {
        console.log(error);
      }

      // const deleteRow = tableData.filter((row) => row.id !== id);

      // toast.success("Delete success!");

      // setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const handleDeleteRows = useCallback(async () => {
    try {
      const promise = window.electron.ipcRenderer.deleteReplacementStrings(
        table.selected
      );
      toast.promise(promise, {
        loading: "Loading...",
        success: () => `Deleted!`,
        error: "Error",
        closeButton: false,
      });
      fetchAllReplacementString(setTableData);
    } catch (error) {
      console.log(error);
    }

    // const deleteRows = tableData.filter(
    //   (row) => !table.selected.includes(row.id)
    // );

    // toast.success("Delete success!");

    // setTableData(deleteRows);

    table.onUpdatePageDeleteRows(dataInPage.length, dataFiltered.length);
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      table.onResetPage();
      updateFilters({ status: newValue });
    },
    [updateFilters, table]
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
            handleDeleteRows();
            confirmDialog.onFalse();
          }}
        >
          Delete
        </Button>
      }
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
          <CustomBreadcrumbs
            heading="List"
            links={[
              { name: "Dashboard", href: paths.dashboard.root },
              { name: "Filters", href: paths.dashboard.filters.root },
              { name: "Replacement String" },
            ]}
            sx={{ mb: { xs: 3, md: 5 } }}
          />
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:cloud-upload-fill" />}
            onClick={newFilesDialog.onTrue}
          >
            Upload
          </Button>
        </Box>

        <Card>
          {/* <Tabs
            value={currentFilters.status}
            onChange={handleFilterStatus}
            sx={[
              (theme) => ({
                px: 2.5,
                boxShadow: `inset 0 -2px 0 0 ${varAlpha(
                  theme.vars.palette.grey["500Channel"],
                  0.08
                )}`,
              }),
            ]}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={
                      ((tab.value === "all" ||
                        tab.value === currentFilters.status) &&
                        "filled") ||
                      "soft"
                    }
                    color={
                      (tab.value === "completed" && "success") ||
                      (tab.value === "pending" && "warning") ||
                      (tab.value === "cancelled" && "error") ||
                      "default"
                    }
                  >
                    {tableData.length}
                    {["completed", "pending", "cancelled", "refunded"].includes(
                      tab.value
                    )
                      ? tableData.filter((user) => user.status === tab.value)
                          .length
                      : tableData.length}
                  </Label>
                }
              />
            ))}
          </Tabs> */}

          <OrderTableToolbar
            fetchAllForbiddenString={fetchAllReplacementString}
            setTableData={setTableData}
            filters={filters}
            onResetPage={table.onResetPage}
            dateError={dateError}
          />

          {canReset && (
            <OrderTableFiltersResult
              filters={filters}
              totalResults={dataFiltered.length}
              onResetPage={table.onResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: "relative" }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirmDialog.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar sx={{ minHeight: 444 }}>
              <Table
                size={table.dense ? "small" : "medium"}
                sx={{ minWidth: 960 }}
              >
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headCells={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <OrderTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        // detailsHref={paths.dashboard.order.details(row.id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={table.dense ? 56 : 56 + 20}
                    emptyRows={emptyRows(
                      table.page,
                      table.rowsPerPage,
                      dataFiltered.length
                    )}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>

          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      </DashboardContent>

      {renderNewFilesDialog()}
      {renderConfirmDialog()}
    </>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  dateError: boolean;
  inputData: ReplacementStringRow[];
  // inputData: IOrderItem[];
  filters: IOrderTableFilters;
  comparator: (a: any, b: any) => number;
};

function applyFilter({
  inputData,
  comparator,
  filters,
  dateError,
}: ApplyFilterProps) {
  const { status, name, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(({ target, value }) =>
      [target, value].some((field) =>
        field?.toLowerCase().includes(name.toLowerCase())
      )
    );
  }

  // if (name) {
  //   inputData = inputData.filter(({ orderNumber, customer }) =>
  //     [orderNumber, customer.name, customer.email].some((field) =>
  //       field?.toLowerCase().includes(name.toLowerCase())
  //     )
  //   );
  // }

  // if (status !== "all") {
  //   inputData = inputData.filter((order) => order.status === status);
  // }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((order) =>
        fIsBetween(order.createdAt, startDate, endDate)
      );
    }
  }

  return inputData;
}
