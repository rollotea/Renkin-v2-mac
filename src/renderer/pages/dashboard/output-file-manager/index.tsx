import { Helmet } from "react-helmet-async";

import { CONFIG } from "../../../global-config";

// import { FileManagerView } from "../../../sections/file-manager/view";
import { OutputFileManagerView } from "../../../sections/output-file-manager/view";
// ----------------------------------------------------------------------

// const metadata = { title: `File manager | Dashboard - ${CONFIG.appName}` };
const metadata = { title: `Output` };
// const metadata = { title: `Page three | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <OutputFileManagerView />
    </>
  );
}
