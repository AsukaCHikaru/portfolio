import { watch } from "fs";
import { resolve } from "path";

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

Bun.serve({
  port: PORT,
  fetch(request) {
    const requestPath = request.url;
    const filePath = requestPath.replace(
      /^https?:\/\/localhost:3000\/(.+)$/,
      "$1",
    );
    if (!filePath.startsWith("http")) {
      return new Response(Bun.file(resolve("build", filePath)));
    }
    return new Response(Bun.file("./index.html"));
  },
});

console.log(`Dev server listening on port`, PORT);
