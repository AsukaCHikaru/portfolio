import type { Block } from "../../tools/markdownParser";
import { Layout } from "./Layout";
import type { PostMetaData } from "../types";
import { ContentBlock } from "./ContentBlock";
import { formatDate } from "../utils/dateTimeUtil";
import { Link } from "./Link";

interface Props {
  metadata: PostMetaData;
  content: Block[];
}
export const PostPageContent = ({ metadata, content }: Props) => {
  return (
    <Layout>
      <div className="post-page-header_container">
        <Link to={`/blog/?category=${metadata.category}`}>
          {metadata.category}
        </Link>
        <h1>{metadata.title}</h1>
        <h2>{metadata.description}</h2>
        <p>{formatDate(metadata.publishedAt)}</p>
      </div>
      <article className="post-page-content grid">
        {content.map((block, i) => (
          <ContentBlock block={block} key={i} />
        ))}
      </article>
    </Layout>
  );
};
