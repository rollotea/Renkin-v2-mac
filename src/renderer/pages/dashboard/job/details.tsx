import { Helmet } from "react-helmet-async";

import { useParams } from "../../../routes/hooks";

import { _jobs } from "../../../_mock/_job";
import { CONFIG } from "../../../global-config";

import { JobDetailsView } from "../../../sections/job/view";

// ----------------------------------------------------------------------

const metadata = { title: `Job details | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = "" } = useParams();

  // const currentJob = _jobs.find((job) => job.id === id);
  const currentJob = window.electron.ipcRenderer.getScrapingTemplate(id);
  console.log("currentJob:", currentJob);
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <JobDetailsView id={id} />
      {/* <JobDetailsView job={currentJob} /> */}
    </>
  );
}
