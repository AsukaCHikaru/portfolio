import { useContext } from "react";
import { DataContext } from "../../components/DataContext";
import { PostPageContent } from "../../components/PostPageContent";

export const AboutPage = () => {
  const context = useContext(DataContext);
  const post = window.__STATIC_PROPS__.about || context.about;

  if (!post) {
    return null;
  }

  return <PostPageContent metadata={post.metadata} content={post.content} />;
};
