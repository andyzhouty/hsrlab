import { useState } from 'react';

// 可复用数字输入框组件（支持小数）
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

// 主页面组件
export default function Calculator() {
  const [speeds, setSpeeds] = useState({
    v1: '',
    v2: '',
    v3: '',
    v4: '',
  });

  // 计算结果（支持小数参与运算）
  const calculateResult = () => {
    const v1 = parseFloat(speeds.v1) || 0;
    const v2 = parseFloat(speeds.v2) || 0;
    const v3 = parseFloat(speeds.v3) || 0;
    const v4 = parseFloat(speeds.v4) || 0;
    const sortedSpeeds = [v1, v2, v3, v4].sort((a, b) => b - a); // 降序排序，确保 v1 是最大的速度
    return 80 + sortedSpeeds[0] / 5 + sortedSpeeds[1] / 10 + sortedSpeeds[2] / 20 + sortedSpeeds[3] / 50;
  };

  // 输入规则：允许 整数、小数（支持一个小数点）
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // 正则支持浮点数：允许空、数字、最多一个小数点
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setSpeeds(prev => ({ ...prev, [name]: value }));
    }
  };

  const result = calculateResult();

  return (
    <div className="max-w-2xl mx-auto mt-10">
      {/* 阿哈速度计算器 */}
      <div className="bg-gray-800 rounded-2xl shadow p-6">
        <h3 className="text-xl font-bold text-white mb-4">阿哈速度计算器</h3>

        {/* 输入框 */}
        <div className="flex flex-wrap gap-4 mb-6">
          <SpeedInput label="速度 v1" name="v1" value={speeds.v1} onChange={handleChange} />
          <SpeedInput label="速度 v2（可选）" name="v2" value={speeds.v2} onChange={handleChange} placeholder="可不填" />
          <SpeedInput label="速度 v3（可选）" name="v3" value={speeds.v3} onChange={handleChange} placeholder="可不填" />
          <SpeedInput label="速度 v4（可选）" name="v4" value={speeds.v4} onChange={handleChange} placeholder="可不填" />
        </div>

        {/* 结果展示 */}
        <div className="mt-6 p-4 bg-gray-700 rounded-xl">
          <p className="text-gray-300 text-sm">阿哈时刻速度</p>
          <p className="text-2xl font-bold text-white mt-1">{result.toFixed(2)}</p>
          <p className="text-xs text-gray-400 mt-1">公式：80 + v1/5 + v2/10 + v3/20 + v4/50</p>
        </div>
      </div>
    </div>
  );
}
