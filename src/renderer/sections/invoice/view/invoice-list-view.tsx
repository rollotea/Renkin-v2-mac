import type { TableHeadCellProps } from "../../../components/table";
import type { IInvoice, IInvoiceTableFilters } from "../../../types/invoice";

import { sumBy } from "es-toolkit";
import { useState, useCallback, useEffect } from "react";
import { varAlpha } from "minimal-shared/utils";
import { useBoolean, useSetState } from "minimal-shared/hooks";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import TableBody from "@mui/material/TableBody";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";

import { paths } from "../../../routes/paths";
import { RouterLink } from "../../../routes/components";

import { fIsAfter, fIsBetween } from "../../../utils/format-time";

import { DashboardContent } from "../../../layouts/dashboard";
import { _invoices, INVOICE_SERVICE_OPTIONS } from "../../../_mock";

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

import { addScrapingTemplateToQueue } from "../../../store/ducks/scrapingTemplateQueueSlice";
import { InvoiceAnalytic } from "../invoice-analytic";
import { InvoiceTableRow } from "../invoice-table-row";
import { InvoiceTableToolbar } from "../invoice-table-toolbar";
import { InvoiceTableFiltersResult } from "../invoice-table-filters-result";
import {
  ScrapingTemplateRow,
  ScrapingTemplateTableFilters,
} from "../../../../main/types/scraping/scraping-template";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";

// ----------------------------------------------------------------------

const TABLE_HEAD: TableHeadCellProps[] = [
  { id: "invoiceNumber", label: "Title" },
  { id: "createDate", label: "Create" },
  { id: "dueDate", label: "Category" },
  { id: "price", label: "End Value" },
  { id: "sent", label: "Error Limit" },
  { id: "status", label: "Platform" },
  { id: "" },

  // { id: "invoiceNumber", label: "Customer" },
  // { id: "createDate", label: "Create" },
  // { id: "dueDate", label: "Due" },
  // { id: "price", label: "Amount" },
  // { id: "sent", label: "Sent", align: "center" },
  // { id: "status", label: "Status" },
  // { id: "" },
];

// ----------------------------------------------------------------------

export function InvoiceListView() {
  const queue = useSelector((state: RootState) => state.scrapingTemplateQueue);
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();

  const table = useTable({ defaultOrderBy: "createDate" });

  const confirmDialog = useBoolean();
  const confirmEnqueueDialog = useBoolean();

  const [tableData, setTableData] = useState<ScrapingTemplateRow[]>([]);

  const fetchScrapingTemplate = useCallback(async () => {
    const data = await window.electron.ipcRenderer.getScrapingTemplates();
    setTableData(data);
  }, []);
  useEffect(() => {
    fetchScrapingTemplate();
  }, []);

  // const [tableData, setTableData] = useState<IInvoice[]>(_invoices);

  const filters = useSetState<IInvoiceTableFilters>({
    name: "",
    service: [],
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
    currentFilters.service.length > 0 ||
    currentFilters.status !== "all" ||
    (!!currentFilters.startDate && !!currentFilters.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const getInvoiceLength = (status: string) =>
    tableData.filter((item) => item.platform === status).length;

  // const getTotalAmount = (status: string) =>
  //   sumBy(
  //     tableData.filter((item) => item.platform === status),
  //     (invoice) => invoice.totalAmount
  //   );

  const getPercentByStatus = (status: string) =>
    (getInvoiceLength(status) / tableData.length) * 100;

  const TABS = [
    {
      value: "all",
      label: "All",
      color: "default",
      count: tableData.length,
    },
    {
      value: "paid",
      label: "Paid",
      color: "success",
      count: getInvoiceLength("paid"),
    },
    {
      value: "pending",
      label: "Pending",
      color: "warning",
      count: getInvoiceLength("pending"),
    },
    {
      value: "overdue",
      label: "Overdue",
      color: "error",
      count: getInvoiceLength("overdue"),
    },
    {
      value: "draft",
      label: "Draft",
      color: "default",
      count: getInvoiceLength("draft"),
    },
  ] as const;

  const handleDeleteRow = useCallback(
    async (id: string) => {
      try {
        await window.electron.ipcRenderer.deleteScrapingTemplate(id);
        toast.success("Delete success!");
      } catch (error) {
        toast.error("Error");
      }
      fetchScrapingTemplate();
      // const deleteRow = tableData.filter((row) => row.id !== id);

      // setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const handleEnqueueRow = useCallback(
    (scrapingTemplate: ScrapingTemplateRow) => {
      // const deleteRow = tableData.filter((row) => row.id !== id);
      try {
        if (scrapingTemplate) {
          dispatch(addScrapingTemplateToQueue(scrapingTemplate));
        }
        toast.success("Enqueue success!");
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
          return;
        }
        toast.error("Error enqueuing template");
      }

      // setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const handleDeleteRows = useCallback(async () => {
    try {
      await window.electron.ipcRenderer.deleteScrapingTemplates(table.selected);
      toast.success("Delete success!");
    } catch (error) {
      toast.error("Error");
    }
    fetchScrapingTemplate();
    // const deleteRows = tableData.filter(
    //   (row) => !table.selected.includes(row.id)
    // );

    // setTableData(deleteRows);

    table.onUpdatePageDeleteRows(dataInPage.length, dataFiltered.length);
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleEnqueueRows = useCallback(async () => {
    const enqueueRows = tableData.filter((row) =>
      table.selected.includes(row.id)
    );
    try {
      if (enqueueRows.length > 0) {
        enqueueRows.map((row) => {
          dispatch(addScrapingTemplateToQueue(row));
        });
      }
      toast.success("Enqueue success!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        return;
      }
      toast.error("Error enqueuing template");
    }

    // try {
    //   await window.electron.ipcRenderer.deleteScrapingTemplates(table.selected);
    //   toast.success("Delete success!");
    // } catch (error) {
    //   toast.error("Error");
    // }
    fetchScrapingTemplate();
    // const deleteRows = tableData.filter(
    //   (row) => !table.selected.includes(row.id)
    // );

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

  const renderConfirmEnqueueDialog = () => (
    <ConfirmDialog
      open={confirmEnqueueDialog.value}
      onClose={confirmEnqueueDialog.onFalse}
      title="Enqueue"
      content={
        <>
          Are you sure want to enqueue{" "}
          <strong> {table.selected.length} </strong> items?
        </>
      }
      action={
        <Button
          variant="contained"
          color="error"
          onClick={async () => {
            await handleEnqueueRows();
            confirmEnqueueDialog.onFalse();
          }}
        >
          Enqueue
        </Button>
      }
    />
  );
  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: "Dashboard", href: paths.dashboard.root },
            { name: "Templates", href: paths.dashboard.job.root },
            { name: "List" },
          ]}
          // action={
          //   <Button
          //     component={RouterLink}
          //     href={paths.dashboard.invoice.new}
          //     variant="contained"
          //     startIcon={<Iconify icon="mingcute:add-line" />}
          //   >
          //     New invoice
          //   </Button>
          // }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        {/* <Card sx={{ mb: { xs: 3, md: 5 } }}>
          <Scrollbar sx={{ minHeight: 108 }}>
            <Stack
              divider={
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ borderStyle: "dashed" }}
                />
              }
              sx={{ py: 2, flexDirection: "row" }}
            >
              <InvoiceAnalytic
                title="Total"
                total={tableData.length}
                percent={100}
                // price={sumBy(tableData, (invoice) => invoice.totalAmount)}
                icon="solar:bill-list-bold-duotone"
                color={theme.vars.palette.info.main}
              />

              <InvoiceAnalytic
                title="Paid"
                total={getInvoiceLength("paid")}
                percent={getPercentByStatus("paid")}
                // price={getTotalAmount("paid")}
                icon="solar:file-check-bold-duotone"
                color={theme.vars.palette.success.main}
              />

              <InvoiceAnalytic
                title="Pending"
                total={getInvoiceLength("pending")}
                percent={getPercentByStatus("pending")}
                // price={getTotalAmount("pending")}
                icon="solar:sort-by-time-bold-duotone"
                color={theme.vars.palette.warning.main}
              />

              <InvoiceAnalytic
                title="Overdue"
                total={getInvoiceLength("overdue")}
                percent={getPercentByStatus("overdue")}
                // price={getTotalAmount("overdue")}
                icon="solar:bell-bing-bold-duotone"
                color={theme.vars.palette.error.main}
              />

              <InvoiceAnalytic
                title="Draft"
                total={getInvoiceLength("draft")}
                percent={getPercentByStatus("draft")}
                // price={getTotalAmount("draft")}
                icon="solar:file-corrupted-bold-duotone"
                color={theme.vars.palette.text.secondary}
              />
            </Stack>
          </Scrollbar>
        </Card> */}

        <Card>
          {/* <Tabs
            value={currentFilters.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: `inset 0 -2px 0 0 ${varAlpha(
                theme.vars.palette.grey["500Channel"],
                0.08
              )}`,
            }}
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                iconPosition="end"
                icon={
                  <Label
                    variant={
                      ((tab.value === "all" ||
                        tab.value === currentFilters.status) &&
                        "filled") ||
                      "soft"
                    }
                    color={tab.color}
                  >
                    {tab.count}
                  </Label>
                }
              />
            ))}
          </Tabs> */}

          <InvoiceTableToolbar
            filters={filters}
            dateError={dateError}
            onResetPage={table.onResetPage}
            options={{
              services: INVOICE_SERVICE_OPTIONS.map((option) => option.name),
            }}
          />

          {canReset && (
            <InvoiceTableFiltersResult
              filters={filters}
              onResetPage={table.onResetPage}
              totalResults={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: "relative" }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) => {
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id)
                );
              }}
              action={
                <Box sx={{ display: "flex" }}>
                  {/* <Tooltip title="Sent">
                    <IconButton color="primary">
                      <Iconify icon="iconamoon:send-fill" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Download">
                    <IconButton color="primary">
                      <Iconify icon="eva:download-outline" />
                    </IconButton>
                  </Tooltip> */}

                  <Tooltip title="Enqueue">
                    <IconButton
                      color="primary"
                      onClick={confirmEnqueueDialog.onTrue}
                    >
                      <Iconify icon="material-symbols:add-ad-outline" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete">
                    <IconButton color="primary" onClick={confirmDialog.onTrue}>
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                  </Tooltip>
                </Box>
              }
            />

            <Scrollbar sx={{ minHeight: 444 }}>
              <Table
                size={table.dense ? "small" : "medium"}
                sx={{ minWidth: 800 }}
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
                      <InvoiceTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEnqueueRow={() => handleEnqueueRow(row)}
                        editHref={paths.dashboard.invoice.edit(row.id)}
                        detailsHref={paths.dashboard.invoice.details(row.id)}
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

      {renderConfirmDialog()}
      {renderConfirmEnqueueDialog()}
    </>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  dateError: boolean;
  // inputData: IInvoice[];
  inputData: ScrapingTemplateRow[];
  // filters: ScrapingTemplateTableFilters;
  filters: IInvoiceTableFilters;
  comparator: (a: any, b: any) => number;
};

function applyFilter({
  inputData,
  comparator,
  filters,
  dateError,
}: ApplyFilterProps) {
  const { name, status, service, startDate, endDate } = filters;
  // const { title, platform, createdAt } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(({ title }) =>
      [
        title
      ].some((field) => field?.toLowerCase().includes(name.toLowerCase()))
    );
  }

  // if (name) {
  //   inputData = inputData.filter(({ invoiceNumber, invoiceTo }) =>
  //     [
  //       invoiceNumber,
  //       invoiceTo.name,
  //       invoiceTo.company,
  //       invoiceTo.phoneNumber,
  //     ].some((field) => field?.toLowerCase().includes(name.toLowerCase()))
  //   );
  // }

  // if (platform !== "all") {
  //   inputData = inputData.filter((invoice) => invoice.platform === platform);
  // }
  // if (status !== "all") {
  //   inputData = inputData.filter((invoice) => invoice.status === status);
  // }

  // if (service.length) {
  //   inputData = inputData.filter((invoice) =>
  //     invoice.items.some((filterItem) => service.includes(filterItem.service))
  //   );
  // }

  // if (!dateError) {
  //   if (startDate && endDate) {
  //     inputData = inputData.filter((invoice) =>
  //       fIsBetween(invoice.createDate, startDate, endDate)
  //     );
  //   }
  // }

  return inputData;
}
