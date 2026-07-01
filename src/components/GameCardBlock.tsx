import { usePathParams } from "../hooks/usePathParams";
import { useSiteData } from "./SiteDataStore";

export const GameCardBlock = () => {
  const gameData = useSiteData({ path: "/list/video-game-index" });
  const pathParams = usePathParams("/blog/:postId");
  const postData = useSiteData({
    path: "/blog/:postId",
    pathParams,
  });

  if (!gameData || !postData) {
    return null;
  }

  const game = gameData.data.videoGameIndex.list.find((g) =>
    g.reviewUrl?.endsWith(postData.data.metadata.pathname),
  );

  if (!game) {
    return null;
  }

  return (
    <div className="post-page-review-game-card_container">
      <img src={`/public/images/game_thumbnail/${game.id}.webp`} />
      <div>
        <h5>{game.title}</h5>
        <h6>
          {game.developer}
          {game.publisher === game.developer ? null : ` / ${game.publisher}`}
          {` / ${game.released}`}
        </h6>
        <p>
          {game.rating}/10
          <Separator />
          {game.platform}
        </p>
      </div>
    </div>
  );
};

const Separator = () => <span>|</span>;
