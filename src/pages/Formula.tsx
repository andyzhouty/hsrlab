import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";

type FormulaBlockProps = {
  title: string;
  children: React.ReactNode;
};

/**
 * ✅ 通用公式卡片组件
 */
function FormulaBlock({ title, children }: FormulaBlockProps) {
  return (
    <div className="bg-[#2b3a42] text-white rounded-xl p-6 shadow-md" style={{ overflowX: 'auto', maxWidth: '100%', fontSize: 'min(0.85rem, 3vw)' }}>
      <h2 className="text-lg font-bold mb-4 text-center">{title}</h2>
      <div className="space-y-3 leading-relaxed">{children}</div>
    </div>
  );
}

export default function Formula() {
    // 然后传给组件
    return (
    <div className="p-4 max-w-8xl mx-auto">
      {/* 网格布局 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ================= 防御力 抗性 ================= */}
        <FormulaBlock title="防御力 抗性">
          <p>通用抗性公式：（抗性不能超过该范围）</p>

          <BlockMath
            math={String.raw`\text{抗性系数} = 1 - \text{抗性} \quad (-100\% \leq \text{抗性} \leq 90\%)`}
          />

          <p>角色攻击敌人时：</p>
          <div>
          <BlockMath
            math={String.raw`\text{防御系数} = \frac{\text{角色等级} + 20}{(\text{角色等级}+20)+(\text{敌人等级}+20) \times (1-\text{减防\%}-\text{无视防御\%})}`}
          />
          </div>
          <p>敌人攻击角色时：</p>

          <BlockMath
            math={String.raw`\text{防御系数} = \frac{10 \times \text{敌人等级} + 200}{10 \times \text{敌人等级} + 200 + \text{角色防御}}`}
          />
        </FormulaBlock>

        {/* ================= 常规伤害 ================= */}
        <FormulaBlock title="常规伤害">
          <p>角色造成的常规伤害：</p>
          <BlockMath
            math={String.raw`\text{最终伤害} = \text{基础值} \times \text{独立乘区}`}
          />
          <BlockMath
            math={String.raw`\times (1+\text{增伤\%}) \times (1+\text{易伤\%})`}
          />
          <BlockMath
            math={String.raw`\times (1-\text{虚弱\%}) \times \text{减伤区}`}
          />
          <BlockMath
            math={String.raw`\times \text{抗性系数} \times \text{防御系数}`}
          />
          <BlockMath math={String.raw`\times \text{暴击区}`} />
          <p>基础值：攻击力 * 倍率（攻击力可替换为生命等）</p>
          <p>增伤：提升我方造成的伤害</p>
          <p>易伤：目标受到伤害提升</p>
          <p>减伤：所有减伤乘算，最低不低于1%；同名减伤（如王棋帕姆）加算。</p>
        </FormulaBlock>

        {/* ================= 击破伤害 ================= */}
        <FormulaBlock title="击破伤害">
          <p>角色击破弱点时：</p>

          <BlockMath
            math={String.raw`\text{击破伤害} = \text{击破基础值} \times \text{属性倍率}`}
          />
          <BlockMath
            math={String.raw`\times (1+\text{易伤\%})\times (1+\text{击破特攻})`}
          />
          <BlockMath math={String.raw`\times (1+\text{击破增伤\%})\times\text{减伤区}`} />
          <BlockMath
            math={String.raw`\times \text{抗性系数} \times \text{防御系数}`}
          />

          <p className="text-yellow-300">击破伤害不受常规增伤影响</p>
          <BlockMath math={String.raw`\text{击破基础值} = 3767.55 \times (\frac{\text{韧性上限}}{40}+0.5)`} />
          <p>火、物理属性击破倍率为2.0，风属性击破倍率为1.5，冰、雷为1.0，量子、虚数为0.5</p>
        </FormulaBlock>

        {/* ================= 超击破伤害 ================= */}
        <FormulaBlock title="超击破伤害">
          <p>特定情况下触发：</p>

          <BlockMath
            math={String.raw`\text{超击破伤害} = \text{超击破基础值} \times \text{超击破倍率}`}
          />
          <BlockMath math={String.raw`\times \text{特殊独立乘区}\times (1+\text{易伤\%})`} />
          <BlockMath math={String.raw`\times (1+\text{击破特攻})\times (1+\text{击破增伤\%})`} />
          <BlockMath
            math={String.raw`\times\text{减伤区}`}
          />
          <BlockMath
            math={String.raw`\times \text{抗性系数} \times \text{防御系数}`}
          />
          <p className="text-yellow-300">不受常规增伤影响</p>
          <BlockMath math={String.raw`\text{超击破基础值} = 3767.55 \times \frac{\text{实际削韧值}}{10}`} />

        </FormulaBlock>

        <FormulaBlock title="持续伤害">
          <p>角色造成的持续伤害：</p>
          <BlockMath
            math={String.raw`\text{持续伤害} = \text{基础值} \times \text{特殊独立乘区}`}
          />
          <BlockMath
            math={String.raw`\times (1 + \text{增伤\%}) \times (1 + \text{易伤\%}) \times (1 - \text{虚弱\%})`}
          />
          <BlockMath
            math={String.raw`\times\text{减伤区}\times \text{抗性系数}`}
          />
          <BlockMath
            math={String.raw`\times \text{防御系数} \times \text{持续伤害暴击区}`}
          />
          <p>
            <strong>基础值</strong>: 攻击力 ×
            倍率，攻击力可以替换为其他属性（生命值等）
          </p>
          <p className="text-yellow-300">
            持续伤害和常规伤害的唯一区别是，原本的暴击区被替换为持续伤害暴击区，只有极少数效果能提供此乘区。
          </p>
        </FormulaBlock>

        <FormulaBlock title="欢愉伤害">
            <p>角色造成的欢愉伤害：</p>
            <BlockMath
              math={String.raw`\text{欢愉伤害} = \text{基础值7535.107} \times (\text{1+欢愉度\%})`}
            />
            <BlockMath
              math={String.raw`\times (1+\text{增笑\%}) \times (1+\text{易伤\%}) `}
            />
            <BlockMath
              math={String.raw`\times(1+\frac{5\times\text{笑点}}{\text{笑点}+240})`} />
            <BlockMath math={String.raw` \times \text{暴击区} \times \text{减伤区}`} />
            <BlockMath math={String.raw`\times \text{抗性系数} \times \text{防御系数}`} />
            <p className="text-yellow-300">不受常规增伤影响</p>
        </FormulaBlock>
      </div>
    </div>
  );
}
