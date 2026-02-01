import { useContext } from "react";
import { DataContext } from "../../components/DataContext";

export const ListPage = () => {
  const context = useContext(DataContext);
  const list = window.__STATIC_PROPS__.list || context.list;

  return <div>list</div>;
};
