import { type FC } from "react";
import type { BlogPostMeta } from "../../../types";
import styles from "./BlogPostListPage.module.css";
import { getBlogPostList } from "../../services/markdownService";

interface Props {
  blogPostList: BlogPostMeta[];
}

export const BlogPostListPage: FC<Props> = ({ blogPostList }) => {
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
  <a href={`/blog/${post.pathname}`} className={styles["link-wrapper"]}>
    <h2 className={styles["post-title"]}>{post.title}</h2>
    {post.description ? (
      <p className={styles["post-description"]}>{post.description}</p>
    ) : null}
    <div className={styles["post-date"]}>{post.published}</div>
  </a>
);

const getProps = async (): Promise<Props> => {
  const blogPostList = await getBlogPostList();

  return { blogPostList };
};

export default {
  Element: BlogPostListPage,
  getProps,
};
