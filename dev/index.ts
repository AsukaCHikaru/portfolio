import { bootServer, resolveMarkdownFile, resolveWebFile } from "./devServer";

const DEV_PORT = 3000;
const FILE_PORT = 3001;

const devServer = bootServer(DEV_PORT, resolveWebFile);
const fileServer = bootServer(FILE_PORT, resolveMarkdownFile);
