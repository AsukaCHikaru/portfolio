import { useContext } from "react";
import { Layout } from "../../components/Layout";
import { Link } from "../../components/Link";
import type { PostMetaData } from "../../types";
import { DataContext } from "../../components/DataContext";
import { generateArchiveTileList } from "../../utils/blogUtil";

export const ArchivePage = () => {
  const context = useContext(DataContext);
  const postList =
    window.__STATIC_PROPS__.blog?.postList ||
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
  const tileList = generateArchiveTileList(postList);

  return (
    <Layout>
      <h1>Blog Archive</h1>
      {tileList.map((row, i) => (
        <div key={i} className="post-archive-row">
          {row.map(({ post, size }, i) => (
            <Link
              key={post.pathname}
              to={`/blog/${post.pathname}`}
              className={`post-archive-tile tile-size-${size} tile-pos-${i + 1}`}
            >
              <h2>{post.title}</h2>
              <p>{post.description}</p>
            </Link>
          ))}
        </div>
      ))}
    </Layout>
  );
};
