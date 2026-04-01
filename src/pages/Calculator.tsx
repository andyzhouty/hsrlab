import { useState } from 'react';

// 可复用数字输入框组件（支持浮点数 - 速度专用）
function SpeedInput({
  label,
  name,
  value,
  onChange,
  placeholder = "请输入"
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
  placeholder = "请输入"
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
  const [speeds, setSpeeds] = useState({ v1: '', v2: '', v3: '', v4: '' });

  // ========== 行动值最低速度计算器 状态 ==========
  const [params, setParams] = useState({
    av: '',       // 行动值 (整数)
    t: '',        // 动数 (整数)
    s: '',        // 舞舞舞叠影数 (整数)
    dddTimes: '', // 舞舞舞次数 (整数)
    windSetTimes: '' // 风套触发次数 (整数)
  });

  // ========== 阿哈速度 - 计算逻辑 ==========
  const calculateAhaSpeed = () => {
    const v1 = parseFloat(speeds.v1) || 0;
    const v2 = parseFloat(speeds.v2) || 0;
    const v3 = parseFloat(speeds.v3) || 0;
    const v4 = parseFloat(speeds.v4) || 0;
    return 80 + v1 / 5 + v2 / 10 + v3 / 20 + v4 / 50;
  };
    const [isVonwacqEnabled, setIsVonwacqEnabled] = useState(false);
  // ========== 最低速度 - 计算逻辑 ==========
  const calculateMinSpeed = () => {
    const av = parseInt(params.av) || 0;
    const t = parseInt(params.t) || 0;
    const s = parseInt(params.s) || 0;
    const dddTimes = parseInt(params.dddTimes) || 0;
    const windSetTimes = parseInt(params.windSetTimes) || 0;

    if (av === 0) return 0;

    // 基础公式
    let base = t * 10000 - (1600 + 200 * s) * dddTimes - 2500 * windSetTimes;
    
    // Vonwacq开启：多减 4000
    if (isVonwacqEnabled) {
      base -= 4000;
    }

    return Math.max(base / av, 0);
  };

  // ========== 阿哈速度 - 输入处理（支持浮点数）==========
  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setSpeeds(prev => ({ ...prev, [name]: value }));
    }
  };

  // ========== 最低速度 - 输入处理（仅整数）==========
  const handleParamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value === '' || /^\d+$/.test(value)) {
      setParams(prev => ({ ...prev, [name]: value }));
    }
  };

  const ahaResult = calculateAhaSpeed();
  const minSpeedResult = calculateMinSpeed();

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
            <SpeedInput label="速度 v1" name="v1" value={speeds.v1} onChange={handleSpeedChange} />
            <SpeedInput label="速度 v2（可选）" name="v2" value={speeds.v2} onChange={handleSpeedChange} placeholder="可不填" />
            <SpeedInput label="速度 v3（可选）" name="v3" value={speeds.v3} onChange={handleSpeedChange} placeholder="可不填" />
            <SpeedInput label="速度 v4（可选）" name="v4" value={speeds.v4} onChange={handleSpeedChange} placeholder="可不填" />
          </div>
          <div className="mt-6 p-4 bg-gray-700 rounded-xl">
            <p className="text-gray-300 text-sm">阿哈时刻速度</p>
            <p className="text-2xl font-bold text-white mt-1">{ahaResult.toFixed(2)}</p>
            <p className="text-xs text-gray-400 mt-1">公式：80 + v1/5 + v2/10 + v3/20 + v4/50</p>
          </div>
        </div>

        {/* 右侧：行动值最低速度计算器 */}
        <div className="bg-gray-800 rounded-2xl shadow p-6 flex-1">
          <h3 className="text-xl font-bold text-white mb-4">最低速度计算器</h3>
          
          {/* 备注提示 */}
          <div className="mb-4 p-2 bg-yellow-900/30 rounded-lg border border-yellow-800">
            <p className="text-yellow-200 text-sm">⚠️ 不支持一个队伍内有不同的舞舞舞叠影数</p>
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
            <label htmlFor="vonwacq" className="text-white cursor-pointer">翁瓦克</label>
          </div>
          {/* 整数输入区域 */}
          <div className="flex flex-wrap gap-3 mb-6">
            <IntegerInput label="行动值 AV" name="av" value={params.av} onChange={handleParamChange} />
            <IntegerInput label="动数 T" name="t" value={params.t} onChange={handleParamChange} />
            <IntegerInput label="舞舞舞叠影 S" name="s" value={params.s} onChange={handleParamChange} />
            <IntegerInput label="舞舞舞次数" name="dddTimes" value={params.dddTimes} onChange={handleParamChange} />
            <IntegerInput label="风套触发次数" name="windSetTimes" value={params.windSetTimes} onChange={handleParamChange} />
          </div>

          {/* 结果展示 */}
          <div className="mt-6 p-4 bg-gray-700 rounded-xl">
            <p className="text-gray-300 text-sm">所需最低速度 V</p>
            <p className="text-2xl font-bold text-white mt-1">{minSpeedResult.toFixed(2)}</p>
            <p className="text-xs text-gray-400 mt-1">
              V = (T×10000 - (1400+200S)×舞舞舞次数 - 2500×风套次数 + (若有翁瓦克则-4000) ) / AV
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
