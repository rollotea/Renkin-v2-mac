// import './global.css';

import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { Snackbar } from "./components/snackbar";
import { ProgressBar } from "./components/progress-bar";
import { LocalizationProvider } from "./locales";

import { MotionLazy } from "./components/animate/motion-lazy";
import {
  SettingsDrawer,
  defaultSettings,
  SettingsProvider,
} from "./components/settings";

// import { AuthProvider } from "./auth/context/jwt";
import { AuthProvider } from "./auth/context/firebase";
import { themeConfig, ThemeProvider } from "./theme";
import { usePathname } from "./routes/hooks";

// ----------------------------------------------------------------------

type AppProps = {
  children: React.ReactNode;
};
function useScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
export default function App({ children }: AppProps) {
  useScrollToTop();
  return (
    <AuthProvider>
      <Provider store={store}>
        <SettingsProvider defaultSettings={defaultSettings}>
          <LocalizationProvider>
            <ThemeProvider
              noSsr
              defaultMode={themeConfig.defaultMode}
              modeStorageKey={themeConfig.modeStorageKey}
            >
              <MotionLazy>
                <Snackbar />
                <ProgressBar />
                <SettingsDrawer defaultSettings={defaultSettings} />
                {children}
              </MotionLazy>
            </ThemeProvider>
          </LocalizationProvider>
        </SettingsProvider>
      </Provider>
    </AuthProvider>
  );
}

// ----------------------------------------------------------------------
