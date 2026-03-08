import { Layout } from "../../components/Layout";
import { Link } from "../../components/Link";
import { generateArchiveTileList } from "../../utils/blogUtil";
import { formatDate } from "../../utils/dateTimeUtil";
import { Helmet } from "../../components/Helmet";
import { useSiteData } from "../../components/SiteDataStore";
import { useSearchParams } from "../../hooks/useSearchParams";

export const ArchivePage = () => {
  const searchParams = useSearchParams("/blog");
  const siteData = useSiteData({
    path: "/blog",
    searchParams,
  });

  if (!siteData) {
    return null;
  }

  const postList = siteData.data.postList.map((p) => p.metadata);
  const categoryFilter =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("category")
      : null;
  const tileList = generateArchiveTileList(postList);

  return (
    <>
      <Helmet title="Blog | Asuka Wang" description="Asuka Wang's blog" />
      <Layout>
        <h1
          className="post-archive-header"
          data-categorized={categoryFilter !== null}
        >
          {categoryFilter || "Blog"}
        </h1>
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
                  {!categoryFilter ? (
                    <p className="post-category">
                      {post.featured ? "featured " : ""}
                      {post.category}
                    </p>
                  ) : null}
                  <h2>{post.title}</h2>
                  <p className="post-description">{post.description}</p>
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
    </>
  );
};
