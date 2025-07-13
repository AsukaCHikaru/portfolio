import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { Router } from "./components/Router";
import type { FurtherReading, Post, PostMetaData } from "./types";
import { DataContext } from "./components/DataContext";

declare global {
  interface Window {
    __STATIC_PROPS__: {
      blog: {
        postList: PostMetaData[];
        post: Post;
      };
      about: Post;
      frontPage: {
        leadStory: Post;
        furtherReading: FurtherReading;
        categories: { name: string; count: number }[];
        featuredReading: Post;
      };
      lastUpdated: string;
    };
  }
}

const App = () => {
  const [data, setData] = useState<{
    postList: Post[];
    about: Post | null;
  }>();

  useEffect(() => {
    (async () => {
      const data = (await fetch("/data.json").then((res) => res.json())) as {
        postList: Post[];
        about: Post | null;
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
