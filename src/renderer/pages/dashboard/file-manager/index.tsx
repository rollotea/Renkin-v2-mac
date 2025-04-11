import { Helmet } from "react-helmet-async";

import { CONFIG } from "../../../global-config";

import { FileManagerView } from "../../../sections/file-manager/view";

// ----------------------------------------------------------------------

const metadata = { title: `Input` };
// const metadata = { title: `File manager | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <FileManagerView />
    </>
  );
}
