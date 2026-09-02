import { useMemo } from "react";
import { Layout } from "../../components/Layout";
import { ContentBlock } from "../../components/ContentBlock";
import { formatDate } from "../../utils/dateTimeUtil";
import { Link } from "../../components/Link";
import { Helmet } from "../../components/Helmet";
import { useSiteData } from "../../components/SiteDataStore";
import { usePathParams } from "../../hooks/usePathParams";
import {
  collectSidenotes,
  SidenoteContext,
} from "../../components/SidenoteContext";

export const PostPage = () => {
  const pathParams = usePathParams("/blog/:postId");
  const siteData = useSiteData({
    path: "/blog/:postId",
    pathParams,
  });

  const sidenotes = useMemo(
    () => collectSidenotes(siteData?.data.content ?? []),
    [siteData],
  );

  if (!siteData) {
    return null;
  }

  const { metadata, content } = siteData.data;

  return (
    <>
      <Helmet
        title={`${metadata.title} | Asuka Wang`}
        description={metadata.description}
      />
      <Layout>
        <div className="post-page-header_container">
          <Link to={`/blog?category=${metadata.category}`}>
            {metadata.category}
          </Link>
          <h1>{metadata.title}</h1>
          <h2>{metadata.description}</h2>
          <p>{formatDate(metadata.publishedAt)}</p>
        </div>
        <SidenoteContext.Provider value={sidenotes}>
          <article className="post-page-content">
            {content.map((block, i) => (
              <ContentBlock block={block} key={i} />
            ))}
          </article>
        </SidenoteContext.Provider>
      </Layout>
    </>
  );
};
