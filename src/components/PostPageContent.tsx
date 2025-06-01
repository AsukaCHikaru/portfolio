import type { Block } from "@asukawang/amp";
import { Layout } from "./Layout";
import type { PostMetaData } from "../types";
import { ContentBlock } from "./ContentBlock";

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
        <p>{metadata.publishedAt}</p>
      </div>
      <article>
        {content.map((block, i) => (
          <ContentBlock block={block} key={i} />
        ))}
      </article>
    </Layout>
  );
};
