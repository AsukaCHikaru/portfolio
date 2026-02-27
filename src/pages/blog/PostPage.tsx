import { PostPageContent } from "../../components/PostPageContent";
import { Helmet } from "../../components/Helmet";
import { useSiteData } from "../../hooks/useSiteData";

export const PostPage = () => {
  const siteData = useSiteData("blog");

  if (!siteData) {
    return null;
  }

  const { metadata, content } = siteData.data;

  return (
    <>
      <Helmet title={metadata.title} description={metadata.description} />
      <PostPageContent metadata={metadata} content={content} />
    </>
  );
};
