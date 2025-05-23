import { PostPageContent } from "../../components/PostPageContent";

export const FrontPage = () => {
  const post = window.__STATIC_PROPS__.post;
  return <PostPageContent metadata={post.metadata} content={post.content} />;
};
