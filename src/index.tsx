import React from "react";
import ReactDOM from "react-dom/client";
import type { Block } from "typescript";
import type { PostMetaData } from "../tools/contentServices";
import "../node_modules/modern-normalize/modern-normalize.css";
import "./style.css";
import { Router } from "./Router";

declare global {
  interface Window {
    __STATIC_PROPS__: {
      postList: PostMetaData[];
      post: { metadata: PostMetaData; content: Block[] };
    };
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
);
