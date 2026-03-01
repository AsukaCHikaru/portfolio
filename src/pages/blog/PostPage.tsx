import { Layout } from "../../components/Layout";
import { ContentBlock } from "../../components/ContentBlock";
import { formatDate } from "../../utils/dateTimeUtil";
import { Link } from "../../components/Link";
import { Helmet } from "../../components/Helmet";
import { useSiteData } from "../../components/SiteDataStore";

export const PostPage = () => {
  const siteData = useSiteData({
    path: "/blog/:post",
  });

  if (!siteData) {
    return null;
  }

  const { metadata, content } = siteData.data;

  return (
    <>
      <Helmet title={metadata.title} description={metadata.description} />
      <Layout>
        <div className="post-page-header_container">
          <Link to={`/blog?category=${metadata.category}`}>
            {metadata.category}
          </Link>
          <h1>{metadata.title}</h1>
          <h2>{metadata.description}</h2>
          <p>{formatDate(metadata.publishedAt)}</p>
        </div>
        <article className="post-page-content grid">
          {content.map((block, i) => (
            <ContentBlock block={block} key={i} />
          ))}
        </article>
      </Layout>
    </>
  );
};
