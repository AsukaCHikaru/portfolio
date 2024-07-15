import type { Server } from "bun";
import { watch } from "fs";
import { resolve } from "path";
import { getBlogList, getBlogPost } from "./markdownApi";

const PORT = 3000;

const html = Bun.file("./index.html");
await Bun.write("build/index.html", html);

const srcPath = resolve(import.meta.dir, "..", "src");

await Bun.build({
  entrypoints: ["./src/index.tsx"],
  outdir: "./build",
  naming: "main.js",
});

watch(srcPath, async (event, filename) => {
  await Bun.build({
    entrypoints: ["./src/index.tsx"],
    outdir: "./build",
    naming: "main.js",
  });
});

export const bootServer = (port: number, requestHandler: Server["fetch"]) => {
  const server = Bun.serve({
    port,
    fetch: requestHandler,
    development: true,
  });

  return server;
};

export const resolveWebFile = (request: Request) => {
  const requestPath = request.url.replace(
    /^https?:\/\/localhost:\d+(.+)$/,
    "$1",
  );
  if (requestPath.startsWith("/api")) {
    return fetch("http://localhost:3001" + requestPath);
  }
  if (requestPath === "/favicon.ico") {
    return new Response();
  }
  if (requestPath !== "/") {
    return new Response(
      Bun.file(resolve("build", requestPath.replace("/", ""))),
    );
  }
  return new Response(Bun.file("./index.html"));
};

export const resolveMarkdownFile: Server["fetch"] = (request: Request) => {
  const requestPath = request.url.replace(
    /^https?:\/\/localhost:\d+(.+)$/,
    "$1",
  );
  if (requestPath.startsWith("/api/blogList")) {
    return new Response(getBlogList());
  }
  if (requestPath.startsWith("/api/blog/")) {
    const postTitle = requestPath.replace(/\/api\/blog\/(.+)$/, "$1");
    return new Response(getBlogPost(postTitle));
  }
  throw new Error("invalid api path");
};
console.log(`Dev server listening on port`, PORT);
