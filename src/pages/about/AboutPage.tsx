import { Layout } from "../../components/Layout";
import { ContentBlock } from "../../components/ContentBlock";
import { Helmet } from "../../components/Helmet";
import { formatDate } from "../../utils/dateTimeUtil";
import { useSiteData } from "../../components/SiteDataStore";

export const AboutPage = () => {
  const siteData = useSiteData({
    path: "/about",
  });

  if (!siteData) {
    return null;
  }

  const post = siteData.data;

  return (
    <>
      <Helmet title="Asuka Wang" description="About Asuka Wang" />
      <Layout>
        <div className="about-page-header">
          <h1>About</h1>
          <p>
            Last updated:{" "}
            {formatDate(post.metadata.updatedAt || post.metadata.publishedAt)}
          </p>
        </div>
        <article className="post-page-content grid">
          {post.content.map((block, i) => (
            <ContentBlock key={i} block={block} />
          ))}
        </article>
      </Layout>
    </>
  );
};
