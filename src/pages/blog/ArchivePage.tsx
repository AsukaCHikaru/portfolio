import { useContext, useMemo } from "react";
import { Layout } from "../../components/Layout";
import { Link } from "../../components/Link";
import type { PostMetaData } from "../../types";
import { DataContext } from "../../components/DataContext";
import { generateArchiveTileList } from "../../utils/blogUtil";
import { formatDate } from "../../utils/dateTimeUtil";
import { Helmet } from "../../components/Helmet";

export const ArchivePage = () => {
  const context = useContext(DataContext);
  const allPosts =
    window.__STATIC_PROPS__.blog?.postList ||
    context.postList.map((post) => post.metadata);

  const filteredPostList = useMemo(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFilter = urlParams.get('category');
    
    if (!categoryFilter) {
      return allPosts;
    }
    
    return allPosts.filter(post => post.category === categoryFilter);
  }, [allPosts]);

  if (!context) {
    return null;
  }

  return (
    <>
      <Helmet title="Blog | Asuka Wang" description="Asuka Wang's blog" />
      <ArchivePageContent postList={filteredPostList} />
    </>
  );
};

interface Props {
  postList: PostMetaData[];
}
export const ArchivePageContent = ({ postList }: Props) => {
  const tileList = generateArchiveTileList(postList);

  return (
    <Layout>
      <h1 className="post-archive-header">Blog</h1>
      {tileList.map((row, i) => (
        <div key={i} className="post-archive-row grid">
          {row.map(({ post, size, position }) => (
            <Link
              key={post.pathname}
              to={`/blog/${post.pathname}`}
              className={`post-archive-tile tile-size-${size} tile-pos-${position} ${
                post.thumbnailDirection === "landscape"
                  ? "tile-landscape"
                  : post.thumbnailDirection === "portrait"
                    ? "tile-portrait"
                    : ""
              }`}
            >
              <div>
                <p>{post.category}</p>
                <h2>{post.title}</h2>
                <p>{post.description}</p>
                <p>{formatDate(post.publishedAt)}</p>
              </div>
              {post.thumbnail && (
                <img
                  src={`/public/images/blog/${post.thumbnail}`}
                  alt={post.title}
                  className="post-thumbnail"
                />
              )}
            </Link>
          ))}
        </div>
      ))}
    </Layout>
  );
};
