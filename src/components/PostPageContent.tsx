import type { Block } from "@asukawang/amp";
import { Layout } from "./Layout";
import type { PostMetaData } from "../types";
import { ContentBlock } from "./ContentBlock";
import { getPostDate } from "../utils/blogUtil";

interface Props {
  metadata: PostMetaData;
  content: Block[];
}
export const PostPageContent = ({ metadata, content }: Props) => {
  return (
    <Layout>
      <div className="post-page-header_container">
        <h1>{metadata.title}</h1>
        <h2>{metadata.description}</h2>
        <p>
          {getPostDate({
            publishedAt: metadata.publishedAt,
            updatedAt: metadata.updatedAt,
          })}
        </p>
      </div>
      <article className="post-page-content grid">
        {content.map((block, i) => (
          <ContentBlock block={block} key={i} />
        ))}
      </article>
    </Layout>
  );
};
