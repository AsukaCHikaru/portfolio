import { Link } from "../../components/Link";
import { ContentBlock } from "../../components/ContentBlock";
import type { FrontPageData, FurtherReading, Post } from "../../types";
import { formatDate } from "../../utils/dateTimeUtil";
import { Helmet } from "../../components/Helmet";
import { FrontPageHeader } from "../../components/SiteHeader";
import { useSiteData } from "../../components/SiteDataStore";

export const FrontPage = () => {
  const siteData = useSiteData<FrontPageData>(new URL(window.location.href));

  if (!siteData) {
    return null;
  }

  const { leadStory, lastUpdated, furtherReading, categories, featuredReading } =
    siteData.data;

  return (
    <>
      <Helmet title="Asuka Wang" description="Asuka Wang's personal website" />
      <FrontPageContent
        leadStory={leadStory}
        furtherReading={furtherReading}
        lastUpdated={lastUpdated}
        categories={categories}
        featuredReading={featuredReading}
      />
    </>
  );
};

interface Props {
  leadStory: Post;
  lastUpdated: string;
  furtherReading: FurtherReading;
  categories: { name: string; count: number }[];
  featuredReading?: Post;
}

export const FrontPageContent = ({
  leadStory,
  lastUpdated,
  furtherReading,
  categories,
  featuredReading,
}: Props) => (
  <div className="site_container">
    <FrontPageHeader lastUpdated={lastUpdated} />
    <main className="grid">
      <LeadStory leadStory={leadStory} />
      <SideColumn furtherReading={furtherReading} categories={categories} />
      {featuredReading ? (
        <FeaturedReading featuredReading={featuredReading} />
      ) : null}
    </main>
    <Footer />
  </div>
);

const LeadStory = ({ leadStory }: { leadStory: Post }) => (
  <div className="frontpage-lead-story_story">
    <div className="frontpage-lead-story_header">
      <h2>{leadStory.metadata.title}</h2>
      <p>{leadStory.metadata.description}</p>
      <p>{formatDate(leadStory.metadata.publishedAt)}</p>
    </div>
    <article className="frontpage-lead-story_container">
      {leadStory.content.map((block, i) => (
        <ContentBlock block={block} key={i} />
      ))}
    </article>
  </div>
);

const SideColumn = ({
  furtherReading,
  categories,
}: {
  furtherReading: FurtherReading;
  categories: { name: string; count: number }[];
}) => (
  <div className="frontpage-side-column">
    {furtherReading.posts.length > 0 ? (
      <div className="frontpage-side-column-further-reading">
        <p>
          {furtherReading.type === "category" ? (
            <>
              More from{" "}
              <Link
                to={`/blog?category=${furtherReading.posts[0].metadata.category}`}
              >
                {furtherReading.posts[0].metadata.category}
              </Link>
            </>
          ) : (
            "Recent posts"
          )}
        </p>
        <div>
          {furtherReading.posts.map((post) => (
            <Link
              className="frontpage-side-column-post"
              key={post.metadata.pathname}
              to={`/blog/${post.metadata.pathname}`}
            >
              {post.metadata.title}
              <span>{post.metadata.description}</span>
              <span>{formatDate(post.metadata.publishedAt)}</span>
            </Link>
          ))}
        </div>
      </div>
    ) : null}
    <div className="frontpage-side-column-categories">
      <p>Categories</p>
      {categories.map((category) => (
        <Link key={category.name} to={`/blog?category=${category.name}`}>
          {category.name}
          <div />
          <span>{category.count} posts</span>
        </Link>
      ))}
    </div>
  </div>
);

const FeaturedReading = ({ featuredReading }: { featuredReading: Post }) => (
  <div className="frontpage-featured-reading">
    <h2>Featured Reading</h2>
    <Link to={`/blog/${featuredReading.metadata.pathname}`}>
      <div>
        <h3>{featuredReading.metadata.title}</h3>
        <p>{featuredReading.metadata.description}</p>
        <p>{formatDate(featuredReading.metadata.publishedAt)}</p>
      </div>
      <img src={`/public/images/blog/${featuredReading.metadata.thumbnail}`} />
    </Link>
  </div>
);

const Footer = () => <footer>Asuka Wang © {new Date().getFullYear()}</footer>;
