import React from "react";
import {
  generateVersionDates,
  getCurrentShanghaiDate,
  formatEventDate,
  isEventPast,
  generateAllEvents,
  generateEndgameDates,
  attachVersionToEndgames,
  generateAnomalyArbitration,
  formatSingleDate,
} from "../utils/DateFunctions";
import { ExternalLink } from "lucide-react";

const FutureDate: React.FC = () => {
  // 1. 获取所有版本开门日期 (4.0 ~ 4.8)
  const allVersions = generateVersionDates();
  const currentDate = getCurrentShanghaiDate();

  // 2. 左侧事件：版本相关事件
  const allEvents = generateAllEvents(allVersions);
  const activeEvents = allEvents.filter(
    (event) => !isEventPast(event, currentDate),
  );

  // 深渊数据
  const cycleEndgamesRaw = generateEndgameDates();
  const cycleEndgames = attachVersionToEndgames(cycleEndgamesRaw, allVersions);
  const anomalyEndgames = generateAnomalyArbitration(allVersions).filter(
    (endgame) => !isEventPast(endgame, currentDate),
  );
  const allEndgames = [...cycleEndgames, ...anomalyEndgames];

  // 显示版本范围：4.0 ~ 4.8
  const versionsToShow = allVersions;
  const displayEndgames = allEndgames
    .filter((event) => versionsToShow.some((v) => v.version === event.version))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  // 辅助：从版本号获取 x（整数部分）
  const getVersionNumber = (version: string): number => {
    const parts = version.split(".");
    return parseInt(parts[1], 10);
  };

  // 辅助：根据版本号和深渊类型生成链接
  const getEndgameLink = (version: string, name: string): string | null => {
    const x = getVersionNumber(version);
    if (x < 0 || x > 8) return null; // 安全边界
    switch (name) {
      case "混沌回忆":
        return `https://hsr.nanoka.cc/maze/${x + 1030}/`;
      case "虚构叙事":
        return `https://hsr.nanoka.cc/story/${x + 2021}/`;
      case "末日幻影":
        return `https://hsr.nanoka.cc/boss/${x + 3015}/`;
      case "异相仲裁":
        return `https://hsr.nanoka.cc/peak/${x + 4}/`;
      default:
        return null;
    }
  };

  // 辅助：判断某个版本的测试服是否已开启
  const isTestServerOpen = (version: string): boolean => {
    const versionInfo = allVersions.find((v) => v.version === version);
    if (!versionInfo) return false;
    const openDate = versionInfo.date;
    const testServerDate = new Date(openDate);
    testServerDate.setDate(openDate.getDate() - 43); // 测试服开启时间
    // 只比较日期部分
    const testDateOnly = new Date(
      testServerDate.getFullYear(),
      testServerDate.getMonth(),
      testServerDate.getDate(),
    );
    const currentDateOnly = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
    );
    return currentDateOnly >= testDateOnly;
  };

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
          <div
            className="flex-grow text-gray-300 overflow-y-auto"
            id="version-info"
          >
            {activeEvents.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400 italic">
                暂无未来事件
              </div>
            ) : (
              <ul className="space-y-3">
                {activeEvents.map((event) => (
                  <li
                    key={`${formatEventDate(event.date)}-${event.description}`}
                    className="flex items-baseline md:text-lg"
                  >
                    <span className="font-mono text-amber-300 w-36 max-sm:w-32 md:w-40 flex-shrink-0">
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
          <div
            className="flex-grow text-gray-300 overflow-y-auto md:text-lg"
            id="challenges-info"
          >
            {displayEndgames.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400 italic">
                暂无深渊信息
              </div>
            ) : (
              <ul className="space-y-3">
                {displayEndgames.map((endgame) => {
                  const link = getEndgameLink(endgame.version, endgame.name);
                  const testOpen = isTestServerOpen(endgame.version);
                  const showLink = link && testOpen;

                  return (
                    <li
                      key={`${endgame.version}-${endgame.name}-${formatSingleDate(endgame.date)}`}
                      className="flex items-baseline md:text-lg"
                    >
                      <span className="font-mono text-amber-300 max-sm:w-32 w-36 flex-shrink-0">
                        {formatSingleDate(endgame.date)}
                      </span>
                      <span className="text-gray-200">
                        {endgame.version} {endgame.name}
                        {showLink && (
                          <>
                            {" "}
                            <span className="text-cyan-400">
                              <a
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-inherit no-underline inline-flex items-center"
                                aria-label="跳转到详情页面"
                              >
                                <ExternalLink className="ml-1 w-4 h-4" />
                              </a>
                            </span>
                          </>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FutureDate;
