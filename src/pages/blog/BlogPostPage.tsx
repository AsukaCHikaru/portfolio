import { PostBodyBlock } from "../../components/BlogPostBodyBlock";
import styles from "./BlogPostPage.module.css";
import type { FC } from "react";
import type { BlogPostMeta } from "../../../types";
import type { MarkdownBlock } from "../../../types/markdown";
import { getBlogPost } from "../../services/markdownService";

interface Props {
  content: MarkdownBlock[];
  meta: BlogPostMeta;
}

export const BlogPostPage: FC<Props> = ({ content, meta }) => (
  <>
    <BlogPostPageHeader postMeta={meta} />
    <div className={styles["content-container"]}>
      {content.map((block) => (
        <PostBodyBlock block={block} />
      ))}
    </div>
  </>
);

const BlogPostPageHeader: FC<{ postMeta: BlogPostMeta }> = ({ postMeta }) => (
  <div className={styles.header}>
    <h1>{postMeta.title}</h1>
    {postMeta.description ? <h2>{postMeta.description}</h2> : null}
    <div>{postMeta.published}</div>
  </div>
);

const getProps = async (postPath: string): Promise<Props> => {
  const { content, meta } = await getBlogPost(postPath);

  return { content, meta };
};

export default { Element: BlogPostPage, getProps };
