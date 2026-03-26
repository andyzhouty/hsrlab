function FutureDate() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-800 rounded-lg shadow p-6">
      {/* 标题栏：置顶居中 */}
      <div className="flex-shrink-0 text-center">
        <h2 className="text-2xl font-bold text-gray-100">未来日期</h2>
      </div>

      {/* 两栏均等布局，填充剩余高度 */}
      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* 左侧：版本信息 */}
        <div className="flex flex-col h-full bg-gray-700/30 rounded-xl p-5 border border-gray-600/50">
          <h3 className="text-xl font-semibold text-gray-100 border-b border-gray-600 pb-2 mb-4">
            版本信息
          </h3>
          <div className="flex-grow text-gray-300">
            待施工
          </div>
        </div>

        {/* 右侧：深渊信息 */}
        <div className="flex flex-col h-full bg-gray-700/30 rounded-xl p-5 border border-gray-600/50">
          <h3 className="text-xl font-semibold text-gray-100 border-b border-gray-600 pb-2 mb-4">
            深渊信息
          </h3>
          <div className="flex-grow text-gray-300">
            待施工
          </div>
        </div>
      </div>
    </div>
  );
};

export default FutureDate;