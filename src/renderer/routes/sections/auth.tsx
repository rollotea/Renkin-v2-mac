import type { RouteObject } from "react-router";

import { Outlet } from "react-router";
import { lazy, Suspense } from "react";

import { AuthSplitLayout } from "../../layouts/auth-split";

import { SplashScreen } from "../../components/loading-screen";

import { GuestGuard } from "../../auth/guard";
import { AuthCenteredLayout } from "../../layouts/auth-centered";

// ----------------------------------------------------------------------

/** **************************************
 * Jwt
 *************************************** */
const Jwt = {
  SignInPage: lazy(() => import("../../pages/auth/jwt/sign-in")),
  SignUpPage: lazy(() => import("../../pages/auth/jwt/sign-up")),
};

const authJwt = {
  path: "jwt",
  children: [
    {
      path: "sign-in",
      element: (
        <GuestGuard>
          <AuthSplitLayout
            slotProps={{
              section: { title: "Hi, Welcome back" },
            }}
          >
            <Jwt.SignInPage />
          </AuthSplitLayout>
        </GuestGuard>
      ),
    },
    {
      path: "sign-up",
      element: (
        <GuestGuard>
          <AuthSplitLayout>
            <Jwt.SignUpPage />
          </AuthSplitLayout>
        </GuestGuard>
      ),
    },
  ],
};
const Firebase = {
  SignInPage: lazy(() => import("../../pages/auth/firebase/sign-in")),
  SignUpPage: lazy(() => import("../../pages/auth/firebase/sign-up")),
  VerifyPage: lazy(() => import("../../pages/auth/firebase/verify")),
  ResetPasswordPage: lazy(() =>
    import("../../pages/auth/firebase/reset-password")
  ),
};

const authFirebase = {
  path: "firebase",
  children: [
    {
      path: "sign-in",
      element: (
        <GuestGuard>
          <AuthCenteredLayout>
            <Firebase.SignInPage />
          </AuthCenteredLayout>
          {/* <AuthSplitLayout
            slotProps={{
              section: { title: "Hi, Welcome back" },
            }}
          >
            <Firebase.SignInPage />
          </AuthSplitLayout> */}
        </GuestGuard>
      ),
    },
    {
      path: "sign-up",
      element: (
        <GuestGuard>
          <AuthCenteredLayout>
            <Firebase.SignUpPage />
          </AuthCenteredLayout>
          {/* <AuthSplitLayout>
            <Firebase.SignUpPage />
          </AuthSplitLayout> */}
        </GuestGuard>
      ),
    },
    {
      path: "verify",
      element: (
        <AuthCenteredLayout>
          <Firebase.VerifyPage />
        </AuthCenteredLayout>
        // <AuthSplitLayout>
        //   <Firebase.VerifyPage />
        // </AuthSplitLayout>
      ),
    },
    {
      path: "reset-password",
      element: (
        <AuthCenteredLayout>
          <Firebase.ResetPasswordPage />
        </AuthCenteredLayout>
        // <AuthSplitLayout>
        //   <Firebase.ResetPasswordPage />
        // </AuthSplitLayout>
      ),
    },
  ],
};
// ----------------------------------------------------------------------

export const authRoutes: RouteObject[] = [
  {
    path: "auth",
    element: (
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    ),
    // children: [authJwt],
    children: [authFirebase],
  },
];
