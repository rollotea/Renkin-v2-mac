import type { IInvoice } from "../../types/invoice";

import { useBoolean, usePopover } from "minimal-shared/hooks";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";

import { RouterLink } from "../../routes/components";

import { fCurrency } from "../../utils/format-number";
import { fDate, fTime } from "../../utils/format-time";

import { Label } from "../../components/label";
import { Iconify } from "../../components/iconify";
import { ConfirmDialog } from "../../components/custom-dialog";
import { CustomPopover } from "../../components/custom-popover";
import { ScrapingTemplateRow } from "../../../main/types/scraping/scraping-template";

// ----------------------------------------------------------------------

type Props = {
  row: ScrapingTemplateRow;
  // row: IInvoice;
  selected: boolean;
  editHref: string;
  detailsHref: string;
  onSelectRow: () => void;
  onDeleteRow: () => void;
  onEnqueueRow: () => void;
};

export function InvoiceTableRow({
  row,
  selected,
  editHref,
  onSelectRow,
  onDeleteRow,
  onEnqueueRow,
  detailsHref,
}: Props) {
  const menuActions = usePopover();
  const confirmDialog = useBoolean();
  const confirmEnqueueDialog = useBoolean();

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: "right-top" } }}
    >
      <MenuList>
        {/* <li>
          <MenuItem
            component={RouterLink}
            href={detailsHref}
            onClick={menuActions.onClose}
          >
            <Iconify icon="solar:eye-bold" />
            View
          </MenuItem>
        </li> */}

        {/* <li>
          <MenuItem
            component={RouterLink}
            href={editHref}
            onClick={menuActions.onClose}
          >
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>
        </li> */}

        <MenuItem
          onClick={() => {
            confirmEnqueueDialog.onTrue();
            menuActions.onClose();
          }}
          sx={{ color: "primary.main" }}
        >
          <Iconify icon="material-symbols:add-ad-outline" />
          Enqueue
        </MenuItem>
        <Divider sx={{ borderStyle: "dashed" }} />
        <MenuItem
          onClick={() => {
            confirmDialog.onTrue();
            menuActions.onClose();
          }}
          sx={{ color: "error.main" }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete"
      content="Are you sure want to delete?"
      action={
        <Button variant="contained" color="error" onClick={onDeleteRow}>
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
      content="Are you sure want to enqueue?"
      action={
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            onEnqueueRow();
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
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox
            checked={selected}
            onClick={onSelectRow}
            inputProps={{
              id: `${row.id}-checkbox`,
              "aria-label": `${row.id} checkbox`,
            }}
          />
        </TableCell>

        <TableCell>
          <Box sx={{ gap: 2, display: "flex", alignItems: "center" }}>
            {/* <Avatar alt={row.invoiceTo.name}>
              {row.invoiceTo.name.charAt(0).toUpperCase()}
            </Avatar> */}

            <ListItemText
              primary={row.title}
              // secondary={
              //   <Link component={RouterLink} href={detailsHref} color="inherit">
              //     {row.invoiceNumber}
              //   </Link>
              // }
              slotProps={{
                primary: { noWrap: true, sx: { typography: "body2" } },
                secondary: {
                  sx: {
                    color: "text.disabled",
                    "&:hover": { color: "text.secondary" },
                  },
                },
              }}
            />
          </Box>
        </TableCell>

        <TableCell>
          <ListItemText
            primary={fDate(row.createdAt)}
            secondary={fTime(row.createdAt)}
            // secondary={row.createdAt}
            // primary={fDate(row.createdAt)}
            // secondary={fTime(row.createdAt)}
            slotProps={{
              primary: { noWrap: true, sx: { typography: "body2" } },
              secondary: { sx: { mt: 0.5, typography: "caption" } },
            }}
          />
        </TableCell>

        <TableCell>
          {row.category}
          {/* <ListItemText
            primary={fDate(row.dueDate)}
            secondary={fTime(row.dueDate)}
            slotProps={{
              primary: { noWrap: true, sx: { typography: "body2" } },
              secondary: { sx: { mt: 0.5, typography: "caption" } },
            }}
          /> */}
        </TableCell>

        <TableCell>{row.endValue}</TableCell>
        {/* <TableCell>{fCurrency(row.totalAmount)}</TableCell> */}

        <TableCell>{row.errorLimit}</TableCell>
        {/* <TableCell align="center"></TableCell> */}
        {/* <TableCell align="center">{row.sent}</TableCell> */}

        <TableCell>
          <Label
            variant="soft"
            color={
              (row.platform === "paid" && "success") ||
              (row.platform === "pending" && "warning") ||
              (row.platform === "overdue" && "error") ||
              "default"
            }
          >
            {row.platform}
          </Label>
        </TableCell>

        <TableCell align="right" sx={{ px: 1 }}>
          <IconButton
            color={menuActions.open ? "inherit" : "default"}
            onClick={menuActions.onOpen}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      {renderMenuActions()}
      {renderConfirmDialog()}
      {renderConfirmEnqueueDialog()}
    </>
  );
}
