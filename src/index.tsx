import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { Router } from "./components/Router";
import type { Block } from "@asukawang/amp";
import type { PostMetaData } from "./types";
import { DataContext } from "./components/DataContext";

declare global {
  interface Window {
    __STATIC_PROPS__: {
      postList: PostMetaData[];
      post: { metadata: PostMetaData; content: Block[] };
      about: { metadata: PostMetaData; content: Block[] };
    };
  }
}

const App = () => {
  const [data, setData] = useState<{
    postList: { metadata: PostMetaData; content: Block[] }[];
    about: { metadata: PostMetaData; content: Block[] } | null;
  }>();

  useEffect(() => {
    (async () => {
      const data = (await fetch("/data.json").then((res) => res.json())) as {
        postList: { metadata: PostMetaData; content: Block[] }[];
        about: { metadata: PostMetaData; content: Block[] } | null;
      };
      setData(data);
    })();
  }, []);

  if (!data) {
    return <Router />;
  }

  return (
    <DataContext.Provider value={data}>
      <Router />
    </DataContext.Provider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
