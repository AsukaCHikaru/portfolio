import React from "react";
import ReactDOM from "react-dom/client";
import { Router } from "./components/Router";

ReactDOM.hydrateRoot(
  document.getElementById("root")!,
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
);
