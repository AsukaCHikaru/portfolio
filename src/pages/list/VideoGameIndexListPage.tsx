import { Layout } from "../../components/Layout";
import type { List, VideoGameIndexList } from "../../types";
import { Helmet } from "../../components/Helmet";
import { useSiteData } from "../../components/SiteDataStore";

const groupByFinished = (list: List<VideoGameIndexList>["list"]) => {
  const map = new Map<string, VideoGameIndexList>();
  list.forEach((game) => {
    if (map.has(game.played)) {
      map.set(game.played, [...(map.get(game.played) || []), game]);
    } else {
      map.set(game.played, [game]);
    }
  });
  return map;
};

export const VideoGameIndexListPage = () => {
  const siteData = useSiteData({ path: "/list/video-game-index" });
  if (!siteData) {
    return null;
  }

  const { videoGameIndex } = siteData.data;

  const grouped = groupByFinished(videoGameIndex.list);

  return (
    <>
      <Helmet
        title={`${videoGameIndex.name} | Asuka Wang`}
        description={videoGameIndex.description}
      />
      <Layout>
        <div className="post-page-header_container">
          <h1>{videoGameIndex.name}</h1>
          <h2>{videoGameIndex.description}</h2>
        </div>
        <article className="list list-video-game-index">
          {Array.from(grouped.keys())
            .sort((prev, next) => Number(next) - Number(prev))
            .map((year) => (
              <div key={year}>
                <h3>{year}</h3>
                <ul>
                  {grouped.get(year)?.map((game) => (
                    <li key={`${game.title}-${game.released}`}>
                      <h4>{game.title}</h4>
                      <p>
                        {game.developer}
                        {game.publisher === game.developer
                          ? null
                          : ` / ${game.publisher}`}
                        {` / ${game.released}`}
                      </p>
                      <p>
                        {game.rating}/10
                        <Separator />
                        {game.platform}
                        {game.reviewUrl ? (
                          <>
                            <Separator />
                            <a href={game.reviewUrl}>review</a>
                          </>
                        ) : null}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </article>
      </Layout>
    </>
  );
};

const Separator = () => <span>|</span>;
