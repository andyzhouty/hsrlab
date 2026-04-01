import { useState } from "react";
// 引入路由核心组件
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.tsx";
import Sidebar from "./components/Sidebar.tsx";
import Home from "./pages/Home.tsx";
import Formula from "./pages/Formula.tsx";
import FutureDate from "./pages/FutureDate.tsx";
import Links from "./pages/Links.tsx";
import 'katex/dist/katex.min.css';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* 1. 整个应用用 Router 包裹 */}
      <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
        <Navbar toggleMenu={() => setMenuOpen(!menuOpen)} />

        <Sidebar
          open={menuOpen}
          close={() => setMenuOpen(false)}
          // 这里暂时移除旧的 setPage，后面会改 Sidebar
        />

        {/* 2. 用 Routes + Route 替换原有的页面判断逻辑 */}
        <main className="p-4">
          <Routes>
            {/* 定义路由：URL 地址 → 对应页面组件 */}
            <Route path="/" element={<Home />} />       {/* 首页 */}
            <Route path="/home" element={<Home />} />   {/* /home */}
            <Route path="/formula" element={<Formula />} />
            <Route path="/futuredate" element={<FutureDate />} />
            <Route path="/links" element={<Links />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

export default App;
