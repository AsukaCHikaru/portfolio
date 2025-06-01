import { useContext, useMemo } from "react";
import { DataContext } from "../../components/DataContext";
import type { PostMetaData } from "../../types";
import type { Block } from "@asukawang/amp";
import { PostPageContent } from "../../components/PostPageContent";
import { Link } from "../../components/Link";

export const FrontPage = () => {
  const context = useContext(DataContext);
  const post = useMemo(
    () =>
      context.postList.sort(
        (a, b) =>
          new Date(b.metadata.publishedAt).getTime() -
          new Date(a.metadata.publishedAt).getTime(),
      )[0],
    [],
  );

  if (!post) {
    return null;
  }

  return (
    <FrontPageContent
      leadStory={{
        metadata: post.metadata,
        content: post.content,
      }}
      lastUpdated={post.metadata.publishedAt}
    />
  );
};

interface Props {
  leadStory: { metadata: PostMetaData; content: Block[] };
  lastUpdated: string;
}

export const FrontPageContent = ({ leadStory, lastUpdated }: Props) => {
  return (
    <div className="site_container">
      <Header lastUpdated={lastUpdated} />
      <LeadStory leadStory={leadStory} />
    </div>
  );
};

const Header = ({ lastUpdated }: { lastUpdated: string }) => (
  <header className="frontpage-header">
    <div>
      <div className="frontpage-header_slogan">
        <p>"The Work{"\n"}Goes On"</p>
      </div>
      <h1>
        <a href="/">ASUKA WANG</a>
      </h1>
      <div>
        Last Updated{"\n"}
        <time dateTime={lastUpdated}>{lastUpdated}</time>
      </div>
    </div>
    <nav>
      <Link to="/blog">blog</Link>
      <Link to="/about">about</Link>
      <Link to="/rss">rss</Link>
    </nav>
  </header>
);

const LeadStory = ({
  leadStory,
}: {
  leadStory: { metadata: PostMetaData; content: Block[] };
}) => (
  <article className="fontpage-lead-story_container">
    <PostPageContent
      metadata={leadStory.metadata}
      content={leadStory.content}
    />
  </article>
);
