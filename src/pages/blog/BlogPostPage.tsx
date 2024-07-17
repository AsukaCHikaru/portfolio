import { useParams } from "@tanstack/react-router";
import { useApi } from "../../services/apiCore";
import { getBlogPost } from "../../services/markdownService";
import { PostBodyBlock } from "../../components/BlogPostBodyBlock";
import styles from "./BlogPostPage.module.css";
import type { FC } from "react";
import type { BlogPostMeta } from "../../../types";

export const BlogPostPage = () => {
  const { postPath } = useParams({ from: "/blog/$postPath" });
  const post = useApi({
    queryFn: () => getBlogPost(postPath),
  });

  return post ? (
    <>
      <BlogPostPageHeader postMeta={post?.meta} />
      <div className={styles["content-container"]}>
        {post?.content.map((block) => <PostBodyBlock block={block} />)}
      </div>
    </>
  ) : null;
};

const BlogPostPageHeader: FC<{ postMeta: BlogPostMeta }> = ({ postMeta }) => (
  <div className={styles.header}>
    <h1>{postMeta.title}</h1>
    {postMeta.description ? <h2>{postMeta.description}</h2> : null}
    <div>{postMeta.published}</div>
  </div>
);
