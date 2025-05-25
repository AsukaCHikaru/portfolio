import type { TextBody, Link, Block } from "@asukawang/amp";
import { Layout } from "./Layout";
import type { PostMetaData } from "../types";

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

const ContentBlock = ({ block }: { block: Block }) => {
  switch (block.type) {
    case "paragraph":
      return (
        <p>
          <BodyBlocks body={block.body} />
        </p>
      );
    case "heading":
      switch (block.level) {
        case 1:
          return (
            <h1>
              <BodyBlocks body={block.body} />
            </h1>
          );
        case 2:
          return (
            <h2>
              <BodyBlocks body={block.body} />
            </h2>
          );
        case 3:
          return (
            <h3>
              <BodyBlocks body={block.body} />
            </h3>
          );
        case 4:
          return (
            <h4>
              <BodyBlocks body={block.body} />
            </h4>
          );
        case 5:
          return (
            <h5>
              <BodyBlocks body={block.body} />
            </h5>
          );
        case 6:
          return (
            <h6>
              <BodyBlocks body={block.body} />
            </h6>
          );
        default:
          throw new Error(
            `Invalid heading level: ${block.level satisfies never}`,
          );
      }
    case "image":
      return (
        <figure>
          {block.url.endsWith("mp4") ? (
            <video
              src={`/public/images/blog/${block.url}`}
              controls={false}
              autoPlay={true}
              loop={true}
              muted={true}
              playsInline={true}
            />
          ) : (
            <img src={`/public/images/blog/${block.url}`} alt={block.altText} />
          )}
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      );
    case "list":
      return block.ordered ? (
        <ol>
          {block.items.map((li, i) => (
            <li key={i}>
              <BodyBlocks body={li.body} />
            </li>
          ))}
        </ol>
      ) : (
        <ul>
          {block.items.map((li, i) => (
            <li key={i}>
              <BodyBlocks body={li.body} />
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote>
          {block.body.map((item, i) => (
            <span>
              <TextBodyBlock body={item} key={i} />
            </span>
          ))}
        </blockquote>
      );
    case "code":
      return <pre>TODO</pre>;
    case "thematicBreak":
      return <hr />;
    default:
      return null;
  }
};

const BodyBlocks = ({ body }: { body: (TextBody | Link)[] }) =>
  body.map((item, i) => <TextBodyBlock body={item} key={i} />);

const TextBodyBlock = ({ body }: { body: TextBody | Link }) => {
  switch (body.type) {
    case "textBody":
      switch (body.style) {
        case "plain":
          return <>{body.value}</>;
        case "code":
          return <code>{body.value}</code>;
        case "strong":
          return <strong>{body.value}</strong>;
        case "italic":
          return <i>{body.value}</i>;
        default:
          throw new Error(
            `Invalid text body style: ${body.style satisfies never}`,
          );
      }
    case "link":
      return (
        <a href={body.url} target="_blank" rel="noopener noreferrer">
          {body.body.map((item, i) => (
            <TextBodyBlock body={item} key={i} />
          ))}
        </a>
      );
  }
};
