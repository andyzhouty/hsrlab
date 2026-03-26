/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <explanation> */
export default function Sidebar({ open, setPage, close }: any) {
  return (
    <>
      {/* 遮罩 */}
      {open && (
        // biome-ignore lint/a11y/noStaticElementInteractions: <explanation>
        <div 
          className="fixed inset-0 bg-black/30 z-40"
          onClick={close}
        />
      )}

      {/* 侧边栏 */}
      <div className={`
        fixed top-0 left-0 h-full w-64 z-50
        bg-white dark:bg-gray-800 shadow-lg
        transform ${open ? "translate-x-0" : "-translate-x-full"}
        transition-transform duration-300
      `}>
        <div className="p-6 space-y-4">

          <h2 className="text-lg font-bold mb-4">目录</h2>
          <button type="button"
            className="block w-full text-left p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => { setPage("formula"); close() }}
          >
            公式
          </button>

          <button type="button"
            className="block w-full text-left p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => { setPage("countdown"); close() }}
          >
            倒计时
          </button>

          <button type="button"
            className="block w-full text-left p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => { setPage("links"); close() }}
          >
            测试服友站链接
          </button>

        </div>
      </div>
    </>
  )
}