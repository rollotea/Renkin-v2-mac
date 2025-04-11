import { Helmet } from "react-helmet-async";

import { CONFIG } from "../../../global-config";

import { ForbiddenSellerListView } from "../../../sections/forbidden-seller/view";

// ----------------------------------------------------------------------

const metadata = { title: `Order list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ForbiddenSellerListView />
    </>
  );
}
