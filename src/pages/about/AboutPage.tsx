import { useContext } from "react";
import { DataContext } from "../../components/DataContext";
import { Layout } from "../../components/Layout";
import { ContentBlock } from "../../components/ContentBlock";
import { Helmet } from "../../components/Helmet";

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
        <h1 className="about-page-header">About</h1>
        <article className="post-page-content grid">
          {post.content.map((block, i) => (
            <ContentBlock key={i} block={block} />
          ))}
        </article>
      </Layout>
    </>
  );
};
