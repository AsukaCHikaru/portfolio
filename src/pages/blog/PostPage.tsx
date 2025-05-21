import type { Block, Link, TextBody } from "@asukawang/amp";
import { type PostMetaData } from "../../../tools/contentServices";
import styles from "./post-page.module.css";

export const PostPage = () => {
  const post = window.__STATIC_PROPS__.post;
  return <PostPageContent metadata={post.metadata} content={post.content} />;
};

interface Props {
  metadata: PostMetaData;
  content: Block[];
}
export const PostPageContent = ({ metadata, content }: Props) => {
  return (
    <div className={styles.container}>
      <h1>{metadata.title}</h1>
      <h2>{metadata.description}</h2>
      <p>{metadata.publishedAt}</p>
      {content.map((block, i) => (
        <ContentBlock block={block} key={i} />
      ))}
    </div>
  );
};

const ContentBlock = ({ block }: { block: Block }) => {
  switch (block.type) {
    case "paragraph":
      return (
        <p>
          {block.body.map((item, i) => (
            <TextBodyBlock body={item} key={i} />
          ))}
        </p>
      );
    case "heading":
      switch (block.level) {
        case 1:
          return (
            <h1>
              {block.body.map((item, i) => (
                <TextBodyBlock body={item} key={i} />
              ))}
            </h1>
          );
        case 2:
          return (
            <h2>
              {block.body.map((item, i) => (
                <TextBodyBlock body={item} key={i} />
              ))}
            </h2>
          );
        case 3:
          return (
            <h3>
              {block.body.map((item, i) => (
                <TextBodyBlock body={item} key={i} />
              ))}
            </h3>
          );
        case 4:
          return (
            <h4>
              {block.body.map((item, i) => (
                <TextBodyBlock body={item} key={i} />
              ))}
            </h4>
          );
        case 5:
          return (
            <h5>
              {block.body.map((item, i) => (
                <TextBodyBlock body={item} key={i} />
              ))}
            </h5>
          );
        case 6:
          return (
            <h6>
              {block.body.map((item, i) => (
                <TextBodyBlock body={item} key={i} />
              ))}
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
          <img src={block.url} alt={block.altText} />
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      );
    default:
      return null;
  }
};

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
        <a href={body.url}>
          {body.body.map((item, i) => (
            <TextBodyBlock body={item} key={i} />
          ))}
        </a>
      );
  }
};
