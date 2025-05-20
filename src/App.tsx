import type { Block } from "@asukawang/amp";
import type { PostMetaData } from "../tools/contentServices";
import { Router } from "./Router";

declare global {
  interface Window {
    __STATIC_PROPS__: {
      postList: PostMetaData[];
      post: { metadata: PostMetaData; content: Block[] };
    };
  }
}

export const App = () => (
  <div>
    <nav>
      <ul style={{ display: "flex", listStyle: "none", gap: "1rem" }}>
        <li>
          <a href="/">home</a>
        </li>
        <li>
          <a href="/blog">blog</a>
        </li>
        <li>
          <a href="/about">about</a>
        </li>
      </ul>
    </nav>
    <main>
      <Router />
    </main>
  </div>
);
