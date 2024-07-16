import { bootServer, resolveMarkdownFile, resolveWebFile } from "./devServer";

const FILE_PORT = 3001;

bootServer(FILE_PORT, resolveMarkdownFile);

Bun.spawn(["vite"], { stdout: "inherit" });
