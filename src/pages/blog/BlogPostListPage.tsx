import type { FC } from "react";
import type { BlogPostMeta } from "../../../types";
import { useApi } from "../../services/apiCore";
import { getBlogPostList } from "../../services/markdownService";
import styles from "./BlogPostListPage.module.css";

export const BlogPostListPage = () => {
  const blogPostList = useApi({
    queryFn: () => getBlogPostList(),
  });

  return (
    <>
      <div className={styles["link-container"]}>
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
