import { Helmet } from "react-helmet-async";

import { CONFIG } from "../../../global-config";

import { InvoiceListView } from "../../../sections/invoice/view";

// ----------------------------------------------------------------------

const metadata = { title: `Invoice list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <InvoiceListView />
    </>
  );
}
