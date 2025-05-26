import { useContext } from "react";
import { PostPageContent } from "../../components/PostPageContent";
import { DataContext } from "../../components/DataContext";

export const PostPage = () => {
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
