import { useContext, useMemo } from "react";
import { DataContext } from "../../components/DataContext";
import { Link } from "../../components/Link";
import { ContentBlock } from "../../components/ContentBlock";
import type { Post } from "../../types";

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
  leadStory: Post;
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

const LeadStory = ({ leadStory }: { leadStory: Post }) => (
  <>
    <div className="frontpage-lead-story_story">
      <div className="frontpage-lead-story_header">
        <h2>{leadStory.metadata.title}</h2>
        <p>{leadStory.metadata.description}</p>
        <p>{leadStory.metadata.publishedAt}</p>
      </div>
      <article className="fontpage-lead-story_container">
        {leadStory.content.map((block, i) => (
          <ContentBlock block={block} key={i} />
        ))}
      </article>
    </div>
    <div className="frontpage-lead-story-side-column">side column</div>
  </>
);
