import React from 'react';

interface VersionInfo {
  version: string;
  date: Date;
}

interface EventItem {
  date: Date | { start: Date; end: Date };
  description: string;
  sortKey: Date; // 用于排序
}

const FutureDate: React.FC = () => {
  // 获取东八区当前日期（只取日期，忽略时间）
  const getCurrentShanghaiDate = (): Date => {
    const now = new Date();
    const shanghaiTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Shanghai' }));
    // 返回日期部分（年月日，时分秒归零）
    return new Date(shanghaiTime.getFullYear(), shanghaiTime.getMonth(), shanghaiTime.getDate());
  };

  // 生成从 4.2 到 4.7 的版本开门日期
  const generateVersionDates = (): VersionInfo[] => {
    const startDate = new Date(2026, 3, 22); // 2026-04-22
    const startMajor = 4;
    const startMinor = 2;
    const versionCount = 6; // 4.2 ~ 4.7
    const intervalDays = 42;

    const versions: VersionInfo[] = [];
    for (let i = 0; i < versionCount; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i * intervalDays);
      versions.push({
        version: `${startMajor}.${startMinor + i}`,
        date,
      });
    }
    return versions;
  };

  // 获取某个日期所在周的周二和周三
  const getTuesdayAndWednesday = (date: Date): { tuesday: Date; wednesday: Date } => {
    const dayOfWeek = date.getDay(); // 0 = 周日, 1 = 周一, ..., 6 = 周六
    // 计算本周一
    const monday = new Date(date);
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // 周日时周一为-6天
    monday.setDate(date.getDate() + diffToMonday);

    const tuesday = new Date(monday);
    tuesday.setDate(monday.getDate() + 1);
    const wednesday = new Date(monday);
    wednesday.setDate(monday.getDate() + 2);
    return { tuesday, wednesday };
  };

  // 格式化单个日期为 "YYYY.M.D"
  const formatSingleDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}/${month}/${day}`;
  };

  // 格式化事件日期
  // 单日: "2026.4.22"
  // 双日: "2026.4.7 & 4.8"
  const formatEventDate = (date: Date | { start: Date; end: Date }): string => {
    if (date instanceof Date) {
      return formatSingleDate(date);
    } else {
      const startYear = date.start.getFullYear();
      const startMonth = date.start.getMonth() + 1;
      const startDay = date.start.getDate();
      const endMonth = date.end.getMonth() + 1;
      const endDay = date.end.getDate();
      return `${startYear}/${startMonth}/${startDay} & ${endMonth}/${endDay}`;
    }
  };

  // 判断事件是否已过（完全过去）
  // 单日事件：如果当前日期 > 事件日期，则已过
  // 双日事件：如果当前日期 > 结束日期，则已过
  const isEventPast = (event: EventItem, currentDate: Date): boolean => {
    const eventDate = event.date;
    if (eventDate instanceof Date) {
      // 只比较日期部分
      const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
      return currentDate > eventDateOnly;
    } else {
      // 双日事件，比较结束日期（第二天）
      const endDateOnly = new Date(eventDate.end.getFullYear(), eventDate.end.getMonth(), eventDate.end.getDate());
      return currentDate > endDateOnly;
    }
  };

  // 生成所有事件（版本开门、前瞻、测试服、角色立绘）
  const generateAllEvents = (): EventItem[] => {
    const versions = generateVersionDates();
    const events: EventItem[] = [];

    for (let i = 0; i < versions.length; i++) {
      const { version, date: openDate } = versions[i];
      const nextVersion = `4.${2 + i + 1}`; // 下一个版本号，用于测试服和角色立绘

      // 1. 版本开门
      events.push({
        date: openDate,
        description: `${version}版本开门`,
        sortKey: openDate,
      });

      // 2. 前瞻特别节目（开门前12天）
      const previewDate = new Date(openDate);
      previewDate.setDate(openDate.getDate() - 12);
      events.push({
        date: previewDate,
        description: `${version}前瞻特别节目`,
        sortKey: previewDate,
      });

      // 3. 测试服开启（开门前一天，对应下一个版本）
      const testDate = new Date(openDate);
      testDate.setDate(openDate.getDate() - 1);
      events.push({
        date: testDate,
        description: `${nextVersion}测试服开启`,
        sortKey: testDate,
      });

      // 4. 角色立绘（前瞻所在周的周二和周三，对应下一个版本）
      const { tuesday, wednesday } = getTuesdayAndWednesday(previewDate);
      events.push({
        date: { start: tuesday, end: wednesday },
        description: `${nextVersion}角色立绘`,
        sortKey: tuesday,
      });
    }

    // 按日期排序
    events.sort((a, b) => {
      const aKey = a.sortKey instanceof Date ? a.sortKey.getTime() : a.sortKey.getTime();
      const bKey = b.sortKey instanceof Date ? b.sortKey.getTime() : b.sortKey.getTime();
      return aKey - bKey;
    });

    return events;
  };

  const allEventsRaw = generateAllEvents();
  const currentDate = getCurrentShanghaiDate();

  // 过滤掉已经过去的事件
  const activeEvents = allEventsRaw.filter(event => !isEventPast(event, currentDate));

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
          <div className="flex-grow text-gray-300 overflow-y-auto text-lg" id="version-info">
            {activeEvents.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400 italic">
                暂无未来事件
              </div>
            ) : (
              <ul className="space-y-3">
                {activeEvents.map((event, idx) => (
                  <li key={idx} className="flex items-baseline">
                    {/* 固定宽度，确保描述文字左对齐 */}
                    <span className="font-mono text-amber-300 w-48 flex-shrink-0 font-medium">
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
          <div className="flex-grow text-gray-300" id="challenges-info">
            <div className="flex items-center justify-center h-full text-gray-400 italic">
              待施工
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FutureDate;
