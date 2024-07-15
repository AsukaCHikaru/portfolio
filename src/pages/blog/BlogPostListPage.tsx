import type { FC } from "react";
import type { BlogPostMeta } from "../../types";
import { useApi } from "../../services/apiCore";
import { getBlogList } from "../../services/markdownService";

export const BlogPostListPage = () => {
  const blogPostList = useApi({
    queryFn: () => getBlogList(),
  });

  return (
    <>
      <div>
        {blogPostList?.map((post) => (
          <BlogPostLink key={post.pathname} post={post} />
        ))}
      </div>
    </>
  );
};

interface BlogPostLinkProps {
  post: BlogPostMeta;
}
const BlogPostLink: FC<BlogPostLinkProps> = ({ post }) => (
  <a href={`/blog/${post.pathname}`}>{post.title}</a>
);
