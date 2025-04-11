import { Helmet } from "react-helmet-async";

import { CONFIG } from "../../../global-config";

import { FirebaseSignInView } from "../../../auth/view/firebase";

// ----------------------------------------------------------------------

const metadata = { title: `Sign in | Firebase - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <FirebaseSignInView />
    </>
  );
}
