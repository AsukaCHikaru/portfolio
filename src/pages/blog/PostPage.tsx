import { PostPageContent } from "../../components/PostPageContent";
import { Helmet } from "../../components/Helmet";
import { useSiteData } from "../../components/SiteDataStore";
import type { BlogData } from "../../types";

export const PostPage = () => {
  const path = window.location.pathname.replace(/\/$/, "");
  const siteData = useSiteData<BlogData>(path);

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
