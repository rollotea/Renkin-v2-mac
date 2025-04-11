import { Helmet } from "react-helmet-async";

import { CONFIG } from "../../../global-config";

import { OverviewBookingView } from "../../../sections/overview/booking/view";

// ----------------------------------------------------------------------

const metadata = { title: `Dashboard` };
// const metadata = { title: `Page one | Dashboard - ${CONFIG.appName}` };
// const metadata = { title: `Booking | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <OverviewBookingView />
    </>
  );
}
