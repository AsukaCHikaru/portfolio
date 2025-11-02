import { build } from "./build";
import { watch } from "fs/promises";
import { type ServerWebSocket } from "bun";

const PORT = 3000;
const WS_PORT = 3001;

process.env.PHASE = "dev";

const startHttpServer = async () => {
  try {
    Bun.serve({
      port: PORT,
      async fetch(req: Request) {
        const url = new URL(req.url);
        const path = url.pathname;
        switch (path) {
          case "/": {
            const file = Bun.file("./dist/index.html");
            return new Response(file);
          }
          case "/blog": {
            const file = Bun.file("./dist/blog/index.html");
            return new Response(file);
          }
          case "/about": {
            const file = Bun.file("./dist/about/index.html");
            return new Response(file);
          }
          case "/resume/":
          case "/resume": {
            const resumeFile = Bun.file("./dist/resume/index.html");
            return new Response(resumeFile);
          }
          default:
            if (/^\/blog\/\w+/.test(path)) {
              const file = Bun.file(`./dist${path}/index.html`);
              return new Response(file);
            }

            try {
              const filePath = "./dist" + path;
              const file = Bun.file(filePath);
              if (await file.exists()) {
                return new Response(file);
              }
            } catch (_) {
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
  } catch (err) {
    console.error("Error starting server:", err);
  }
};

const wsClients = new Set<ServerWebSocket<unknown>>();

const notifyClientsToReload = () => {
  console.log(`Notifying ${wsClients.size} clients to reload`);
  for (const client of wsClients) {
    client.send(JSON.stringify({ type: "reload" }));
  }
};

const startWsServer = async () => {
  try {
    Bun.serve({
      port: WS_PORT,
      fetch(req, server) {
        if (server.upgrade(req)) {
          return;
        }
        return new Response("Upgrade failed", { status: 400 });
      },
      websocket: {
        open(ws) {
          wsClients.add(ws);
          console.log("WebSocket client connected");
        },
        close(ws) {
          wsClients.delete(ws);
          console.log("WebSocket client disconnected");
        },
        message() {
          // We don't need to handle client messages
        },
      },
    });

    console.log(
      `🔥 Hot reload WebSocket server running at ws://localhost:${WS_PORT}`,
    );
  } catch (err) {
    console.error("Error starting WebSocket server:", err);
  }
};

const watchSrcChange = async () => {
  const watcher = watch("./src", {
    recursive: true,
  });

  while (true) {
    for await (const event of watcher) {
      if (event.eventType === "change") {
        console.log("File changed:", event.filename);
        await build();
        notifyClientsToReload();
      }
    }
  }
};

const watchContentChange = async () => {
  const watcher = watch("./public", {
    recursive: true,
  });

  while (true) {
    for await (const event of watcher) {
      if (event.eventType === "change") {
        console.log("Content changed:", event.filename);
        await build();
        notifyClientsToReload();
      }
    }
  }
};

const start = async () => {
  await startWsServer();
  await startHttpServer();

  watchSrcChange();
  watchContentChange();
};

start();
