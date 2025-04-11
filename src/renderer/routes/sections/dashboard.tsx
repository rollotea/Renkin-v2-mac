import type { RouteObject } from "react-router";

import { Outlet } from "react-router";
import { lazy, Suspense } from "react";

import { CONFIG } from "../../global-config";
import { DashboardLayout } from "../../layouts/dashboard";

import { LoadingScreen } from "../../components/loading-screen";

import { AuthGuard } from "../../auth/guard";

import { usePathname } from "../hooks";
import { ReplacementStringListView } from "../../sections/replacement-string/view";

// ----------------------------------------------------------------------

const OverviewBookingPage = lazy(() => import("../../pages/dashboard/booking"));
const IndexPage = lazy(() => import("../../pages/dashboard/one"));
const PageTwo = lazy(() => import("../../pages/dashboard/two"));
const PageThree = lazy(() => import("../../pages/dashboard/three"));
const PageFour = lazy(() => import("../../pages/dashboard/four"));
const PageFive = lazy(() => import("../../pages/dashboard/five"));
const PageSix = lazy(() => import("../../pages/dashboard/six"));
const FileManagerPage = lazy(() =>
  import("../../pages/dashboard/file-manager")
);
const OutputFileManagerPage = lazy(() =>
  import("../../pages/dashboard/output-file-manager")
);
const JobDetailsPage = lazy(() => import("../../pages/dashboard/job/details"));
const JobListPage = lazy(() => import("../../pages/dashboard/job/list"));
const JobCreatePage = lazy(() => import("../../pages/dashboard/job/new"));
const JobEditPage = lazy(() => import("../../pages/dashboard/job/edit"));
const InvoiceListPage = lazy(() =>
  import("../../pages/dashboard/invoice/list")
);
const ForbiddenStringListPage = lazy(() =>
  import("../../pages/dashboard/forbidden-string/list")
);
const OrderDetailsPage = lazy(() =>
  import("../../pages/dashboard/forbidden-string/details")
);
const ForbiddenSellerListPage = lazy(() =>
  import("../../pages/dashboard/forbidden-seller/list")
);

const ProductDetailsPage = lazy(() =>
  import("../../pages/dashboard/product/details")
);
const ProductListPage = lazy(() =>
  import("../../pages/dashboard/product/list")
);
const ProductCreatePage = lazy(() =>
  import("../../pages/dashboard/product/new")
);
const ProductEditPage = lazy(() =>
  import("../../pages/dashboard/product/edit")
);
const PriceSettingListPage = lazy(() =>
  import("../../pages/dashboard/price-setting/list")
);

// ----------------------------------------------------------------------

function SuspenseOutlet() {
  const pathname = usePathname();
  return (
    <Suspense key={pathname} fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  );
}

const dashboardLayout = () => (
  <DashboardLayout>
    <SuspenseOutlet />
  </DashboardLayout>
);

export const dashboardRoutes: RouteObject[] = [
  {
    path: "dashboard",
    // element: dashboardLayout(),
    element: CONFIG.auth.skip ? (
      dashboardLayout()
    ) : (
      <AuthGuard>{dashboardLayout()}</AuthGuard>
    ),
    children: [
      { element: <OverviewBookingPage />, index: true },
      // { element: <IndexPage />, index: true },
      { path: "two", element: <FileManagerPage /> },
      // { path: 'two', element: <PageTwo /> },
      { path: "three", element: <OutputFileManagerPage /> },
      { path: "four", element: <OutputFileManagerPage /> },
      {
        path: "product",
        children: [
          { index: true, element: <ProductListPage /> },
          { path: "list", element: <ProductListPage /> },
          { path: ":id", element: <ProductDetailsPage /> },
          { path: "new", element: <ProductCreatePage /> },
          { path: ":id/edit", element: <ProductEditPage /> },
        ],
      },
      {
        path: "job",
        children: [
          { index: true, element: <InvoiceListPage /> },
          { path: "list", element: <InvoiceListPage /> },
          { path: ":id", element: <JobDetailsPage /> },
          { path: "new", element: <JobCreatePage /> },
          { path: ":id/edit", element: <JobEditPage /> },
        ],
      },
      {
        path: "filters",
        children: [
          { index: true, element: <ReplacementStringListView /> },
          { path: "priceSetting", element: <PriceSettingListPage /> },
          { path: "replacementString", element: <ReplacementStringListView /> },
          { path: "forbiddenString", element: <ForbiddenStringListPage /> },
          { path: "forbiddenSeller", element: <ForbiddenSellerListPage /> },
        ],
      },

      // {
      //   path: "forbiddenString",
      //   children: [
      //     { index: true, element: <OrderListPage /> },
      //     { path: "list", element: <OrderListPage /> },
      //     { path: ":id", element: <OrderDetailsPage /> },
      //   ],
      // },
      // {
      //   path: "forbiddenSeller",
      //   children: [
      //     { index: true, element: <ForbiddenSellerListPage /> },
      //     { path: "list", element: <ForbiddenSellerListPage /> },
      //   ],
      // },
      // {
      //   path: "replacementString",
      //   children: [
      //     { index: true, element: <ReplacementStringListView /> },
      //     { path: "list", element: <ReplacementStringListView /> },
      //   ],
      // },

      // {
      //   path: "group",
      //   children: [
      //     { element: <PageFour />, index: true },
      //     { path: "five", element: <PageFive /> },
      //     { path: "six", element: <PageSix /> },
      //   ],
      // },
    ],
  },
];
