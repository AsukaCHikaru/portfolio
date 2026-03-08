import React from "react";
import ReactDOM from "react-dom/client";
import { SiteDataStoreProvider } from "./components/SiteDataStore";
import { Router } from "./components/Router";

ReactDOM.hydrateRoot(
  document.getElementById("root")!,
  <React.StrictMode>
    <SiteDataStoreProvider>
      <Router />
    </SiteDataStoreProvider>
  </React.StrictMode>,
);
