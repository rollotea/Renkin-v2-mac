import { Helmet } from "react-helmet-async";

import { CONFIG } from "../../../global-config";

import { JobCreateView } from "../../../sections/job/view";

// ----------------------------------------------------------------------

const metadata = { title: `Create a new job | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <JobCreateView />
    </>
  );
}
