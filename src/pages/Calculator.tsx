import { useState } from "react";

// 浮点数输入（效果命中专用）
function FloatInput({
  label,
  name,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex-1 min-w-[110px]">
      <label htmlFor={name} className="block text-gray-300 text-sm mb-1">
        {label}
      </label>
      <input
        id={name}
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

// 可复用数字输入框组件（支持浮点数 - 速度专用）
function SpeedInput({
  label,
  name,
  value,
  onChange,
  placeholder = "请输入",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex-1 min-w-[120px]">
      <label htmlFor={name} className="block text-gray-300 text-sm mb-1">
        {label}
      </label>
      <input
        id={name}
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

// 可复用整数输入框组件（行动值计算器专用）
function IntegerInput({
  label,
  name,
  value,
  onChange,
  placeholder = "请输入",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex-1 min-w-[110px]">
      <label htmlFor={name} className="block text-gray-300 text-sm mb-1">
        {label}
      </label>
      <input
        id={name}
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

export default function Calculator() {
  // ========== 阿哈速度计算器 状态 ==========
  const [speeds, setSpeeds] = useState({ v1: "", v2: "", v3: "", v4: "" });

  // ========== 行动值最低速度计算器 状态 ==========
  const [params, setParams] = useState({
    av: "", // 行动值 (整数)
    t: "", // 动数 (整数)
    s: "", // 舞舞舞叠影数 (整数)
    dddTimes: "", // 舞舞舞次数 (整数)
    windSetTimes: "", // 风套触发次数 (整数)
  });
  const atoi = (str: string) => parseInt(str, 10) || 0;
  const atof = (str: string) => parseFloat(str) || 0;

  // ========== 阿哈速度 - 计算逻辑 ==========
  const calculateAhaSpeed = () => {
    const sortedSpeeds = [speeds.v1, speeds.v2, speeds.v3, speeds.v4]
      .map(atof)
      .sort((a, b) => b - a);
    const multipliers = [0.2, 0.1, 0.05, 0.02];
    return (
      80 +
      sortedSpeeds.reduce(
        (sum, speed, index) => sum + speed * multipliers[index],
        0,
      )
    );
  };
  const [isVonwacqEnabled, setIsVonwacqEnabled] = useState(false);
  // ========== 最低速度 - 计算逻辑 ==========
  const calculateMinSpeed = () => {
    const av = atoi(params.av);
    const t = atoi(params.t);
    const s = atoi(params.s);
    const dddTimes = atoi(params.dddTimes);
    const windSetTimes = atoi(params.windSetTimes);

    if (av === 0) return 0;

    // 基础公式
    const base = t * 10000 - (1600 + 200 * s) * dddTimes - 2500 * windSetTimes;

    return Math.max((base - (isVonwacqEnabled ? 4000 : 0)) / av, 0);
  };

  // ========== 阿哈速度 - 输入处理（支持浮点数）==========
  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setSpeeds((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ========== 最低速度 - 输入处理（仅整数）==========
  const handleParamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value === "" || /^\d+$/.test(value)) {
      setParams((prev) => ({ ...prev, [name]: value }));
    }
  };

  const ahaResult = calculateAhaSpeed();
  const minSpeedResult = calculateMinSpeed();
  // ========== 效果命中计算器 状态 ==========
  const [isHitModeEnabled, setIsHitModeEnabled] = useState(false);
  const [hitParams, setHitParams] = useState({
    baseChance: "",
    effectHit: "",
    effectRes: "40", // 默认 40%
    specialRes: "0", // 默认 0
  });

  // 输入处理（支持小数）
  const handleHitParamsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setHitParams((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 模式1：计算命中概率
  const calculateHitChance = () => {
    const [base, hit, res, special] = [
      hitParams.baseChance,
      hitParams.effectHit,
      hitParams.effectRes,
      hitParams.specialRes,
    ]
      .map(atof)
      .map((val) => val / 100);
    return Math.min(base * (1 + hit) * (1 - res) * (1 - special), 1) * 100;
  };

  // 模式2：计算 100% 命中所需效果命中
  const calcRequiredHitRatePercent = () => {
    const base = atof(hitParams.baseChance) / 100;
    if (base === 0) return 0;
    return Math.max(1 / (base * 0.6) - 1, 0) * 100;
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4">
      {/* 页面标题 */}
      <div className="bg-gray-800 rounded-2xl shadow p-6 mb-6">
        <h2 className="text-2xl font-bold mb-2 text-white">计算器</h2>
        <p className="text-gray-300">星铁各类伤害、速度、收益计算工具</p>
      </div>

      {/* ========== 双卡片 Flex 并排布局 ========== */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* 左侧：阿哈速度计算器 */}
        <div className="bg-gray-800 rounded-2xl shadow p-6 flex-1">
          <h3 className="text-xl font-bold text-white mb-4">阿哈速度计算器</h3>
          <div className="flex flex-wrap gap-4 mb-6">
            <SpeedInput
              label="速度 v1"
              name="v1"
              value={speeds.v1}
              onChange={handleSpeedChange}
            />
            <SpeedInput
              label="速度 v2（可选）"
              name="v2"
              value={speeds.v2}
              onChange={handleSpeedChange}
              placeholder="可不填"
            />
            <SpeedInput
              label="速度 v3（可选）"
              name="v3"
              value={speeds.v3}
              onChange={handleSpeedChange}
              placeholder="可不填"
            />
            <SpeedInput
              label="速度 v4（可选）"
              name="v4"
              value={speeds.v4}
              onChange={handleSpeedChange}
              placeholder="可不填"
            />
          </div>
          <div className="mt-6 p-4 bg-gray-700 rounded-xl">
            <p className="text-gray-300 text-sm">阿哈时刻速度</p>
            <p className="text-2xl font-bold text-white mt-1">
              {ahaResult.toFixed(2)}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              公式：80 + v1/5 + v2/10 + v3/20 + v4/50
            </p>
          </div>
        </div>

        {/* 右侧：行动值最低速度计算器 */}
        <div className="bg-gray-800 rounded-2xl shadow p-6 flex-1">
          <h3 className="text-xl font-bold text-white mb-4">最低速度计算器</h3>

          {/* 备注提示 */}
          <div className="mb-4 p-2 bg-yellow-900/30 rounded-lg border border-yellow-800">
            <p className="text-yellow-200 text-sm">
              ⚠️ 不支持一个队伍内有不同的舞舞舞叠影数
            </p>
          </div>
          {/* Vonwacq 开关 UI */}
          <div className="flex items-center gap-3 mb-5">
            <input
              type="checkbox"
              id="vonwacq"
              checked={isVonwacqEnabled}
              onChange={() => setIsVonwacqEnabled(!isVonwacqEnabled)}
              className="w-5 h-5 rounded text-blue-500 focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="vonwacq" className="text-white cursor-pointer">
              翁瓦克
            </label>
          </div>
          {/* 整数输入区域 */}
          <div className="flex flex-wrap gap-3 mb-6">
            <IntegerInput
              label="行动值 AV"
              name="av"
              value={params.av}
              onChange={handleParamChange}
            />
            <IntegerInput
              label="动数 T"
              name="t"
              value={params.t}
              onChange={handleParamChange}
            />
            <IntegerInput
              label="舞舞舞叠影 S"
              name="s"
              value={params.s}
              onChange={handleParamChange}
            />
            <IntegerInput
              label="舞舞舞次数"
              name="dddTimes"
              value={params.dddTimes}
              onChange={handleParamChange}
            />
            <IntegerInput
              label="风套触发次数"
              name="windSetTimes"
              value={params.windSetTimes}
              onChange={handleParamChange}
            />
          </div>

          {/* 结果展示 */}
          <div className="mt-6 p-4 bg-gray-700 rounded-xl">
            <p className="text-gray-300 text-sm">所需最低速度 V</p>
            <p className="text-2xl font-bold text-white mt-1">
              {minSpeedResult.toFixed(2)}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              V = (T×10000 - (1400+200S)×舞舞舞次数 - 2500×风套次数 +
              (若有翁瓦克则-4000) ) / AV
            </p>
          </div>
        </div>
        {/* 效果命中计算器 */}
        <div className="bg-gray-800 rounded-2xl shadow p-6 flex-1">
          <h3 className="text-xl font-bold text-white mb-4">效果命中计算器</h3>

          {/* 模式切换开关（占满整行） */}
          <button
            type="button"
            className={`w-full p-3 rounded-lg cursor-pointer transition-all mb-5 ${
              isHitModeEnabled
                ? "bg-blue-900/40 border border-blue-500/30"
                : "bg-gray-700"
            }`}
            onClick={() => setIsHitModeEnabled(!isHitModeEnabled)}
          >
            <div className="flex items-center justify-center gap-2">
              <input
                type="hidden"
                id="hitMode"
                checked={isHitModeEnabled}
                onChange={(e) => setIsHitModeEnabled(e.target.checked)}
                className="w-5 h-5 rounded text-blue-500 focus:ring-blue-500 cursor-pointer"
              />
              <label
                htmlFor="hitMode"
                className="text-white font-medium cursor-pointer"
              >
                最低效果命中计算
                <p className="text-sm md:text-base">
                  （输入数据单位均为%，如100表示 100%）
                </p>
              </label>
            </div>
          </button>

          {/* 模式1：计算命中概率 */}
          {!isHitModeEnabled && (
            <>
              <div className="flex flex-wrap gap-3 mb-6">
                <FloatInput
                  label="基础概率"
                  name="baseChance"
                  value={hitParams.baseChance}
                  onChange={handleHitParamsChange}
                />
                <FloatInput
                  label="效果命中"
                  name="effectHit"
                  value={hitParams.effectHit}
                  onChange={handleHitParamsChange}
                />
                <FloatInput
                  label="效果抵抗"
                  name="effectRes"
                  value={hitParams.effectRes}
                  onChange={handleHitParamsChange}
                  placeholder="40"
                />
                <FloatInput
                  label="特殊抵抗"
                  name="specialRes"
                  value={hitParams.specialRes}
                  onChange={handleHitParamsChange}
                  placeholder="0"
                />
              </div>

              <div className="mt-6 p-4 bg-gray-700 rounded-xl">
                <p className="text-gray-300 text-sm">最终命中概率</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {calculateHitChance().toFixed(2)}%
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  概率 = 基础概率 × (1+命中) × (1-抵抗) × (1-特殊抵抗)
                </p>
              </div>
            </>
          )}

          {/* 模式2：计算所需最低效果命中 */}
          {isHitModeEnabled && (
            <>
              <div className="flex flex-wrap gap-3 mb-6">
                <FloatInput
                  label="基础概率"
                  name="baseChance"
                  value={hitParams.baseChance}
                  onChange={handleHitParamsChange}
                />
              </div>

              <div className="mt-6 p-4 bg-gray-700 rounded-xl">
                <p className="text-gray-300 text-sm">所需最低效果命中</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {(() => {
                    const r = calcRequiredHitRatePercent();
                    return r > 999
                      ? ">999"
                      : r.toFixed(2);
                  })()}
                  %
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  目标：100%命中 | 效果抵抗固定 40%
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
