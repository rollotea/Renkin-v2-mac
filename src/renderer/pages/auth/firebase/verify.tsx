import { Helmet } from "react-helmet-async";

import { CONFIG } from "../../../global-config";

import { FirebaseVerifyView } from "../../../auth/view/firebase";

// ----------------------------------------------------------------------

const metadata = { title: `Verify | Firebase - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <FirebaseVerifyView />
    </>
  );
}
