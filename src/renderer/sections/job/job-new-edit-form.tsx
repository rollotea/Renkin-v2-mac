import type { IJobItem } from "../../types/job";

import { z as zod } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, useWatch } from "react-hook-form";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Switch from "@mui/material/Switch";
import Divider from "@mui/material/Divider";
import ButtonBase from "@mui/material/ButtonBase";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
// import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import FormControlLabel from "@mui/material/FormControlLabel";

import { paths } from "../../routes/paths";
import { useRouter } from "../../routes/hooks";

import {
  _roles,
  JOB_SKILL_OPTIONS,
  JOB_BENEFIT_OPTIONS,
  JOB_EXPERIENCE_OPTIONS,
  JOB_EMPLOYMENT_TYPE_OPTIONS,
  JOB_WORKING_SCHEDULE_OPTIONS,
} from "../../_mock";

import { toast } from "../../components/snackbar";
import { Iconify } from "../../components/iconify";
import { Form, Field, schemaHelper } from "../../components/hook-form";
import { useContext, useEffect, useState } from "react";
import Slider from "@mui/material/Slider";
import { platform } from "node:os";
import {
  mercariCategories,
  yahooCategories,
  yahooAuctionCategories,
  rakumaCategories,
} from "../../../main/types/scraping/category";
import { SORT_OPTIONS } from "../../../main/types/scraping/option";
import { varAlpha } from "minimal-shared/utils";
import { ScrapingTemplate } from "../../../main/types/scraping/scraping-template";
import { useBoolean } from "minimal-shared/hooks";
import { AuthContext } from "../../auth/context/auth-context";
import { getAuth } from "firebase/auth";
// ----------------------------------------------------------------------

export type NewJobSchemaType = zod.infer<typeof NewJobSchema>;

export const NewJobSchema = zod.object({
  title: zod.string().min(1, { message: "Title is required!" }),
  // content: zod.string().min(1, { message: "Content is required!" }),
  // employmentTypes: zod
  //   .string()
  //   .array()
  //   .min(1, { message: "Choose at least one option!" }),
  category: schemaHelper.nullableInput(
    zod.string().min(1, { message: "Category is required!" }),
    {
      // message for null value
      message: "Role is required!",
    }
  ),
  // skills: zod
  //   .string()
  //   .array()
  //   .min(1, { message: "Choose at least one option!" }),
  // workingSchedule: zod
  //   .string()
  //   .array()
  //   .min(1, { message: "Choose at least one option!" }),
  // locations: zod
  //   .string()
  //   .array()
  //   .min(1, { message: "Choose at least one option!" }),
  // expiredDate: schemaHelper.date({
  //   message: { required: "Expired date is required!" },
  // }),
  platform: zod.object({
    // price: schemaHelper.nullableInput(
    //   zod.number({ coerce: true }).min(1, { message: "Price is required!" }),
    //   {
    //     // message for null value
    //     message: "Price is required!",
    //   }
    // ),
    // Not required
    type: zod.string(),
  }),
  // anonymousDelivery: zod.boolean(),
  // freeShipping: zod.boolean(),
  // benefits: zod
  //   .string()
  //   .array()
  //   .min(0, { message: "Choose at least one option!" }),
  // // Not required
  sort: zod.string(),
});

// ----------------------------------------------------------------------

type Props = {
  currentJob?: IJobItem;
};

export function JobNewEditForm({ currentJob }: Props) {
  const user = useContext(AuthContext);
  const router = useRouter();
  const [errorLimit, setErrorLimit] = useState<number>(30);
  const [endValue, setEndValue] = useState<number>(30);
  const mercariCats = Object.keys(
    mercariCategories
  ) as (keyof typeof mercariCategories)[];
  const yahooCats = Object.keys(
    yahooCategories
  ) as (keyof typeof yahooCategories)[];
  const yahooAuctionCats = Object.keys(
    yahooAuctionCategories
  ) as (keyof typeof yahooAuctionCategories)[];
  const rakumaCats = Object.keys(
    rakumaCategories
  ) as (keyof typeof rakumaCategories)[];
  function calculateValue(value: number) {
    return 2 ** value;
  }
  const handleChangeErrorLimit = (
    event: Event,
    newValue: number | number[]
  ) => {
    setErrorLimit(newValue as number);
  };
  const handleEndValue = (event: Event, newValue: number | number[]) => {
    setEndValue(newValue as number);
  };

  function valuetext(value: number) {
    return `$${value}°C`;
  }

  const [priceRange, setPriceRange] = useState<number[]>([300, 100000]);
  const prices = [
    { value: 300, label: "300" },
    { value: 10000, label: "10000" },
    { value: 20000, label: "20000" },
    { value: 30000, label: "30000" },
    { value: 40000, label: "40000" },
    { value: 50000, label: "50000" },
    { value: 60000, label: "60000" },
    { value: 70000, label: "70000" },
    { value: 80000, label: "80000" },
    { value: 90000, label: "90000" },
    { value: 100000, label: "100000" },
  ];
  function valuePrice(value: number) {
    return value > 0 ? `$${value}0` : `${value}`;
  }
  function valueLabelFormatPrice(value: number) {
    // return priceRange[1];
    return value > 0 ? `$${value}` : value;
  }

  const handleChangePriceRange = (
    event: Event,
    newValue: number | number[]
  ) => {
    setPriceRange(newValue as number[]);
  };
  // const handleSliderChange = (event: Event, newValue: number | number[]) => {
  //   setPriceRange(newValue as number[]);
  // };
  // // const transformedValue = 300 * Math.pow(100000 / 300, priceRange);
  // const transformedValue_1 = 300 * Math.pow(100000 / 300, priceRange[0]);
  // const transformedValue_2 = 300 * Math.pow(100000 / 300, priceRange[1]);

  const [platform, platformSet] = useState<string>("Mercari");
  const anonymousDelivery = useBoolean(false);
  const freeShipping = useBoolean(false);

  useEffect(() => {
    anonymousDelivery.onFalse();
    freeShipping.onFalse();
  }, [platform]);

  const defaultValues: NewJobSchemaType = {
    title: "",
    // content: "",
    // employmentTypes: [],
    sort: "おすすめ順",
    category: "",
    // role: _roles[1],
    // skills: [],
    // workingSchedule: [],
    // locations: [],
    // expiredDate: null,
    platform: {
      type: "Mercari",
    },
    // anonymousDelivery: false,
    // freeShipping: false,
    // salary: { type: "Hourly", price: null, negotiable: false },
    // benefits: [],
  };

  const methods = useForm<NewJobSchemaType>({
    mode: "all",
    resolver: zodResolver(NewJobSchema),
    defaultValues,
    // values: currentJob,
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = methods;
  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      const result: ScrapingTemplate = {
        title: data.title,
        platform: data.platform.type,
        sort: data.sort,
        category: data.category || "すべて",
        endValue: endValue,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        freeShipping: freeShipping.value,
        anonymousDelivery: anonymousDelivery.value,
        errorLimit: errorLimit,
      };
      await window.electron.ipcRenderer.createNewTask(result);
      toast.success(currentJob ? "Update success!" : "Create success!");
      router.push(paths.dashboard.job.root);
      console.info("DATA", data);
    } catch (error) {
      console.error(error);
    }
  });

  const renderDetails = () => (
    <Card>
      <CardHeader
        title="Title"
        // subheader="Title, short description, image..."
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          {/* <Typography variant="subtitle2">Title</Typography> */}
          <Field.Text name="title" placeholder="Ex: Mercari All..." />
        </Stack>
      </Stack>
    </Card>
  );

  const endValueSlider = () => (
    <Stack spacing={1}>
      <Typography variant="subtitle2">End Value</Typography>

      <Slider
        defaultValue={30}
        onChange={handleEndValue}
        getAriaValueText={valuetext}
        valueLabelDisplay="auto"
        step={10}
        // marks
        min={0}
        max={1000}
      />
      <Box
        sx={(theme) => ({
          p: 2,
          gap: 3,
          borderRadius: 1,
          display: "flex",
          typography: "subtitle2",
          bgcolor: varAlpha(theme.vars.palette.grey["500Channel"], 0.12),
        })}
      >
        <Box component="span">Value: {endValue}</Box>
      </Box>
    </Stack>
  );
  const errorLimitSlider = () => (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Error Limit</Typography>

      <Slider
        defaultValue={30}
        getAriaValueText={valuetext}
        valueLabelDisplay="auto"
        step={10}
        // marks
        min={0}
        max={1000}
        onChange={handleChangeErrorLimit}
      />
      <Box
        sx={(theme) => ({
          p: 2,
          gap: 3,
          borderRadius: 1,
          display: "flex",
          typography: "subtitle2",
          bgcolor: varAlpha(theme.vars.palette.grey["500Channel"], 0.12),
        })}
      >
        <Box component="span">Value: {errorLimit}</Box>
      </Box>
    </Stack>
  );
  const priceRangeSlider = () => (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Price Range</Typography>

      <Slider
        // scale={(x) => x * 10}
        // scale={calculateValue}
        // min={0} // 最小値
        // max={1} // 最大値
        // step={0.1} // ステップ
        step={100}
        // marks={prices}
        value={priceRange}
        onChange={handleChangePriceRange}
        // onChange={handleSliderChange}
        valueLabelDisplay="auto"
        // valueLabelFormat={(value) =>
        //   (300 * Math.pow(100000 / 300, value)).toFixed(0)
        // } // 表示する値

        // valueLabelDisplay="on"
        // getAriaValueText={valuePrice}
        // valueLabelFormat={valueLabelFormatPrice}
        min={300}
        max={100000}
      />
      <Box
        sx={(theme) => ({
          p: 2,
          gap: 3,
          borderRadius: 1,
          display: "flex",
          typography: "subtitle2",
          bgcolor: varAlpha(theme.vars.palette.grey["500Channel"], 0.12),
        })}
      >
        {/* <Box component="span">Min: {transformedValue_1.toFixed(0)}</Box>

        <Box component="span">Max: {transformedValue_2.toFixed(0)}</Box> */}
        <Box component="span">Min: {priceRange[0]}</Box>

        <Box component="span">Max: {priceRange[1]}</Box>
      </Box>
    </Stack>
  );
  const sortRadio = () => (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Sort</Typography>
      <Field.RadioGroup
        row
        name="sort"
        options={SORT_OPTIONS}
        sx={{ gap: 4 }}
      />
    </Stack>
  );
  const categoryList = (categories: string[]) => (
    <Stack spacing={1.5}>
      <Typography variant="subtitle2">Category</Typography>
      <Field.Autocomplete
        name="category"
        autoHighlight
        options={categories.map((option) => option)}
        getOptionLabel={(option) => option}
        renderOption={(props, option) => (
          <li {...props} key={option}>
            {option}
          </li>
        )}
      />
    </Stack>
  );
  const anonymousDeliverySwitch = () => (
    // <Field.Switch
    //   name="anonymousDelivery"
    //   label="Anonymous Delivery"
    //   checked={anonymousDelivery.value}
    //   onChange={() => {
    //     anonymousDelivery.onToggle;
    //     console.log(anonymousDelivery.value);
    //   }}
    // />
    <FormControlLabel
      label="anonymousDelivery"
      control={
        <Switch
          inputProps={{ id: "size-normal-switch" }}
          checked={anonymousDelivery.value}
          onChange={anonymousDelivery.onToggle}
        />
      }
    />
  );
  const freeShippingSwitch = () => (
    // <Field.Switch name="freeShipping" label="Free Shipping" />
    <FormControlLabel
      label="freeShipping"
      control={
        <Switch
          inputProps={{ id: "size-normal-switch" }}
          checked={freeShipping.value}
          onChange={freeShipping.onToggle}
        />
      }
    />
  );
  const platformList = [
    {
      label: "Mercari",
      icon: <Iconify icon="arcticons:mercari" width={32} sx={{ mb: 2 }} />,
    },
    {
      label: "Rakuma",
      icon: <Iconify icon="simple-icons:rakuten" width={32} sx={{ mb: 2 }} />,
    },
    {
      label: "Yahoo",
      icon: (
        <Iconify icon="ant-design:yahoo-filled" width={32} sx={{ mb: 2 }} />
      ),
    },
    {
      label: "Yahoo Auction",
      icon: (
        <Iconify icon="ant-design:yahoo-outlined" width={32} sx={{ mb: 2 }} />
      ),
    },
  ];
  const getPlatform = (plan: string) => {
    if (plan === "Unlimited" || plan === "Standard") {
      return [platformList[0], platformList[1], platformList[2]];
    }
    return platformList;
  };
  const renderMercari = () => (
    <>
      {endValueSlider()}
      {errorLimitSlider()}
      {priceRangeSlider()}
      {sortRadio()}
      {categoryList(mercariCats)}
      {anonymousDeliverySwitch()}
    </>
  );

  const renderRakuma = () => (
    <>
      {endValueSlider()}
      {errorLimitSlider()}
      {priceRangeSlider()}
      {sortRadio()}
      {categoryList(rakumaCats)}
      {anonymousDeliverySwitch()}
      {freeShippingSwitch()}
    </>
  );
  const renderYahoo = () => (
    <>
      {endValueSlider()}
      {errorLimitSlider()}
      {priceRangeSlider()}
      {sortRadio()}
      {categoryList(yahooCats)}
    </>
  );
  const renderYahooAuction = () => (
    <>
      {endValueSlider()}
      {errorLimitSlider()}
      {priceRangeSlider()}
      {sortRadio()}
      {categoryList(yahooAuctionCats)}
      {anonymousDeliverySwitch()}
    </>
  );
  const renderProperties = () => (
    <Card>
      <CardHeader
        title="Properties"
        // subheader="Additional functions and attributes..."
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Typography variant="subtitle2">Platform</Typography>

          <Controller
            name="platform.type"
            control={control}
            render={({ field }) => (
              <Box
                sx={{
                  gap: 2,
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                }}
              >
                {getPlatform(user?.user?.plan).map((item) => (
                  <Paper
                    component={ButtonBase}
                    variant="outlined"
                    key={item.label}
                    onClick={() => {
                      field.onChange(item.label);
                      platformSet(item.label);
                    }}
                    sx={{
                      p: 2.5,
                      borderRadius: 1,
                      typography: "subtitle2",
                      flexDirection: "column",
                      ...(item.label === field.value && {
                        borderWidth: 2,
                        borderColor: "text.primary",
                      }),
                    }}
                  >
                    {item.icon}
                    {item.label}
                  </Paper>
                ))}
              </Box>
            )}
          />
          {watch("platform.type") === "Mercari"
            ? renderMercari()
            : platform === "Rakuma"
            ? renderRakuma()
            : platform === "Yahoo"
            ? renderYahoo()
            : platform === "Yahoo Auction"
            ? renderYahooAuction()
            : null}
        </Stack>
      </Stack>
    </Card>
  );

  const renderActions = () => (
    <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
      <Button
        type="submit"
        variant="contained"
        size="large"
        loading={isSubmitting}
        sx={{ ml: 2 }}
      >
        {!currentJob ? "Create job" : "Save changes"}
      </Button>
    </Box>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack
        spacing={{ xs: 3, md: 5 }}
        sx={{ mx: "auto", maxWidth: { xs: 720, xl: 880 } }}
      >
        {renderDetails()}
        {renderProperties()}
        {renderActions()}
      </Stack>
    </Form>
  );
}
