import { useContext } from "react";
import { DataContext } from "../../components/DataContext";
import { Layout } from "../../components/Layout";
import type { List, MusicAwardNominee } from "../../types";

export const ListPage = () => {
  const context = useContext(DataContext);
  const list = window.__STATIC_PROPS__.list || context.list;

  return <ListPageContent musicAwards={list.musicAwards} />;
};

interface Props {
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
}

export const ListPageContent = ({ musicAwards }: Props) => {
  return (
    <Layout>
      <h1>List</h1>
      <h2>description</h2>
      <ul>
        <li>
          <a href="/list/music-awards">
            <h3>{musicAwards.name}</h3>
            <h4>{musicAwards.description}</h4>
          </a>
        </li>
      </ul>
    </Layout>
  );
};
