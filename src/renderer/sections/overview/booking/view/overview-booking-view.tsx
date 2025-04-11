import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";

import { DashboardContent } from "../../../../layouts/dashboard";
import {
  _bookings,
  _bookingNew,
  _bookingReview,
  _bookingsOverview,
} from "../../../../_mock";
import {
  BookingIllustration,
  CheckInIllustration,
  CheckoutIllustration,
} from "../../../../assets/illustrations";
import { EmptyContent } from "../../../../components/empty-content";
import {
  useTable,
  rowInPage,
  getComparator,
} from "../../../../components/table";
import { fileFormat } from "../../../../components/file-thumbnail";
import { fIsAfter, fIsBetween } from "../../../../utils/format-time";
import { useBoolean, useSetState } from "minimal-shared/hooks";

import { BookingBooked } from "../booking-booked";
// import { BookingNewest } from "../booking-newest";
import { BookingDetails } from "../booking-details";
import { BookingAvailable } from "../booking-available";
import { BookingStatistics } from "../booking-statistics";
import { BookingTotalIncomes } from "../booking-total-incomes";
import { BookingWidgetSummary } from "../booking-widget-summary";
import { BookingCheckInWidgets } from "../booking-check-in-widgets";
// import { BookingCustomerReviews } from "../booking-customer-reviews";
import { EcommerceCurrentBalance } from "../../e-commerce/ecommerce-current-balance";
import { FileManagerTable } from "../../../file-manager/file-manager-table";
import { useEffect, useRef, useState } from "react";
import { IFile, IFileFilters } from "../../../../types/file";
import { useDispatch, useSelector } from "react-redux";
import { setTaskStateInQueue } from "../../../../store/ducks/scrapingTemplateQueueSlice";
import { TaskState } from "../../../../../main/types/task-state";
import { FileStorageOverview } from "../../../file-manager/file-storage-overview";
import { CONFIG } from "../../../../global-config";
import { AppWidget } from "../../app/app-widget";
import { BankingRecentTransitions } from "../banking-recent-transitions";
import { setTask } from "../../../../store/ducks/taskSlice";
import { RootState } from "../../../../store/store";
import { toast } from "../../../../components/snackbar";
import { ScrapingTemplateRow } from "../../../../../main/types/scraping/scraping-template";
import type { ScrapingTemplateItem } from "../../../../store/ducks/scrapingTemplateQueueSlice";
import { Card, IconButton, Stack, Typography } from "@mui/material";
import { Scrollbar } from "../../../../components/scrollbar";
// ----------------------------------------------------------------------

const GB = 1000000000 * 24;

export function OverviewBookingView() {
  const dispatch = useDispatch();
  const taskState = useSelector((state: RootState) => state.task);

  useEffect(() => {
    const unsubscribe = window.electron.ipcRenderer.on(
      "message-from-main",
      (data: any) => {
        dispatch(setTask({ taskState: data.text }));
        dispatch(setTaskStateInQueue(data.text));
      }
    );

    return () => {
      unsubscribe(); // コンポーネントのアンマウント時にリスナーを解除
    };
  }, []);

  useEffect(() => {
    const unsubscribe = window.electron.ipcRenderer.on(
      "task-manager:notify-task-canceled",
      (data: any) => {
        toast.success(`Task is Stopped. ${data.stopped}`);
        // console.log("タスクキャンセル:", data.stopped);
      }
    );

    return () => {
      unsubscribe(); // コンポーネントのアンマウント時にリスナーを解除
    };
  }, []);
  // const queue = useSelector(); // 状態を取得
  const queue = useSelector(
    (state: RootState) => state.scrapingTemplateQueue.list
  );

  const table = useTable({ defaultRowsPerPage: 10 });
  const [tableData, setTableData] = useState<ScrapingTemplateItem[]>([]);
  // const [tableData, setTableData] = useState<IFile[]>([]);
  useEffect(() => {
    setTableData(queue);
  }, []);
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
  const canReset =
    !!currentFilters.name ||
    currentFilters.type.length > 0 ||
    (!!currentFilters.startDate && !!currentFilters.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const getPercentage = (part: number, total: number) => {
    if (total === 0) {
      return 0; // 0で割る場合は"-"を返す
    }
    return Math.ceil((part / total) * 100);
  };

  const renderStorageOverview = () => (
    <FileStorageOverview
      total={GB}
      taskStatus={taskState.status}
      chart={{
        series: getPercentage(taskState.completed, taskState.endValue),
      }}
      data={[
        {
          name: taskState.item
            ? taskState.item.scrapingTemplate.title ?? "No Data"
            : "No Data",
          // usedStorage: GB / 2,
          // filesCount: "223",
          icon: (
            <Box
              component="img"
              src={`${CONFIG.assetsDir}/assets/icons/files/ic-img.svg`}
            />
          ),
        },
      ]}
    />
  );

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <BookingWidgetSummary
            title="Total"
            // percent={2.6}
            total={taskState.endValue}
            icon={<BookingIllustration />}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <BookingWidgetSummary
            title="Completed"
            // percent={0.2}
            total={taskState.completed}
            icon={<CheckInIllustration />}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <BookingWidgetSummary
            title="Canceled"
            // percent={-0.1}
            total={taskState.canceled}
            icon={<CheckoutIllustration />}
          />
        </Grid>

        <Grid container size={12}>
          <Grid size={{ xs: 12, md: 7, lg: 8 }}>
            <Box
              sx={{
                mb: 3,
                p: { md: 1 },
                display: "flex",
                gap: { xs: 3, md: 1 },
                borderRadius: { md: 2 },
                flexDirection: "column",
                bgcolor: { md: "background.neutral" },
              }}
            >
              <Box
                sx={{
                  p: { md: 1 },
                  display: "grid",
                  gap: { xs: 3, md: 0 },
                  borderRadius: { md: 2 },
                  bgcolor: { md: "background.paper" },
                  gridTemplateColumns: {
                    xs: "repeat(1, 1fr)",
                    md: "repeat(2, 1fr)",
                  },
                  // gridTemplateRows: {
                  //   md: "repeat(2, 1fr)",
                  // },
                }}
              >
                <Box
                  sx={{
                    display: { xs: "none", sm: "block" },
                    // gridColumn: "1",
                    // gridRow: "1 / 3",
                  }}
                >
                  {renderStorageOverview()}
                </Box>

                <BookingBooked
                  title="Booked"
                  data={[
                    {
                      value: getPercentage(
                        taskState.canceled,
                        taskState.errorLimit
                      ),
                      status: "Error Limit",
                      quantity: taskState.errorLimit,
                    },
                    {
                      value: getPercentage(
                        taskState.errorType.filter,
                        taskState.canceled
                      ),
                      status: "Filter",
                      quantity: taskState.errorType.filter,
                    },
                    {
                      value: getPercentage(
                        taskState.errorType.alreadyExists,
                        taskState.canceled
                      ),
                      status: "Already Exists",
                      quantity: taskState.errorType.alreadyExists,
                    },
                    {
                      value: getPercentage(
                        taskState.errorType.other,
                        taskState.canceled
                      ),
                      status: "Other Error",
                      quantity:
                        taskState.canceled -
                        (taskState.errorType.filter +
                          taskState.errorType.alreadyExists),
                    },
                  ]}
                  // data={_bookingsOverview}
                  sx={{ boxShadow: { md: "none" } }}
                />
                {/* <Card sx={{ p: 3, pr: 1 }}>
                  <Scrollbar>hello</Scrollbar>
                </Card> */}
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <EcommerceCurrentBalance
              title="Enqueued Tasks"
              enqueuedTasks={queue.length}
              earning={25500}
              refunded={1600}
              orderTotal={287650}
              currentBalance={187650}
              queue={queue}
            />
          </Grid>
        </Grid>

        <Grid size={12}></Grid>
      </Grid>
      {notFound ? (
        <EmptyContent filled sx={{ py: 10 }} />
      ) : (
        <BankingRecentTransitions
          title="Queue"
          tableData={queue}
          headCells={[
            { id: "name", label: "Name" },
            { id: "enpty-1" },
            { id: "endValue", label: "End Value" },
            { id: "platform", label: "Platform" },
            { id: "size", label: "Category" },
            { id: "status", label: "Status" },
            { id: "enpty-4" },
            // { id: "createdAt", label: "CreatedAt" },
          ]}
        />
      )}
      {/* {notFound ? <EmptyContent filled sx={{ py: 10 }} /> : renderList()} */}
    </DashboardContent>
  );
}

type ApplyFilterProps = {
  dateError: boolean;
  inputData: ScrapingTemplateItem[];
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

  // if (name) {
  //   inputData = inputData.filter((file) =>
  //     file.name.toLowerCase().includes(name.toLowerCase())
  //   );
  // }

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
