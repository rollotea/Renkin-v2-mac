import type { IOrderTableFilters } from "../../types/order";
import type { IDatePickerControl } from "../../types/common";
import type { UseSetStateReturn } from "minimal-shared/hooks";

import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { usePopover } from "minimal-shared/hooks";

import Box from "@mui/material/Box";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { formHelperTextClasses } from "@mui/material/FormHelperText";

import { Iconify } from "../../components/iconify";
import { CustomPopover } from "../../components/custom-popover";
import Button from "@mui/material/Button";
import { eventNames } from "node:process";
import { toast } from "sonner";
import {
  PriceSetting,
  PriceSettingRow,
} from "../../../main/types/setting/price-setting";
// ----------------------------------------------------------------------

type Props = {
  dateError: boolean;
  onResetPage: () => void;
  fetchAllPriceSetting: (
    setTableData: Dispatch<SetStateAction<PriceSettingRow[]>>
  ) => void;
  setTableData: Dispatch<SetStateAction<PriceSettingRow[]>>;
  filters: UseSetStateReturn<IOrderTableFilters>;
};

export function OrderTableToolbar({
  filters,
  onResetPage,
  dateError,
  fetchAllPriceSetting,
  setTableData,
}: Props) {
  const menuActions = usePopover();
  const [range, setRange] = useState<number | undefined>();
  const [value, setValue] = useState<number | undefined>();

  // const [forbiddenString, setforbiddenString] = useState<string>("");
  const { state: currentFilters, setState: updateFilters } = filters;

  const handleAddPriceSetting = async () => {
    if (!range || !value) {
      toast.error("Invalid value");
      return;
    }
    try {
      const setting: PriceSetting = { range: range, value: value };
      await window.electron.ipcRenderer.createPriceSetting(setting);
      toast.success("Create new price setting success!");
      fetchAllPriceSetting(setTableData);
      setRange(undefined);
      setValue(undefined);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        if (error.message.includes("UNIQUE constraint failed")) {
          toast.error(`This range already exists. [${range}]`);
          return;
        } else {
          toast.error(error.message);
          return;
        }
      }
      toast.error("Error creating price setting!");
    }
  };
  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onResetPage();
      updateFilters({ name: event.target.value });
    },
    [onResetPage, updateFilters]
  );

  const handleFilterStartDate = useCallback(
    (newValue: IDatePickerControl) => {
      onResetPage();
      updateFilters({ startDate: newValue });
    },
    [onResetPage, updateFilters]
  );

  const handleFilterEndDate = useCallback(
    (newValue: IDatePickerControl) => {
      onResetPage();
      updateFilters({ endDate: newValue });
    },
    [onResetPage, updateFilters]
  );

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: "right-top" } }}
    >
      <MenuList>
        <MenuItem onClick={() => menuActions.onClose()}>
          <Iconify icon="solar:printer-minimalistic-bold" />
          Print
        </MenuItem>

        <MenuItem onClick={() => menuActions.onClose()}>
          <Iconify icon="solar:import-bold" />
          Import
        </MenuItem>

        <MenuItem onClick={() => menuActions.onClose()}>
          <Iconify icon="solar:export-bold" />
          Export
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );

  return (
    <>
      <Box
        sx={{
          p: 2.5,
          gap: 2,
          display: "flex",
          pr: { xs: 2.5, md: 1 },
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "flex-end", md: "center" },
        }}
      >
        {/* <DatePicker
          label="Start date"
          value={currentFilters.startDate}
          onChange={handleFilterStartDate}
          slotProps={{ textField: { fullWidth: true } }}
          sx={{ maxWidth: { md: 200 } }}
        />

        <DatePicker
          label="End date"
          value={currentFilters.endDate}
          onChange={handleFilterEndDate}
          slotProps={{
            textField: {
              fullWidth: true,
              error: dateError,
              helperText: dateError
                ? "End date must be later than start date"
                : null,
            },
          }}
          sx={{
            maxWidth: { md: 200 },
            [`& .${formHelperTextClasses.root}`]: {
              position: { md: "absolute" },
              bottom: { md: -40 },
            },
          }}
        /> */}

        <Box
          sx={{
            gap: 2,
            width: 1,
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
          }}
        >
          <TextField
            fullWidth
            value={currentFilters.name}
            onChange={handleFilterName}
            placeholder="Search"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify
                      icon="eva:search-fill"
                      sx={{ color: "text.disabled" }}
                    />
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            fullWidth
            value={range ?? ""}
            type="number"
            onChange={(event) => {
              // console.log(event?.target.value);
              setRange(Number(event?.target.value));
            }}
            placeholder="Range"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify
                      icon="material-symbols-light:arrow-range-rounded"
                      sx={{ color: "text.disabled" }}
                    />
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            fullWidth
            value={value ?? ""}
            onChange={(event) => {
              // console.log(event?.target.value);
              setValue(Number(event?.target.value));
            }}
            placeholder="Value"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="mdi:yen" sx={{ color: "text.disabled" }} />
                  </InputAdornment>
                ),
              },
            }}
          />
          <Button variant="contained" onClick={handleAddPriceSetting}>
            Add
          </Button>

          {/* <IconButton onClick={menuActions.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton> */}
        </Box>
      </Box>

      {renderMenuActions()}
    </>
  );
}
