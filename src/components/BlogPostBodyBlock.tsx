import type { FC } from "react";
import type { MarkdownBlock, TextBlock } from "../../types/markdown";

interface Props {
  block: MarkdownBlock;
}

export const PostBodyBlock: FC<Props> = ({ block }) => {
  return (
    <div>
      <BlockContent block={block} />
    </div>
  );
};

export const BlockContent: FC<Props> = ({ block }) => {
  switch (block.type) {
    case "paragraph":
      return (
        <>
          {block.children.map((child, i) => (
            <RichTextItem key={i} item={child} />
          ))}
        </>
      );

    case "image":
      if (/youtube\.com/.test(block.url) || /youtu\.be/.test(block.url)) {
        return <div>TODO: youtube block</div>;
      }
      return (
        <>
          <img
            src={"/images/" + block.url}
            alt={block.alt || ""}
            width={600}
            height={400}
          />
          {block.caption !== "#nullcaption" ? (
            <span>{block.caption}</span>
          ) : null}
        </>
      );

    case "heading":
      switch (block.depth) {
        case 1:
          return (
            <h2
              id={block.children
                .map((item) => item.text)
                .join("-")
                .replace(/\s/g, "-")}
            >
              {block.children.map((child, i) => (
                <RichTextItem key={i} item={child} />
              ))}
            </h2>
          );
        case 2:
          return (
            <h3
              id={block.children
                .map((item) => item.text)
                .join("-")
                .replace(/\s/g, "-")}
            >
              {block.children.map((child, i) => (
                <RichTextItem key={i} item={child} />
              ))}
            </h3>
          );
        case 3:
          return (
            <h4
              id={block.children
                .map((item) => item.text)
                .join("-")
                .replace(/\s/g, "-")}
            >
              {block.children.map((child, i) => (
                <RichTextItem key={i} item={child} />
              ))}
            </h4>
          );
        default:
          return null;
      }

    case "list":
      if (block.ordered) {
        return (
          <ol>
            {block.children.map((child, i) => (
              <li key={i}>
                {child.children.map((child) => (
                  <RichTextItem key={i} item={child} />
                ))}
              </li>
            ))}
          </ol>
        );
      } else {
        return (
          <ul>
            {block.children.map((child, i) => (
              <li key={i}>
                {child.children.map((child) => (
                  <RichTextItem key={i} item={child} />
                ))}
              </li>
            ))}
          </ul>
        );
      }

    case "code":
      return <div>TODO: code block</div>;

    case "quote":
      return <div>TODO: quote block</div>;

    case "thematicBreak":
      return <hr />;

    default:
      return null;
  }
};

interface RichTextItemProps {
  item: TextBlock;
}

export const RichTextItem: FC<RichTextItemProps> = ({ item }) => {
  switch (item.type) {
    case "plain":
      return <span>{item.text}</span>;

    case "link":
      return (
        <a href={item.url} rel="noreferrer noopener" target="_blank">
          {item.text}
        </a>
      );

    case "strong":
      return <strong>{item.text}</strong>;

    case "italic":
      return <span>{item.text}</span>;

    case "inlineCode":
      return <code>{item.text}</code>;

    // TODO: strikethrough (need remark GFM plugin) default: return <span>FIXME</span>;
  }
};
