import type { FC } from "react";
import type { BlogPostMeta } from "../../../types";
import { useApi } from "../../services/apiCore";
import { getBlogPostList } from "../../services/markdownService";
import styles from "./BlogPostListPage.module.css";
import { Link } from "@tanstack/react-router";

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
  <Link to={`/blog/${post.pathname}`} className={styles["link-wrapper"]}>
    <h2 className={styles["post-title"]}>{post.title}</h2>
    {post.description ? (
      <p className={styles["post-description"]}>{post.description}</p>
    ) : null}
    <div className={styles["post-date"]}>{post.published}</div>
  </Link>
);
