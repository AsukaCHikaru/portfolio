import { useContext } from "react";
import { DataContext } from "../../components/DataContext";
import { Layout } from "../../components/Layout";
import { ContentBlock } from "../../components/ContentBlock";
import { Helmet } from "../../components/Helmet";
import { getPostDate } from "../../utils/blogUtil";

export const AboutPage = () => {
  const context = useContext(DataContext);
  const post = window.__STATIC_PROPS__.about || context.about;

  if (!post) {
    return null;
  }

  return (
    <>
      <Helmet title="Asuka Wang" description="About Asuka Wang" />
      <Layout>
        <div className="about-page-header">
          <h1>About</h1>
          <p>
            {getPostDate({
              publishedAt: post.metadata.publishedAt,
              updatedAt: post.metadata.updatedAt,
            })}
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
