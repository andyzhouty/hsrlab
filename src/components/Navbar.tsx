export default function Navbar({ toggleMenu }: { toggleMenu: () => void }) {
  return (
    <div
      className="flex items-center px-4 h-14 
      bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50"
    >
      {/* 左侧 */}
      <button
        type="button"
        onClick={toggleMenu}
        className="text-xl p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        ☰
      </button>

      {/* 标题 */}
      <div className="justify-center items-center">
        <h1 className="text-lg font-semibold tracking-wide">HSRLab</h1>
      </div>
    </div>
  );
}
