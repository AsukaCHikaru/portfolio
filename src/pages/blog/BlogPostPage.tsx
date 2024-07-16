import { useParams } from "@tanstack/react-router";
import { useApi } from "../../services/apiCore";
import { getBlogPost } from "../../services/markdownService";
import { PostBodyBlock } from "../../components/BlogPostBodyBlock";

export const BlogPostPage = () => {
  const { postPath } = useParams({ from: "/blog/$postPath" });
  const data = useApi({
    queryFn: () => getBlogPost(postPath),
  });

  return (
    <div>{data?.content.map((block) => <PostBodyBlock block={block} />)}</div>
  );
};
