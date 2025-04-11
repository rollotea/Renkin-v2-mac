import { Helmet } from "react-helmet-async";

import { CONFIG } from "../../../global-config";

import { JobListView } from "../../../sections/job/view";

// ----------------------------------------------------------------------

const metadata = { title: `Job list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <JobListView />
    </>
  );
}
