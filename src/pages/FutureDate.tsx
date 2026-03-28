import React from 'react';
import {
  generateVersionDates,
  getCurrentShanghaiDate,
  formatEventDate,
  isEventPast,
  generateAllEvents,
  generateEndgameDates,
  attachVersionToEndgames,
  getEndgamesForVersions,
  formatSingleDate,
} from '../utils/DateFunctions';

const FutureDate: React.FC = () => {
  // 1. 获取所有版本开门日期 (4.0 ~ 4.8)
  const allVersions = generateVersionDates();
  const currentDate = getCurrentShanghaiDate();

  // 2. 左侧事件：版本相关事件
  const allEvents = generateAllEvents(allVersions);
  const activeEvents = allEvents.filter(event => !isEventPast(event, currentDate));

  // 3. 右侧深渊：展示 4.0 ~ 4.8 所有版本的深渊
  const versionsToShow = allVersions; // 已经是 4.0 ~ 4.8

  // 获取所有深渊事件并关联版本
  const allEndgamesRaw = generateEndgameDates();
  const allEndgames = attachVersionToEndgames(allEndgamesRaw, allVersions);
  // 筛选出要展示的深渊（4.0 ~ 4.8）
  const displayEndgames = getEndgamesForVersions(versionsToShow, allEndgames);

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
            版本日期
          </h3>
          <div className="flex-grow text-gray-300 overflow-y-auto" id="version-info">
            {activeEvents.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400 italic">
                暂无未来事件
              </div>
            ) : (
              <ul className="space-y-3">
                {activeEvents.map((event) => (
                  <li key={`${event.date}-${event.description}`} className="flex items-baseline text-lg">
                    <span className="font-mono text-amber-300 w-48 flex-shrink-0">
                      {formatEventDate(event.date)}
                    </span>
                    <span className="text-gray-200">{event.description}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* 右侧：深渊信息 */}
        <div className="flex flex-col h-full bg-gray-700/30 rounded-xl p-5 border border-gray-600/50">
          <h3 className="text-xl font-semibold text-gray-100 border-b border-gray-600 pb-2 mb-4">
            深渊日期
          </h3>
          <div className="flex-grow text-gray-300 overflow-y-auto" id="challenges-info">
            {displayEndgames.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400 italic">
                暂无深渊信息
              </div>
            ) : (
              <ul className="space-y-3">
                {displayEndgames.map((endgame) => (
                  <li key={`${endgame.date}-${endgame.version}-${endgame.name}`} className="flex items-baseline text-lg">
                    <span className="font-mono text-amber-300 w-48 flex-shrink-0">
                      {formatSingleDate(endgame.date)}
                    </span>
                    <span className="text-gray-200">
                      {endgame.version} {endgame.name}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FutureDate;