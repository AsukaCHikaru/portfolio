import { PostPageContent } from "../blog/PostPage";

export const FrontPage = () => {
  const post = window.__STATIC_PROPS__.post;
  return <PostPageContent metadata={post.metadata} content={post.content} />;
};
