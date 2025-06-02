import { useContext, useMemo } from "react";
import { DataContext } from "../../components/DataContext";
import { Link } from "../../components/Link";
import { ContentBlock } from "../../components/ContentBlock";
import type { Post } from "../../types";

export const FrontPage = () => {
  const context = useContext(DataContext);
  const post = useMemo(() => {
    const staticProp = window.__STATIC_PROPS__.frontPage;
    if (staticProp) {
      return staticProp.leadStory;
    }
    return context.postList.sort(
      (a, b) =>
        new Date(b.metadata.publishedAt).getTime() -
        new Date(a.metadata.publishedAt).getTime(),
    )[0];
  }, []);

  const lastUpdated = useMemo(() => {
    const staticProp = window.__STATIC_PROPS__.frontPage;
    return staticProp
      ? staticProp.leadStory.metadata.publishedAt
      : post.metadata.publishedAt;
  }, [post]);

  const furtherReading = useMemo(() => {
    const staticProp = window.__STATIC_PROPS__.frontPage;
    if (staticProp) {
      return staticProp.furtherReading;
    }
    return [
      ...context.postList.filter(
        (p) =>
          p.metadata.category === post.metadata.category &&
          p.metadata.pathname !== post.metadata.pathname,
      ),
    ].slice(0, 5);
  }, [context, post]);

  if (!post) {
    return null;
  }

  return (
    <FrontPageContent
      leadStory={{
        metadata: post.metadata,
        content: post.content,
      }}
      furtherReading={furtherReading}
      lastUpdated={lastUpdated}
    />
  );
};

interface Props {
  leadStory: Post;
  lastUpdated: string;
  furtherReading: Post[];
}

export const FrontPageContent = ({
  leadStory,
  lastUpdated,
  furtherReading,
}: Props) => (
  <div className="site_container">
    <Header lastUpdated={lastUpdated} />
    <LeadStory leadStory={leadStory} furtherReading={furtherReading} />
  </div>
);

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
  furtherReading,
}: {
  leadStory: Post;
  furtherReading: Post[];
}) => (
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
    <div className="frontpage-lead-story-side-column">
      <p>
        More from{" "}
        <a href={`/blog?category=${leadStory.metadata.category}`}>
          {leadStory.metadata.category}
        </a>
      </p>
      {furtherReading.map((post) => (
        <a
          className="frontpage-lead-story-side-column-post"
          key={post.metadata.pathname}
          href={`/blog/${post.metadata.pathname}`}
        >
          {post.metadata.title}
          <span>{post.metadata.description}</span>
          <span>{post.metadata.publishedAt}</span>
        </a>
      ))}
    </div>
  </>
);
