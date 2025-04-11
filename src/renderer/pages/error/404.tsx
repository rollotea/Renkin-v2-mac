import { Helmet } from 'react-helmet-async';

import { CONFIG } from '../../global-config';

import { NotFoundView } from '../../sections/error';

// ----------------------------------------------------------------------

const metadata = { title: `404 page not found! | Error - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <NotFoundView />
    </>
  );
}
