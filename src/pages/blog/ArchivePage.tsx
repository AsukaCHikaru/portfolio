import type { PostMetaData } from "../../../tools/contentServices";
import { Link } from "../../components/Link";

interface Props {
  postList: PostMetaData[];
}

export const ArchivePage = ({ postList }: Props) => {
  return (
    <div>
      {postList.map((post) => (
        <Link key={post.pathname} to={`/blog/${post.pathname}`}>
          <h2>{post.title}</h2>
          <p>{post.description}</p>
          <p>Published on: {post.publishedAt}</p>
          <p>Category: {post.category}</p>
          <p>Topic: {post.topic}</p>
        </Link>
      ))}
    </div>
  );
};
