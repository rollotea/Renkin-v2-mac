import { Helmet } from 'react-helmet-async';

import { CONFIG } from '../../../global-config';

import { JwtSignUpView } from '../../../auth/view/jwt';

// ----------------------------------------------------------------------

const metadata = { title: `Sign up | Jwt - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <JwtSignUpView />
    </>
  );
}
