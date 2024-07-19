import React from "react";
import ReactDOM from "react-dom/client";
import "../node_modules/modern-normalize/modern-normalize.css";
import "./styles/index.css";
import "./styles/fonts.css";
import { Router } from "./components/Router";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
);
