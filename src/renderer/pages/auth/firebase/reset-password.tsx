import { Helmet } from "react-helmet-async";

import { CONFIG } from "../../../global-config";

import { FirebaseResetPasswordView } from "../../../auth/view/firebase";

// ----------------------------------------------------------------------

const metadata = { title: `Reset password | Firebase - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <FirebaseResetPasswordView />
    </>
  );
}
