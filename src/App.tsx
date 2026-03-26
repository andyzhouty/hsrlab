import { useState } from "react";
import Navbar from "./components/Navbar.tsx";
import Sidebar from "./components/Sidebar.tsx";
import Home from "./pages/Home.tsx";
import Formula from "./pages/Formula.tsx";
import Countdown from "./pages/Countdown.tsx";
import Links from "./pages/Links.tsx";
import 'katex/dist/katex.min.css';

type Page = "home" | "formula" | "countdown" | "links";

function App() {
  const [page, setPage] = useState<Page>("home");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <Navbar toggleMenu={() => setMenuOpen(!menuOpen)} />

      <Sidebar
        open={menuOpen}
        setPage={setPage}
        close={() => setMenuOpen(false)}
      />

      <main className="p-4">
        {page === "home" && <Home />}
        {page === "formula" && <Formula />}
        {page === "countdown" && <Countdown />}
        {page === "links" && <Links />}
      </main>
    </div>
  );
}

export default App;
