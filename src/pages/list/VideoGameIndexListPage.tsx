import { useMemo } from "react";
import { Layout } from "../../components/Layout";
import type { List, VideoGameIndexList } from "../../types";

interface Props {
  videoGameIndex: List<VideoGameIndexList>;
}

export const VideoGameIndexListPage = ({ videoGameIndex }: Props) => {
  const groupByFinished = useMemo(() => {
    const map = new Map<string, VideoGameIndexList>();
    videoGameIndex.list.forEach((game) => {
      if (map.has(game.finished)) {
        map.set(game.finished, [...(map.get(game.finished) || []), game]);
      } else {
        map.set(game.finished, [game]);
      }
    });
    return map;
  }, [videoGameIndex]);

  return (
    <Layout>
      <div className="post-page-header_container">
        <h1>{videoGameIndex.name}</h1>
        <h2>{videoGameIndex.description}</h2>
      </div>
      <article className="list-video-game-index">
        {Array.from(groupByFinished.keys())
          .sort((prev, next) => Number(next) - Number(prev))
          .map((year) => (
            <div key={year}>
              <h3>{year}</h3>
              <ul>
                {groupByFinished.get(year)?.map((game) => (
                  <li key={game.title}>
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
                      {game.review ? (
                        <>
                          <Separator />
                          <a href={game.review}>review</a>
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
  );
};

const Separator = () => <span>|</span>;
