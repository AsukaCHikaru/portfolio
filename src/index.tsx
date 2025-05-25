import React from "react";
import ReactDOM from "react-dom/client";
import { Router } from "./Router";
import type { Block } from "@asukawang/amp";
import type { PostMetaData } from "./types";

declare global {
  interface Window {
    __STATIC_PROPS__: {
      postList: PostMetaData[];
      post: { metadata: PostMetaData; content: Block[] };
      about: { metadata: PostMetaData; content: Block[] };
    };
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
);
