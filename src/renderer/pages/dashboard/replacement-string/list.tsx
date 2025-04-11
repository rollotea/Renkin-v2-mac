import { Helmet } from "react-helmet-async";

import { CONFIG } from "../../../global-config";

import { ReplacementStringListView } from "../../../sections/replacement-string/view";

// ----------------------------------------------------------------------

const metadata = { title: `Order list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ReplacementStringListView />
    </>
  );
}
