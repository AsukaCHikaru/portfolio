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
      <h1 className="list-page-header">List</h1>
      <div className="list-page-list">
        <ul>
          <li>
            <Link to="/list/music-awards">
              <h3>{musicAwards.name}</h3>
              <p>{musicAwards.description}</p>
            </Link>
          </li>
        </ul>
      </div>
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
