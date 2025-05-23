import { PostPageContent } from "../../components/PostPageContent";

export const PostPage = () => {
  const post = window.__STATIC_PROPS__.post;
  return <PostPageContent metadata={post.metadata} content={post.content} />;
};
