import type { NavSectionProps } from "../components/nav-section";

import { paths } from "../routes/paths";
import path from "path";
import { CONFIG } from "../global-config";

import { Label } from "../components/label";
import { SvgColor } from "../components/svg-color";
import { Box, SvgIcon } from "@mui/material";
// ----------------------------------------------------------------------

const icon = (name: string) => (
  // <svg>
  //   {`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`}
  // </svg>
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  job: icon("ic-job"),
  blog: icon("ic-blog"),
  chat: icon("ic-chat"),
  mail: icon("ic-mail"),
  user: icon("ic-user"),
  file: icon("ic-file"),
  lock: icon("ic-lock"),
  tour: icon("ic-tour"),
  order: icon("ic-order"),
  // order: icon("line-md:filter"),
  label: icon("ic-label"),
  blank: icon("ic-blank"),
  kanban: icon("ic-kanban"),
  folder: icon("ic-folder"),
  course: icon("ic-course"),
  banking: icon("ic-banking"),
  booking: icon("ic-booking"),
  invoice: icon("ic-invoice"),
  product: icon("ic-product"),
  calendar: icon("ic-calendar"),
  disabled: icon("ic-disabled"),
  external: icon("ic-external"),
  menuItem: icon("ic-menu-item"),
  ecommerce: icon("ic-ecommerce"),
  analytics: icon("ic-analytics"),
  dashboard: icon("ic-dashboard"),
  parameter: icon("ic-parameter"),
};

// ----------------------------------------------------------------------
export const navData: NavSectionProps["data"] = [
  /**
   * Overview
   */
  {
    subheader: "Overview",
    items: [
      {
        title: "Dashboard",
        path: paths.dashboard.root,
        // icon: ICONS.dashboard,
        // info: <Label>v{CONFIG.appVersion}</Label>,
      },
      // { title: "Input", path: paths.dashboard.two, icon: ICONS.file },
      // { title: "Output", path: paths.dashboard.three, icon: ICONS.mail },
      // { title: "Four", path: paths.dashboard.four, icon: ICONS.mail },
      {
        title: "Product",
        path: paths.dashboard.product.root,
        // icon: ICONS.ecommerce,
        children: [
          { title: "List", path: paths.dashboard.product.root },
          // { title: "Details", path: paths.dashboard.product.demo.details },
          // { title: "Create", path: paths.dashboard.product.new },
          // { title: "Edit", path: paths.dashboard.product.demo.edit },
        ],
      },

      {
        title: "Templates",
        path: paths.dashboard.job.root,
        // icon: ICONS.file,
        children: [
          { title: "List", path: paths.dashboard.job.root },
          // { title: "Details", path: paths.dashboard.job.demo.details },
          { title: "Create", path: paths.dashboard.job.new },
          // { title: "Edit", path: paths.dashboard.job.demo.edit },
        ],
      },
      {
        title: "Filters",
        path: paths.dashboard.filters.root,
        // path: paths.dashboard.filters.root,
        // icon: ICONS.blog,
        children: [
          {
            title: "Price Setting",
            path: paths.dashboard.filters.priceSetting,
          },
          {
            title: "Replacement String",
            path: paths.dashboard.filters.replacementString,
          },
          {
            title: "Forbidden String",
            path: paths.dashboard.filters.forbiddenString,
          },
          {
            title: "Forbidden Seller",
            path: paths.dashboard.filters.forbiddenSeller,
          },
          // {
          //   title: "Details",
          //   path: paths.dashboard.forbiddenString.demo.details,
          // },
        ],
      },
      // {
      //   title: "Forbidden String",
      //   path: paths.dashboard.forbiddenString.root,
      //   icon: ICONS.order,
      //   children: [
      //     { title: "List", path: paths.dashboard.forbiddenString.root },
      //     {
      //       title: "Details",
      //       path: paths.dashboard.forbiddenString.demo.details,
      //     },
      //   ],
      // },
      // {
      //   title: "Forbidden Seller",
      //   path: paths.dashboard.forbiddenSeller.root,
      //   icon: ICONS.order,
      //   children: [
      //     { title: "List", path: paths.dashboard.forbiddenSeller.root },
      //   ],
      // },
      // {
      //   title: "Replacement String",
      //   path: paths.dashboard.replacementString.root,
      //   icon: ICONS.order,
      //   children: [
      //     { title: "List", path: paths.dashboard.replacementString.root },
      //   ],
      // },
    ],
  },
  /**
   * Management
   */
  // {
  //   subheader: 'Management',
  //   items: [
  //     {
  //       title: 'Group',
  //       path: paths.dashboard.group.root,
  //       icon: ICONS.user,
  //       children: [
  //         { title: 'Four', path: paths.dashboard.group.root },
  //         { title: 'Five', path: paths.dashboard.group.five },
  //         { title: 'Six', path: paths.dashboard.group.six },
  //       ],
  //     },
  //   ],
  // },
];
