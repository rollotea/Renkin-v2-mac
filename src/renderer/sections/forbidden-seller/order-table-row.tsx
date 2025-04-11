import type { IOrderItem } from "../../types/order";

import { useBoolean, usePopover } from "minimal-shared/hooks";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import MenuList from "@mui/material/MenuList";
import Collapse from "@mui/material/Collapse";
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
import { ForbiddenSellerRow } from "../../../main/types/setting/forbidden-seller";

// ----------------------------------------------------------------------

type Props = {
  row: ForbiddenSellerRow;
  // row: IOrderItem;
  selected: boolean;
  // detailsHref: string;
  onSelectRow: () => void;
  onDeleteRow: () => void;
};

export function OrderTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
}: // detailsHref,
Props) {
  const confirmDialog = useBoolean();
  const menuActions = usePopover();
  const collapseRow = useBoolean();

  const renderPrimaryRow = () => (
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

      {/* <TableCell>
      </TableCell> */}

      <TableCell>
        {row.seller}

        {/* <Box sx={{ gap: 2, display: "flex", alignItems: "center" }}>

          <Stack
            sx={{
              typography: "body2",
              flex: "1 1 auto",
              alignItems: "flex-start",
            }}
          >
          </Stack>
        </Box> */}
      </TableCell>

      <TableCell></TableCell>

      {/* <TableCell align="center"> {row.totalQuantity} </TableCell> */}
      <TableCell align="center"></TableCell>

      {/* <TableCell> {fCurrency(row.subtotal)} </TableCell> */}
      <TableCell></TableCell>

      <TableCell>
        <ListItemText
          primary={fDate(row.createdAt)}
          secondary={fTime(row.createdAt)}
          slotProps={{
            primary: {
              noWrap: true,
              sx: { typography: "body2" },
            },
            secondary: {
              sx: { mt: 0.5, typography: "caption" },
            },
          }}
        />
      </TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: "nowrap" }}>
        {/* <IconButton
          color={collapseRow.value ? "inherit" : "default"}
          onClick={collapseRow.onToggle}
          sx={{ ...(collapseRow.value && { bgcolor: "action.hover" }) }}
        >
          <Iconify icon="eva:arrow-ios-downward-fill" />
        </IconButton> */}

        <IconButton
          color={menuActions.open ? "inherit" : "default"}
          onClick={menuActions.onOpen}
        >
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  const renderSecondaryRow = () => (
    <TableRow>
      <TableCell sx={{ p: 0, border: "none" }} colSpan={8}>
        <Collapse
          in={collapseRow.value}
          timeout="auto"
          unmountOnExit
          sx={{ bgcolor: "background.neutral" }}
        >
          {/* <Paper sx={{ m: 1.5 }}>
            {row.items.map((item) => (
              <Box
                key={item.id}
                sx={(theme) => ({
                  display: "flex",
                  alignItems: "center",
                  p: theme.spacing(1.5, 2, 1.5, 1.5),
                  "&:not(:last-of-type)": {
                    borderBottom: `solid 2px ${theme.vars.palette.background.neutral}`,
                  },
                })}
              >
                <Avatar
                  src={item.coverUrl}
                  variant="rounded"
                  sx={{ width: 48, height: 48, mr: 2 }}
                />

                <ListItemText
                  primary={item.name}
                  secondary={item.sku}
                  slotProps={{
                    primary: {
                      sx: { typography: "body2" },
                    },
                    secondary: {
                      sx: { mt: 0.5, color: "text.disabled" },
                    },
                  }}
                />

                <div>x{item.quantity} </div>

                <Box sx={{ width: 110, textAlign: "right" }}>
                  {fCurrency(item.price)}
                </Box>
              </Box>
            ))}
          </Paper> */}
        </Collapse>
      </TableCell>
    </TableRow>
  );

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: "right-top" } }}
    >
      <MenuList>
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

        {/* <li>
          <MenuItem
            component={RouterLink}
            href={detailsHref}
            onClick={() => menuActions.onClose()}
          >
            <Iconify icon="solar:eye-bold" />
            View
          </MenuItem>
        </li> */}
      </MenuList>
    </CustomPopover>
  );

  const renderConfrimDialog = () => (
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

  return (
    <>
      {renderPrimaryRow()}
      {renderSecondaryRow()}
      {renderMenuActions()}
      {renderConfrimDialog()}
    </>
  );
}
