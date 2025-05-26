import { useContext } from "react";
import { DataContext } from "../../components/DataContext";
import { PostPageContent } from "../../components/PostPageContent";

export const FrontPage = () => {
  const context = useContext(DataContext);
  const post =
    window.__STATIC_PROPS__.post ||
    context.postList.find(
      (post) =>
        post.metadata.pathname === window.location.pathname.split("/").pop(),
    );

  if (!post) {
    return null;
  }

  return <PostPageContent metadata={post.metadata} content={post.content} />;
};
