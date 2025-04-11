import type { Theme, SxProps } from "@mui/material/styles";
import type { UseSetStateReturn } from "minimal-shared/hooks";
import type {
  IProductItem,
  IProductTableFilters,
} from "../../../types/product";
import type {
  GridColDef,
  GridSlotProps,
  GridRowSelectionModel,
  GridActionsCellItemProps,
  GridColumnVisibilityModel,
  GridCsvExportOptions,
  GridCsvGetRowsToExportParams,
} from "@mui/x-data-grid";

import { useBoolean, useSetState } from "minimal-shared/hooks";
import {
  useState,
  useEffect,
  forwardRef,
  useCallback,
  useContext,
} from "react";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import {
  DataGrid,
  gridClasses,
  GridToolbarExport,
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
  useGridApiContext,
  gridSortedRowIdsSelector,
} from "@mui/x-data-grid";

import { paths } from "../../../routes/paths";
import { RouterLink } from "../../../routes/components";

import { PRODUCT_STOCK_OPTIONS } from "../../../_mock";
import { useGetProducts } from "../../../actions/product";
import { DashboardContent } from "../../../layouts/dashboard";

import { toast } from "../../../components/snackbar";
import { Iconify } from "../../../components/iconify";
import { EmptyContent } from "../../../components/empty-content";
import { ConfirmDialog } from "../../../components/custom-dialog";
import { CustomBreadcrumbs } from "../../../components/custom-breadcrumbs";

import { ProductTableToolbar } from "../product-table-toolbar";
import { ProductTableFiltersResult } from "../product-table-filters-result";
import {
  RenderCellStock,
  RenderCellPrice,
  RenderCellPublish,
  RenderCellProduct,
  RenderCellCreatedAt,
  RenderCellUrl,
} from "../product-table-row";
import { DisplayItemDetailRow } from "../../../../main/types/scraping/item-detail";
import { getExportTsv } from "../api/get-export-tsv";
import { AuthContext } from "../../../auth/context/auth-context";
import { checkExportHistory } from "../api/check-export-history";
import { createExportHistory } from "../api/create-export-history";
import { fetchExportHistory } from "../api/fetch-export-history";
import { BookingWidgetSummary } from "../../overview/booking/booking-widget-summary";
import { BookingIllustration } from "../../../assets/illustrations";
import { Grid } from "@mui/material";
import { FIRESTORE } from "../../../lib/firebase";
import { fetchPresetFilter } from "../api/fetch-preset-filter";
import { PresetFilters } from "../../../../main/types/setting/preset-filters";

// ----------------------------------------------------------------------

const PUBLISH_OPTIONS = [
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
];

// const HIDE_COLUMNS = { category: true };
const HIDE_COLUMNS = { category: false, publish: false, url: false };

const HIDE_COLUMNS_TOGGLABLE = ["category", "actions"];

// ----------------------------------------------------------------------

export function ProductListView() {
  const context = useContext(AuthContext);
  const [exportQuantity, setExportQuantity] = useState<number>(0);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const data = await window.electron.ipcRenderer.getAllItemDetail();
  //   };
  //   fetchData();
  // }, []);
  const fetchData = useCallback(async () => {
    const presetFilters: PresetFilters = await fetchPresetFilter();
    const data: DisplayItemDetailRow[] = await window.electron.ipcRenderer.getAllItemDetail(
      presetFilters
    );
    setTableData(data);
  }, []);

  // const fetchData = async () => {
  //   const data: DisplayItemDetailRow[] = await window.electron.ipcRenderer.getAllItemDetail();
  //   console.log(data);
  //   setTableData(data);
  // };
  useEffect(() => {
    fetchData();
    fetchExportHistory(context?.user?.id).then((data) => {
      setExportQuantity(data);
    });
  }, []);

  const confirmDialog = useBoolean();

  const { products, productsLoading } = useGetProducts();

  const [tableData, setTableData] = useState<DisplayItemDetailRow[]>([]);
  // const [tableData, setTableData] = useState<IProductItem[]>(products);
  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>(
    []
  );
  const [
    filterButtonEl,
    setFilterButtonEl,
  ] = useState<HTMLButtonElement | null>(null);

  const filters = useSetState<IProductTableFilters>({ publish: [], stock: [] });
  const { state: currentFilters } = filters;

  const [columnVisibilityModel, setColumnVisibilityModel] = useState<
    GridColumnVisibilityModel
  >(HIDE_COLUMNS);

  // useEffect(() => {
  //   if (products.length) {
  //     setTableData(products);
  //   }
  // }, [products]);

  const canReset =
    currentFilters.publish.length > 0 || currentFilters.stock.length > 0;

  const dataFiltered = applyFilter({
    inputData: tableData,
    filters: currentFilters,
  });

  const handleDeleteRow = useCallback(
    async (id: string) => {
      // const deleteRow = tableData.filter((row) => row.id !== id);
      try {
        await window.electron.ipcRenderer.deleteItemDetail(id);
        await fetchData();
        toast.success("Delete success!");
      } catch (error) {
        toast.error("Error");
      }

      // setTableData(deleteRow);
    },
    [tableData]
  );

  const handleDeleteRows = useCallback(async () => {
    // const deleteRows = tableData.filter(
    //   (row) => !selectedRowIds.includes(row.id)
    // );
    try {
      await window.electron.ipcRenderer.deleteItemDetails(
        selectedRowIds.map((data) => data.toString())
      );
      await fetchData();
      toast.success("Delete success!");
    } catch (error) {
      toast.error("Error");
    }

    // setTableData(deleteRows);
  }, [selectedRowIds, tableData]);

  const handleExportRows = useCallback(
    (apiRef: any) => {
      const rowData = apiRef.current.getSelectedRows(); // 全データ取得

      const deleteRows = tableData.filter(
        (row) => !selectedRowIds.includes(row.id)
      );

      toast.success("Export success!");

      setTableData(deleteRows);
    },
    [selectedRowIds, tableData]
  );

  const CustomToolbarCallback = useCallback(
    () => (
      <CustomToolbar
        filters={filters}
        canReset={canReset}
        selectedRowIds={selectedRowIds}
        setFilterButtonEl={setFilterButtonEl}
        filteredResults={dataFiltered.length}
        onOpenConfirmDeleteRows={confirmDialog.onTrue}
        setExportQuantity={setExportQuantity}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentFilters, selectedRowIds]
  );

  const columns: GridColDef[] = [
    { field: "category", headerName: "Category", filterable: false },
    {
      field: "name",
      headerName: "Product",
      flex: 1,
      minWidth: 360,
      hideable: false,
      renderCell: (params) => (
        <RenderCellProduct
          params={params}
          href={paths.dashboard.product.details(params.row.id)}
        />
      ),
    },
    {
      field: "createdAt",
      headerName: "Create at",
      width: 160,
      renderCell: (params) => <RenderCellCreatedAt params={params} />,
    },
    {
      field: "price",
      headerName: "Price",
      width: 140,
      // editable: true,
      renderCell: (params) => <RenderCellPrice params={params} />,
    },
    {
      field: "inventoryType",
      headerName: "Status",
      width: 160,
      sortable: false,

      // type: "singleSelect",
      valueOptions: PRODUCT_STOCK_OPTIONS,
      renderCell: (params) => <RenderCellStock params={params} />,
    },
    {
      field: "publish",
      headerName: "SKU",
      width: 200,
      type: "singleSelect",
      // editable: true,
      valueOptions: PUBLISH_OPTIONS,
      renderCell: (params) => <RenderCellPublish params={params} />,
    },
    {
      field: "url",
      headerName: "Url",
      width: 140,
      // editable: true,
      renderCell: (params) => <RenderCellUrl params={params} />,
    },

    {
      type: "actions",
      field: "actions",
      headerName: " ",
      align: "right",
      headerAlign: "right",
      width: 80,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      getActions: (params) => [
        <GridActionsLinkItem
          showInMenu
          icon={<Iconify icon="solar:eye-bold" />}
          label="View"
          href={paths.dashboard.product.details(params.row.id)}
        />,
        // <GridActionsLinkItem
        //   showInMenu
        //   icon={<Iconify icon="solar:pen-bold" />}
        //   label="Edit"
        //   href={paths.dashboard.product.edit(params.row.id)}
        // />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:trash-bin-trash-bold" />}
          label="Delete"
          onClick={() => handleDeleteRow(params.row.id)}
          sx={{ color: "error.main" }}
        />,
      ],
    },
  ];

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete"
      content={
        <>
          Are you sure want to delete <strong> {selectedRowIds.length} </strong>{" "}
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
      <DashboardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: "Dashboard", href: paths.dashboard.root },
            { name: "Product", href: paths.dashboard.product.root },
            { name: "List" },
          ]}
          // action={
          //   <Button
          //     component={RouterLink}
          //     href={paths.dashboard.product.new}
          //     variant="contained"
          //     startIcon={<Iconify icon="mingcute:add-line" />}
          //   >
          //     New product
          //   </Button>
          // }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ color: "text.secondary", typography: "subtitle2" }}>
            Total exports for the Last 7 Days
          </Box>
          <Box sx={{ my: 1.5, typography: "h3" }}>{exportQuantity}</Box>
        </Box>

        <Card
          sx={{
            minHeight: 640,
            flexGrow: { md: 1 },
            display: { md: "flex" },
            height: { xs: 800, md: "1px" },
            flexDirection: { md: "column" },
          }}
        >
          <DataGrid
            checkboxSelection
            disableRowSelectionOnClick
            rows={dataFiltered}
            columns={columns}
            loading={productsLoading}
            getRowHeight={() => "auto"}
            pageSizeOptions={[5, 10, 20, { value: -1, label: "All" }]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            onRowSelectionModelChange={(newSelectionModel) =>
              setSelectedRowIds(newSelectionModel)
            }
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) =>
              setColumnVisibilityModel(newModel)
            }
            slots={{
              toolbar: CustomToolbarCallback,
              noRowsOverlay: () => <EmptyContent />,
              noResultsOverlay: () => <EmptyContent title="No results found" />,
            }}
            slotProps={{
              toolbar: { setFilterButtonEl },
              panel: { anchorEl: filterButtonEl },
              columnsManagement: { getTogglableColumns },
            }}
            sx={{
              [`& .${gridClasses.cell}`]: {
                alignItems: "center",
                display: "inline-flex",
              },
            }}
          />
        </Card>
      </DashboardContent>

      {renderConfirmDialog()}
    </>
  );
}

// ----------------------------------------------------------------------

declare module "@mui/x-data-grid" {
  interface ToolbarPropsOverrides {
    setFilterButtonEl: React.Dispatch<
      React.SetStateAction<HTMLButtonElement | null>
    >;
  }
}

type CustomToolbarProps = GridSlotProps["toolbar"] & {
  canReset: boolean;
  filteredResults: number;
  selectedRowIds: GridRowSelectionModel;
  filters: UseSetStateReturn<IProductTableFilters>;

  onOpenConfirmDeleteRows: () => void;
  setExportQuantity: (quantity: number) => void;
};

function CustomToolbar({
  filters,
  canReset,
  selectedRowIds,
  filteredResults,
  setFilterButtonEl,
  onOpenConfirmDeleteRows,
  setExportQuantity,
}: CustomToolbarProps) {
  const context = useContext(AuthContext);
  const apiRef = useGridApiContext();
  const exportConfirmDialog = useBoolean();
  const handleExport = async () => {
    const rowData = apiRef.current.getSelectedRows(); // 全データ取得

    // const rowData = apiRef.current.getRowModels(); // 全データ取得
    try {
      await checkExportHistory(
        context?.user?.id,
        context?.user?.plan,
        rowData.size
      );
      getExportTsv(rowData);
      await createExportHistory(context?.user?.id, rowData.size);
      fetchExportHistory(context?.user?.id).then((data) => {
        setExportQuantity(data);
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        return;
      }
      toast.error("Unexpected error");
    }
  };

  const renderExportConfirmDialog = () => (
    <ConfirmDialog
      open={exportConfirmDialog.value}
      onClose={exportConfirmDialog.onFalse}
      title="Export"
      content={
        <>
          Are you sure want to export <strong> {selectedRowIds.length} </strong>{" "}
          items?
        </>
      }
      action={
        <Button
          variant="contained"
          color="primary"
          onClick={async () => {
            await handleExport();
            exportConfirmDialog.onFalse();
          }}
        >
          Export
        </Button>
      }
    />
  );

  return (
    <>
      <GridToolbarContainer>
        <ProductTableToolbar
          filters={filters}
          options={{ stocks: PRODUCT_STOCK_OPTIONS, publishs: PUBLISH_OPTIONS }}
        />

        <GridToolbarQuickFilter />

        <Box
          sx={{
            gap: 1,
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          {!!selectedRowIds.length && (
            <>
              <Button
                size="small"
                color="error"
                startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                onClick={onOpenConfirmDeleteRows}
              >
                Delete ({selectedRowIds.length})
              </Button>
              <Button
                size="small"
                color="primary"
                startIcon={<Iconify icon="uil:export" />}
                // startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                onClick={exportConfirmDialog.onTrue}
              >
                Export ({selectedRowIds.length})
              </Button>
            </>
          )}

          <GridToolbarColumnsButton />
          <GridToolbarFilterButton ref={setFilterButtonEl} />
          {/* <GridToolbarExport csvOptions={{ delimiter: "\t" }} /> */}
          {/* <Button
            onClick={() => handleExport()}
            // onClick={() => handleExport({ getRowsToExport: getUnfilteredRows })}
          >
            Unfiltered rows
          </Button> */}
        </Box>
      </GridToolbarContainer>

      {canReset && (
        <ProductTableFiltersResult
          filters={filters}
          totalResults={filteredResults}
          sx={{ p: 2.5, pt: 0 }}
        />
      )}
      {renderExportConfirmDialog()}
    </>
  );
}

// ----------------------------------------------------------------------

type GridActionsLinkItemProps = Pick<
  GridActionsCellItemProps,
  "icon" | "label" | "showInMenu"
> & {
  href: string;
  sx?: SxProps<Theme>;
};

export const GridActionsLinkItem = forwardRef<
  HTMLLIElement,
  GridActionsLinkItemProps
>((props, ref) => {
  const { href, label, icon, sx } = props;

  return (
    <MenuItem ref={ref} sx={sx}>
      <Link
        component={RouterLink}
        href={href}
        underline="none"
        color="inherit"
        sx={{ width: 1, display: "flex", alignItems: "center" }}
      >
        {icon && <ListItemIcon>{icon}</ListItemIcon>}
        {label}
      </Link>
    </MenuItem>
  );
});

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: DisplayItemDetailRow[];
  // inputData: IProductItem[];
  filters: IProductTableFilters;
};

function applyFilter({ inputData, filters }: ApplyFilterProps) {
  const { stock, publish } = filters;

  if (stock.length) {
    inputData = inputData.filter((product) =>
      stock.includes(
        (product.isValid === true && "Valid") ||
          (product.isValid === false && "Invalid") ||
          "Invalid"
      )
    );
  }

  // if (publish.length) {
  //   inputData = inputData.filter((product) =>
  //     publish.includes(product.publish)
  //   );
  // }

  return inputData;
}
