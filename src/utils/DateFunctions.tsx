// 版本与事件相关的工具函数和类型定义

export interface VersionInfo {
  version: string;
  date: Date;
}

export interface EventItem {
  date: Date | { start: Date; end: Date };
  description: string;
  sortKey: Date;
}

/**
 * 生成从 4.0 到 4.8 的版本开门日期（42 天间隔）
 * 4.2 开门日期已知为 2026-04-22，由此推算其他版本
 */
export const generateVersionDates = (): VersionInfo[] => {
  // 4.2 开门日期
  const baseDate = new Date(2026, 3, 22); // 2026-04-22
  const major = 4;
  const minorStart = 2;
  // 需要版本范围：4.0 ~ 4.8
  const minMinor = 0;
  const maxMinor = 8;

  const versions: VersionInfo[] = [];

  for (let minor = minMinor; minor <= maxMinor; minor++) {
    const offset = minor - minorStart;
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + offset * 42);
    versions.push({
      version: `${major}.${minor}`,
      date,
    });
  }

  return versions;
};

/**
 * 获取东八区当前日期（只取日期部分，时间归零）
 */
export const getCurrentShanghaiDate = (): Date => {
  const now = new Date();
  const shanghaiTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Shanghai' }));
  return new Date(shanghaiTime.getFullYear(), shanghaiTime.getMonth(), shanghaiTime.getDate());
};

/**
 * 根据当前日期，获取当前所在的版本
 * @param versions 版本列表（已排序）
 * @param currentDate 当前日期
 * @returns 当前版本信息，若日期在最后一个版本之后则返回最后一个版本
 */
export const getCurrentVersion = (versions: VersionInfo[], currentDate: Date): VersionInfo => {
  let currentVersion = versions[0];
  for (let i = 0; i < versions.length; i++) {
    const version = versions[i];
    if (version.date <= currentDate) {
      currentVersion = version;
    } else {
      break;
    }
  }
  return currentVersion;
};

/**
 * 获取某个日期所在周的周二和周三
 */
export const getTuesdayAndWednesday = (date: Date): { tuesday: Date; wednesday: Date } => {
  const dayOfWeek = date.getDay(); // 0 = 周日, 1 = 周一, ..., 6 = 周六
  const monday = new Date(date);
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  monday.setDate(date.getDate() + diffToMonday);

  const tuesday = new Date(monday);
  tuesday.setDate(monday.getDate() + 1);
  const wednesday = new Date(monday);
  wednesday.setDate(monday.getDate() + 2);
  return { tuesday, wednesday };
};

/**
 * 格式化单个日期为 "YYYY/M/D"
 */
export const formatSingleDate = (date: Date): string => {
  const year = date.getFullYear() % 100;
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}/${month}/${day}`;
};

/**
 * 格式化双日事件日期为 "YYYY/M/D & M/D"
 */
export const formatDoubleDate = (start: Date, end: Date): string => {
  const startYear = start.getFullYear() % 100;
  const startMonth = start.getMonth() + 1;
  const startDay = start.getDate();
  const endMonth = end.getMonth() + 1;
  const endDay = end.getDate();
  return `${startYear}/${startMonth}/${startDay} & ${endMonth}/${endDay}`;
};

/**
 * 格式化事件日期（单日或双日）
 */
export const formatEventDate = (date: Date | { start: Date; end: Date }): string => {
  if (date instanceof Date) {
    return formatSingleDate(date);
  } else {
    return formatDoubleDate(date.start, date.end);
  }
};

/**
 * 判断事件是否已过（完全过去）
 * 单日事件：当前日期 > 事件日期
 * 双日事件：当前日期 > 结束日期
 */
export const isEventPast = (event: EventItem, currentDate: Date): boolean => {
  const eventDate = event.date;
  if (eventDate instanceof Date) {
    const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
    return currentDate > eventDateOnly;
  } else {
    const endDateOnly = new Date(eventDate.end.getFullYear(), eventDate.end.getMonth(), eventDate.end.getDate());
    return currentDate > endDateOnly;
  }
};

/**
 * 生成所有版本相关事件（版本开门、前瞻、测试服、角色立绘）
 * 注意：4.8 版本不生成测试服和角色立绘事件（因为不存在 4.9）
 */
export const generateAllEvents = (versions: VersionInfo[]): EventItem[] => {
  const events: EventItem[] = [];

  for (let i = 0; i < versions.length; i++) {
    const { version, date: openDate } = versions[i];
    const versionMinor = parseInt(version.split('.')[1]);

    // 1. 版本开门
    events.push({
      date: openDate,
      description: `${version} 版本开门`,
      sortKey: openDate,
    });

    // 2. 前瞻特别节目（开门前12天）
    const previewDate = new Date(openDate);
    previewDate.setDate(openDate.getDate() - 12);
    events.push({
      date: previewDate,
      description: `${version} 前瞻特别节目`,
      sortKey: previewDate,
    });

    // 3. 测试服开启（开门前一天，对应下一个版本）
    // 仅当不是最后一个版本（4.8）时生成
    if (versionMinor < 8) {
      const nextVersion = `${4}.${versionMinor + 1}`;
      const testDate = new Date(openDate);
      testDate.setDate(openDate.getDate() - 1);
      events.push({
        date: testDate,
        description: `${nextVersion} 测试服开启`,
        sortKey: testDate,
      });
    }

    // 4. 角色立绘（前瞻所在周的周二和周三，对应下一个版本）
    // 仅当不是最后一个版本（4.8）时生成
    if (versionMinor < 8) {
      const nextVersion = `${4}.${versionMinor + 1}`;
      const { tuesday, wednesday } = getTuesdayAndWednesday(previewDate);
      events.push({
        date: { start: tuesday, end: wednesday },
        description: `${nextVersion} 角色立绘`,
        sortKey: tuesday,
      });
    }
  }

  // 按日期排序
  events.sort((a, b) => {
    return a.sortKey.getTime() - b.sortKey.getTime();
  });

  return events;
};

// ========== 深渊相关类型和函数 ==========

export type EndgameType = '虚构叙事' | '混沌回忆' | '末日幻影';

export interface EndgameEvent {
  date: Date;
  name: EndgameType;
  version: string; // 所属版本
}

/**
 * 获取深渊开始日期列表（从4.1虚构叙事开始推算）
 * 已知：4.1版本的虚构叙事开始于 2026-03-30
 * 顺序：虚构 -> 混沌 -> 末日，每隔14天交替
 */
export const generateEndgameDates = (): EndgameEvent[] => {
  const baseDate = new Date(2026, 2, 30); // 2026-03-30
  const maxDate = new Date(2027, 0, 1);   // 生成到 2027 年初，足够覆盖 4.8 版本
  const endgames: EndgameEvent[] = [];

  const currentDate = baseDate;
  let cycle = 0; // 0:虚构, 1:混沌, 2:末日

  while (currentDate < maxDate) {
    let name: EndgameType;
    if (cycle === 0) name = '虚构叙事';
    else if (cycle === 1) name = '混沌回忆';
    else name = '末日幻影';

    endgames.push({
      date: new Date(currentDate),
      name,
      version: '', // 暂时留空，之后通过版本列表填充
    });

    currentDate.setDate(currentDate.getDate() + 14);
    cycle = (cycle + 1) % 3;
  }

  return endgames;
};

/**
 * 将深渊事件关联到版本
 * @param endgames 深渊事件列表（未关联版本）
 * @param versions 版本列表（按时间排序）
 * @returns 带有版本号的深渊事件列表
 */
export const attachVersionToEndgames = (endgames: EndgameEvent[], versions: VersionInfo[]): EndgameEvent[] => {
  return endgames.map(event => {
    for (let i = 0; i < versions.length; i++) {
      const version = versions[i];
      const nextVersion = versions[i + 1];
      if (!nextVersion) {
        if (event.date >= version.date) {
          return { ...event, version: version.version };
        }
      } else {
        if (event.date >= version.date && event.date < nextVersion.date) {
          return { ...event, version: version.version };
        }
      }
    }
    return event;
  });
};

/**
 * 获取指定版本列表中的深渊事件（按日期排序）
 * @param versions 要展示的版本列表
 * @param allEndgames 所有深渊事件（已关联版本）
 * @returns 筛选后的深渊事件，按日期排序
 */
export const getEndgamesForVersions = (versions: VersionInfo[], allEndgames: EndgameEvent[]): EndgameEvent[] => {
  const versionNumbers = new Set(versions.map(v => v.version));
  return allEndgames
    .filter(event => versionNumbers.has(event.version))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
};