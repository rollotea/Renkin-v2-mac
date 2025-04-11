import { Helmet } from "react-helmet-async";

import { CONFIG } from "../../../global-config";

import { ProductListView } from "../../../sections/product/view";

// ----------------------------------------------------------------------

const metadata = { title: `Product list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ProductListView />
    </>
  );
}
