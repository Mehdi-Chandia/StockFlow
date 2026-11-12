
import {
  TrendingUp,
  TrendingDown,
  type LucideIcon,
} from "lucide-react";

export interface IStatCard {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;

  // Optional fields
  change?: number;
  comparison?: string;
  supportingText?: string;
  inverseTrend?: boolean;
}

interface StatsCardsProps {
  stats: IStatCard[];
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 p-3">
      {stats.map((stat) => {
        const Icon = stat.icon;

        const isPositive = (stat.change ?? 0) >= 0;

        const isGood = stat.inverseTrend
          ? !isPositive
          : isPositive;

        const TrendIcon = isPositive
          ? TrendingUp
          : TrendingDown;

        return (
          <div
            key={stat.title}
            className="bg-[#111B25] border border-[#25313D] flex gap-3 p-6 rounded-2xl transition-colors duration-200 hover:border-[#3B4B5C]"
          >
            <Icon
              className={`${stat.iconBg} ${stat.iconColor} rounded-2xl p-1`}
              size={35}
            />

            <div className="min-w-0 space-y-2">
              <p className="text-sm text-[#94A3B8]">
                {stat.title}
              </p>

              <p className="text-2xl font-semibold text-[#F1F5F9]">
                {stat.value}
              </p>

              {stat.change !== undefined && (
                <div className="flex items-center gap-1">
                  <TrendIcon
                    size={16}
                    className={isGood ? "text-emerald-400" : "text-red-400"}
                  />

                  <span className={isGood ? "text-emerald-400" : "text-red-400"}>
                    {Math.abs(stat.change)}%
                  </span>

                  <span className="text-xs text-[#94A3B8]">
                    {stat.comparison}
                  </span>
                </div>
              )}

              {stat.supportingText && (
                <p className="text-xs text-[#94A3B8]">
                  {stat.supportingText}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
