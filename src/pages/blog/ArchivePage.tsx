import { type PostMetaData } from "../../../tools/contentServices";
import { Layout } from "../../components/Layout";

export const ArchivePage = () => {
  const postList = window.__STATIC_PROPS__.postList;
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
        <a key={post.pathname} href={`/blog/${post.pathname}`}>
          <h2>{post.title}</h2>
          <p>{post.description}</p>
          <p>Published on: {post.publishedAt}</p>
          <p>Category: {post.category}</p>
          <p>Topic: {post.topic}</p>
        </a>
      ))}
    </Layout>
  );
};
