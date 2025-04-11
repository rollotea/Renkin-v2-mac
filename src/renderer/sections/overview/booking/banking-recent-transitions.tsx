import type { IDateValue } from "../../../types/common";
import type { CardProps } from "@mui/material/Card";
import type { TableHeadCellProps } from "../../../components/table";

import { usePopover } from "minimal-shared/hooks";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import TableRow from "@mui/material/TableRow";
import { useTheme } from "@mui/material/styles";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import IconButton from "@mui/material/IconButton";
import CardHeader from "@mui/material/CardHeader";
import ListItemText from "@mui/material/ListItemText";
import Badge, { badgeClasses } from "@mui/material/Badge";

import { fCurrency, fData } from "../../../utils/format-number";
import { fDate, fTime } from "../../../utils/format-time";

import { Label } from "../../../components/label";
import { Iconify } from "../../../components/iconify";
import { Scrollbar } from "../../../components/scrollbar";
import { TableHeadCustom } from "../../../components/table";
import { CustomPopover } from "../../../components/custom-popover";
import { deleteQueueFile, Item } from "../../../store/ducks/queueSlice";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { ScrapingTemplateRow } from "../../../../main/types/scraping/scraping-template";
import {
  removeScrapingTemplateFromQueue,
  ScrapingTemplateItem,
} from "../../../store/ducks/scrapingTemplateQueueSlice";
// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  headCells: TableHeadCellProps[];
  // tableData: {
  //   id: string;
  //   type: string;
  //   status: string;
  //   amount: number;
  //   message: string;
  //   date: IDateValue;
  //   category: string;
  //   name: string | null;
  //   avatarUrl: string | null;
  // }[];
  tableData: ScrapingTemplateItem[];
};

export function BankingRecentTransitions({
  sx,
  title,
  subheader,
  tableData,
  headCells,
  ...other
}: Props) {
  return (
    <Card sx={sx} {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

      <Scrollbar>
        {/* <Scrollbar sx={{ minHeight: 462 }}> */}
        <Table>
          <TableHeadCustom headCells={headCells} />
          <TableBody>
            {tableData.map((row) => {
              return <RowItem key={row.id} row={row} />;
            })}
            {/* {tableData.map((row) => (
              <RowItem key={row.id} row={row} />
            ))} */}
          </TableBody>
        </Table>
      </Scrollbar>
    </Card>
  );
}

// ----------------------------------------------------------------------

type RowItemProps = {
  row: Props["tableData"][number];
};

function RowItem({ row }: RowItemProps) {
  const dispatch = useDispatch();

  const theme = useTheme();

  const menuActions = usePopover();

  const lightMode = theme.palette.mode === "light";

  const handleDownload = () => {
    menuActions.onClose();
    console.info("DOWNLOAD", row.id);
  };

  const handlePrint = () => {
    menuActions.onClose();
    console.info("PRINT", row.id);
  };

  const handleShare = () => {
    menuActions.onClose();
    console.info("SHARE", row.id);
  };

  const handleDelete = () => {
    menuActions.onClose();
    if (row.status === "In Progress") {
      toast.error("This task is in progress");
    } else {
      dispatch(removeScrapingTemplateFromQueue({ id: row.id }));
    }
  };

  const renderAvatar = () => (
    <></>
    // <Box sx={{ position: "relative" }}>
    //   <Badge
    //     overlap="circular"
    //     color={row.file.type === "Income" ? "success" : "error"}
    //     anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    //     badgeContent={
    //       <Iconify
    //         icon={
    //           row.file.type === "Income"
    //             ? "eva:diagonal-arrow-left-down-fill"
    //             : "eva:diagonal-arrow-right-up-fill"
    //         }
    //         width={16}
    //       />
    //     }
    //     sx={{ [`& .${badgeClasses.badge}`]: { p: 0, width: 20 } }}
    //   >
    //     {/* <Avatar
    //       src={row.avatarUrl || ""}
    //       sx={{
    //         width: 48,
    //         height: 48,
    //         color: "text.secondary",
    //         bgcolor: "background.neutral",
    //       }}
    //     >
    //       {row.category === "Fast food" && (
    //         <Iconify icon="ion:fast-food" width={24} />
    //       )}
    //       {row.category === "Fitness" && (
    //         <Iconify icon="ic:round-fitness-center" width={24} />
    //       )}
    //     </Avatar> */}
    //   </Badge>
    // </Box>
  );

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: "right-top" } }}
    >
      <MenuList>
        {/* <MenuItem onClick={handleDownload}>
          <Iconify icon="eva:cloud-download-fill" />
          Download
        </MenuItem>

        <MenuItem onClick={handlePrint}>
          <Iconify icon="solar:printer-minimalistic-bold" />
          Print
        </MenuItem>

        <MenuItem onClick={handleShare}>
          <Iconify icon="solar:share-bold" />
          Share
        </MenuItem>*/}

        {/* <Divider sx={{ borderStyle: "dashed" }} /> */}

        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          <Iconify icon="solar:trash-bin-trash-broken" />
          Remove from queue
        </MenuItem>
        {/* <Divider sx={{ borderStyle: "dashed" }} /> */}
      </MenuList>
    </CustomPopover>
  );

  return (
    <>
      <TableRow>
        <TableCell>
          <Box sx={{ gap: 2, display: "flex", alignItems: "center" }}>
            {/* {renderAvatar()} */}
            <ListItemText primary={row.scrapingTemplate.title} />
            {/* <ListItemText primary={row.file.name} secondary={row.file.name} /> */}
          </Box>
        </TableCell>
        <TableCell></TableCell>
        <TableCell>{row.scrapingTemplate.endValue}</TableCell>
        <TableCell>{row.scrapingTemplate.platform}</TableCell>
        {/* <TableCell>
          <ListItemText
            primary={fDate(row.date)}
            secondary={fTime(row.date)}
            slotProps={{
              primary: { sx: { typography: "body2" } },
              secondary: {
                sx: { mt: 0.5, typography: "caption" },
              },
            }}
          />
        </TableCell> */}
        {/* <TableCell>{fData(row.file.size)}</TableCell> */}
        <TableCell>{row.scrapingTemplate.category}</TableCell>
        <TableCell>
          <Label
            variant={lightMode ? "soft" : "filled"}
            color={
              (row.status === "Completed" && "success") ||
              (row.status === "Pending" && "warning") ||
              (row.status === "In Progress" && "info") ||
              "error"
            }
            sx={{ textTransform: "capitalize" }}
          >
            {row.status}
          </Label>
        </TableCell>
        <TableCell align="right" sx={{ pr: 1 }}>
          <IconButton
            color={menuActions.open ? "inherit" : "default"}
            onClick={menuActions.onOpen}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      {renderMenuActions()}
    </>
  );
}
