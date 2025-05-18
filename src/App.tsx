import { Link } from "./components/Link";
import { Router } from "./Router";

export const App = () => (
  <div>
    <nav>
      <ul style={{ display: "flex", listStyle: "none", gap: "1rem" }}>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/blog">Blog</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
      </ul>
    </nav>
    <main>
      <Router />
    </main>
  </div>
);
