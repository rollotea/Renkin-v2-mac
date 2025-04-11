import { Helmet } from 'react-helmet-async';

import { CONFIG } from '../../global-config';

import { BlankView } from '../../sections/blank/view';

// ----------------------------------------------------------------------

const metadata = { title: `Page five | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <BlankView title="Page five" />
    </>
  );
}
