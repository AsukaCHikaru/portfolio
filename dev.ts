const PORT = 3000;
const ENTRY_POINT = "./src/index.tsx";

Bun.serve({
  port: PORT,
  async fetch(req: Request) {
    const url = new URL(req.url);
    const path = url.pathname;

    switch (path) {
      case "/":
      case "/blog":
      case "/about":
      case "/index.html":
        return new Response(await Bun.file("./index.html").text(), {
          headers: {
            "Content-Type": "text/html",
          },
        });
      case "/main.js":
        const result = await Bun.build({
          entrypoints: [ENTRY_POINT],
          outdir: "node_modules/.tmp",
          target: "browser",
          minify: false,
          sourcemap: "inline",
        });

        const output = result.outputs[0];
        return new Response(await output.text(), {
          headers: {
            "Content-Type": "application/javascript",
          },
        });
      default:
        if (/\/blog\/\w+/.test(path)) {
          return new Response(await Bun.file("./index.html").text(), {
          headers: {
            "Content-Type": "text/html",
          },
        });
        }

        try {
          const filePath = "." + path;
          const file = Bun.file(filePath);
          if (await file.exists()) {
            return new Response(file);
          }
        } catch (e) {
          // File doesn't exist or other error, continue to 404
        }
    
        return new Response("Not Found", { status: 404 });

    }
  },
  error(error: Error) {
    return new Response(`<pre>Error: ${error}\n${error.stack}</pre>`, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  },
});

console.log(`🚀 Development server running at http://localhost:${PORT}`);
