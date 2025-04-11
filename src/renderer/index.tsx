import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { Outlet, RouterProvider, createHashRouter } from "react-router";
// import { Outlet, RouterProvider, createBrowserRouter } from 'react-router';
import App from "./App";
import { routesSection } from "./routes/sections";
import { ErrorBoundary } from "./routes/components";

// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getFirestore } from "firebase/firestore";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyDc9iAGgKA14Qx47SSos4698_m7_Z2G8Ok",
//   authDomain: "aroe-9c4cf.firebaseapp.com",
//   projectId: "aroe-9c4cf",
//   storageBucket: "aroe-9c4cf.firebasestorage.app",
//   messagingSenderId: "952959832491",
//   appId: "1:952959832491:web:6ba20cba845134e296c2ee",
//   measurementId: "G-2EK6QCTZP7",
// };

// const app = firebase.initializeApp(firebaseConfig);
// // const analytics = firebase.getAnalytics(app);
// const db = firebase.firestore(app);
// // const db = firebase.getFirestore(app);

// export { db };
// // ----------------------------------------------------------------------
const router = createHashRouter([
  {
    Component: () => (
      <App>
        <Outlet />
      </App>
    ),
    errorElement: <ErrorBoundary />,
    children: routesSection,
  },
]);

// const router = createBrowserRouter([
//   {
//     Component: () => (
//       <App>
//         <Outlet />
//       </App>
//     ),
//     errorElement: <ErrorBoundary />,
//     children: routesSection,
//   },
// ]);

const root = createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  </StrictMode>
);

// import { createRoot } from 'react-dom/client';
// import App from './App';

// const container = document.getElementById('root') as HTMLElement;
// const root = createRoot(container);
// root.render(<App />);

// calling IPC exposed from preload script
window.electron.ipcRenderer.once("ipc-example", (arg) => {
  // eslint-disable-next-line no-console
  console.log(arg);
});
window.electron.ipcRenderer.sendMessage("ipc-example", ["ping"]);
