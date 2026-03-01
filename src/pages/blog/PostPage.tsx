import { PostPageContent } from "../../components/PostPageContent";
import { Helmet } from "../../components/Helmet";
import { useSiteData } from "../../components/SiteDataStore";
import type { BlogData } from "../../types";

export const PostPage = () => {
  const siteData = useSiteData<BlogData>();

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
