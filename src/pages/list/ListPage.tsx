import { useContext } from "react";
import { DataContext } from "../../components/DataContext";
import { Layout } from "../../components/Layout";
import type { List, MusicAwardList, VideoGameIndexList } from "../../types";
import { Link } from "../../components/Link";
import { MusicAwardsListPage } from "./MusicAwardsListPage";
import { VideoGameIndexListPage } from "./VideoGameIndexListPage";

export const ListPage = () => {
  const context = useContext(DataContext);
  const list = window.__STATIC_PROPS__.list || context.list;

  return (
    <ListPageContent
      musicAwards={list.musicAwards}
      videoGameIndex={list.videoGameIndex}
    />
  );
};

interface Props {
  musicAwards: List<MusicAwardList>;
  videoGameIndex: List<VideoGameIndexList>;
}

export const ListPageContent = ({ musicAwards, videoGameIndex }: Props) => {
  return (
    <Layout>
      <h1 className="list-page-header">List</h1>
      <div className="list-page-list">
        <ul>
          <li>
            <Link to={`/list/${musicAwards.pathname}`}>
              <h3>{musicAwards.name}</h3>
              <p>{musicAwards.description}</p>
            </Link>
          </li>
          <li>
            <Link to={`/list/${videoGameIndex.pathname}`}>
              <h3>{videoGameIndex.name}</h3>
              <p>{videoGameIndex.description}</p>
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
  ) : listName === "video-game-index" ? (
    <VideoGameIndexListPage videoGameIndex={list.videoGameIndex} />
  ) : null;
};
