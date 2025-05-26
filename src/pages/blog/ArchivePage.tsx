import { useContext } from "react";
import { Layout } from "../../components/Layout";
import { Link } from "../../components/Link";
import type { PostMetaData } from "../../types";
import { DataContext } from "../../components/DataContext";

export const ArchivePage = () => {
  const context = useContext(DataContext);
  const postList =
    window.__STATIC_PROPS__.postList ||
    context.postList.map((post) => post.metadata);

  if (!context) {
    return null;
  }

  return <ArchivePageContent postList={postList} />;
};

interface Props {
  postList: PostMetaData[];
}
export const ArchivePageContent = ({ postList }: Props) => {
  return (
    <Layout>
      <h1>Blog Archive</h1>
      {postList.map((post) => (
        <Link key={post.pathname} to={`/blog/${post.pathname}`}>
          <h2>{post.title}</h2>
          <p>{post.description}</p>
          <p>Published on: {post.publishedAt}</p>
          <p>Category: {post.category}</p>
          <p>Topic: {post.topic}</p>
        </Link>
      ))}
    </Layout>
  );
};
