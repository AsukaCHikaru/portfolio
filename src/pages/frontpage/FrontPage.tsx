import { useContext, useMemo } from "react";
import { DataContext } from "../../components/DataContext";
import { PostPageContent } from "../../components/PostPageContent";

export const FrontPage = () => {
  const context = useContext(DataContext);
  const post = useMemo(
    () =>
      context.postList.sort(
        (a, b) =>
          new Date(b.metadata.publishedAt).getTime() -
          new Date(a.metadata.publishedAt).getTime(),
      )[0],
    [],
  );

  if (!post) {
    return null;
  }

  return <PostPageContent metadata={post.metadata} content={post.content} />;
};
