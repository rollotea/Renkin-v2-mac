import type { CardProps } from "@mui/material/Card";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";

import { fCurrency } from "../../../utils/format-number";
import { Item } from "../../../store/ducks/queueSlice";
import { startTask } from "../booking/api/start-task";
import { toast } from "../../../components/snackbar";
import { ConfirmDialog } from "../../../components/custom-dialog";
import { useBoolean } from "minimal-shared/hooks";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import type { ScrapingTemplateItem } from "../../../store/ducks/scrapingTemplateQueueSlice";
import { checkUserAvailable } from "../booking/api/check-user-available";
import { useContext } from "react";
import { AuthContext } from "../../../auth/context/auth-context";
import { fetchPresetFilter } from "../../product/api/fetch-preset-filter";
// ----------------------------------------------------------------------

type Props = CardProps & {
  enqueuedTasks: number;
  title: string;
  earning: number;
  refunded: number;
  orderTotal: number;
  currentBalance: number;
  queue: ScrapingTemplateItem[];
};

export function EcommerceCurrentBalance({
  sx,
  enqueuedTasks,
  title,
  earning,
  refunded,
  orderTotal,
  currentBalance,
  queue,
  ...other
}: Props) {
  const context = useContext(AuthContext);
  const taskState = useSelector((state: RootState) => state.task);

  const startTaskConfirmDialog = useBoolean();
  const cancelTaskConfirmDialog = useBoolean();

  const renderStartTaskConfirmDialog = () => (
    <ConfirmDialog
      open={startTaskConfirmDialog.value}
      onClose={startTaskConfirmDialog.onFalse}
      title="Start Task"
      content="Are you sure want to start task?"
      action={
        <Button
          variant="contained"
          color="primary"
          onClick={async () => {
            startTaskConfirmDialog.onFalse();
            try {
              const presetFilters = await fetchPresetFilter();
              await checkUserAvailable(context?.user?.id);
              if (taskState.status === "In Progress") {
                toast.error("Task is in progress");
              } else if (queue.length === 0) {
                toast.error("No task in queue");
              } else {
                startTask(queue, presetFilters);
                toast.success("Task started");
              }
            } catch (error) {
              if (error instanceof Error) {
                toast.error(error.message);
              }
            }
          }}
        >
          Start
        </Button>
      }
    />
  );
  const renderCancelTaskConfirmDialog = () => (
    <ConfirmDialog
      open={cancelTaskConfirmDialog.value}
      onClose={cancelTaskConfirmDialog.onFalse}
      title="Stop Task"
      content="Are you sure want to stop task?"
      action={
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            cancelTaskConfirmDialog.onFalse();
            if (taskState.status !== "In Progress") {
              toast.error("Task is not in progress");
            } else {
              window.electron.ipcRenderer.cancelTask();
              toast.info("Task is stopping");
            }
          }}
        >
          Stop
        </Button>
      }
    />
  );
  const row = (label: string, value: number) => (
    <Box
      sx={{
        display: "flex",
        typography: "body2",
        justifyContent: "space-between",
      }}
    >
      <Box component="span" sx={{ color: "text.secondary" }}>
        {label}
      </Box>

      <Box component="span">{fCurrency(value)}</Box>
    </Box>
  );

  return (
    <Card sx={[{ p: 3 }, ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
      <Box sx={{ mb: 1, typography: "subtitle2" }}>{title}</Box>

      <Box sx={{ gap: 2, display: "flex", flexDirection: "column" }}>
        <Box sx={{ typography: "h3" }}>{enqueuedTasks}</Box>
        {/* <Box sx={{ typography: "h3" }}>{fCurrency(currentBalance)}</Box> */}

        {/* {row("Order total", orderTotal)}
        {row("Earning", earning)}
        {row("Refunded", refunded)} */}

        <Box sx={{ gap: 2, display: "flex" }}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => {
              startTaskConfirmDialog.onTrue();
            }}
          >
            Start
          </Button>

          <Button
            fullWidth
            variant="contained"
            color="error"
            onClick={() => {
              cancelTaskConfirmDialog.onTrue();
            }}
          >
            Stop
          </Button>
        </Box>
      </Box>
      {renderStartTaskConfirmDialog()}
      {renderCancelTaskConfirmDialog()}
    </Card>
  );
}
