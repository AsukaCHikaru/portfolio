import { useContext, useMemo } from "react";
import { PostPageContent } from "../../components/PostPageContent";
import { DataContext } from "../../components/DataContext";
import { Helmet } from "../../components/Helmet";

export const PostPage = () => {
  const context = useContext(DataContext);

  const post = useMemo(() => {
    const pathname = window.location.pathname.replace("/blog/", "");
    const staticProp = window.__STATIC_PROPS__;
    if (staticProp.blog?.post?.metadata.pathname === pathname) {
      return staticProp.blog.post;
    }
    return context.postList.find((post) => post.metadata.pathname === pathname);
  }, []);

  if (!post) {
    return null;
  }

  return (
    <>
      <Helmet
        title={post.metadata.title}
        description={post.metadata.description}
      />
      <PostPageContent metadata={post.metadata} content={post.content} />
    </>
  );
};
