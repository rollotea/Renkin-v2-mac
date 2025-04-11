import { Helmet } from "react-helmet-async";

import { CONFIG } from "../../../global-config";

import { ProductCreateView } from "../../../sections/product/view";

// ----------------------------------------------------------------------

const metadata = {
  title: `Create a new product | Dashboard - ${CONFIG.appName}`,
};

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ProductCreateView />
    </>
  );
}
