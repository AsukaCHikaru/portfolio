import { useContext } from "react";
import { DataContext } from "../../components/DataContext";
import { Layout } from "../../components/Layout";
import type { List, MusicAwardNominee } from "../../types";
import { Link } from "../../components/Link";
import { MusicAwardsListPage } from "./MusicAwardsListPage";

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
          <Link to="/list/music-awards">
            <h3>{musicAwards.name}</h3>
            <h4>{musicAwards.description}</h4>
          </Link>
        </li>
      </ul>
    </Layout>
  );
};

export const ListRouter = () => {
  const listName = window.location.pathname.replace(/\/list\/(\S+?)\/?$/, "$1");
  const context = useContext(DataContext);
  const list = window.__STATIC_PROPS__.list || context.list;

  return listName === "music-awards" ? (
    <MusicAwardsListPage musicAwards={list.musicAwards} />
  ) : null;
};
