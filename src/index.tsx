import React from "react";
import ReactDOM from "react-dom/client";
import { Router } from "./components/Router";
import { SiteDataStoreProvider } from "./components/SiteDataStore";

ReactDOM.hydrateRoot(
  document.getElementById("root")!,
  <React.StrictMode>
    <SiteDataStoreProvider>
      <Router />
    </SiteDataStoreProvider>
  </React.StrictMode>,
);
