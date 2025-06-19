import { getBlogPostList } from "./contentServices";

const generateRssFeed = ({
  siteData,
  feedData,
}: {
  siteData: string;
  feedData: string;
}) => {
  return `<rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
<channel>
${siteData}
${feedData}
</channel>
</rss>`;
};

const generateSiteData = ({
  title,
  link,
  description,
  language,
  lastBuildDate,
}: {
  title: string;
  link: string;
  description: string;
  language: string;
  lastBuildDate: string;
}) => `<title>${title}</title>
<link>${link}</link>
<description>${description}</description>
<language>${language}</language>
<lastBuildDate>${lastBuildDate}</lastBuildDate>`;

const generateFeedData = async () => {
  const blogPostList = await getBlogPostList();
  return blogPostList
    .map(
      (blog) => `<item>
<title>${blog.metadata.title}</title>
<link>https://asukawang.com/blog/${blog.metadata.pathname}</link>${
        blog.metadata.description
          ? `<description>${blog.metadata.description}</description>`
          : ""
      }
<pubDate>${new Date(blog.metadata.publishedAt).toUTCString()}</pubDate>
<guid>https://asukawang.com/blog/${blog.metadata.pathname}</guid></item>`,
    )
    .join("\n");
};

export const buildRssFeed = async () => {
  const feed = generateRssFeed({
    siteData: generateSiteData({
      title: "Asuka Wang",
      link: "https://asukawang.com",
      description: "Asuka Wang's blog",
      language: "en-US",
      lastBuildDate: new Date().toUTCString(),
    }),
    feedData: await generateFeedData(),
  });

  await Bun.write(`./dist/blog/feed.xml`, feed);
};
