import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { Router } from "./components/Router";
import { DataContext, type ContextData } from "./components/DataContext";

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
