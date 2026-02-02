import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { Router } from "./components/Router";
import type {
  FurtherReading,
  List,
  MusicAwardNominee,
  Post,
  PostMetaData,
} from "./types";
import { DataContext, type ContextData } from "./components/DataContext";

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
      list: {
        musicAwards: List<
          {
            year: string;
            categories: [
              {
                category: string;
                nominees: MusicAwardNominee[];
              },
            ];
          }[]
        >;
      };
      lastUpdated: string;
    };
  }
}

const App = () => {
  const [data, setData] = useState<ContextData | null>(null);

  useEffect(() => {
    (async () => {
      const data = (await fetch("/data.json").then((res) =>
        res.json(),
      )) as ContextData;
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
