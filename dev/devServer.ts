import type { Server } from "bun";
import { getBlogPostList, getBlogPost } from "./markdownApi";

export const bootServer = (port: number, requestHandler: Server["fetch"]) => {
  const server = Bun.serve({
    port,
    fetch: requestHandler,
    development: true,
  });

  return server;
};

export const resolveMarkdownFile: Server["fetch"] = (request: Request) => {
  const requestPath = request.url.replace(
    /^https?:\/\/localhost:\d+(.+)$/,
    "$1",
  );
  if (requestPath === "/api/blog") {
    const res = new Response(getBlogPostList());
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "GET");
    return res;
  }
  if (requestPath.startsWith("/api/blog/")) {
    const postTitle = requestPath.replace(/\/api\/blog\/(.+)$/, "$1");
    const res = new Response(JSON.stringify(getBlogPost(postTitle)));
    res.headers.set("Access-Control-Allow-Methods", "GET");
    res.headers.set("Access-Control-Allow-Origin", "*");
    return res;
  }
  throw new Error("invalid api path");
};
