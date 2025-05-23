import { PostPageContent } from "../../components/PostPageContent";

export const AboutPage = () => {
  const post = window.__STATIC_PROPS__.about;
  return <PostPageContent metadata={post.metadata} content={post.content} />;
};
