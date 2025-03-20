
import { ArrowUpIcon, ArrowDownIcon, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { DataCard } from "../ui/data-card";

interface MetricsCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  className?: string;
}

export const MetricsCard = ({
  title,
  value,
  trend,
  icon = <Activity className="h-4 w-4" />,
  className,
}: MetricsCardProps) => {
  return (
    <DataCard
      title={title}
      icon={icon}
      className={cn("animate-fade-in", className)}
    >
      <div className="text-2xl font-bold">{value}</div>
      
      {trend && (
        <div className="flex items-center mt-2">
          <span
            className={cn(
              "text-xs font-medium inline-flex items-center",
              trend.isPositive ? "text-emerald-600" : "text-rose-600"
            )}
          >
            {trend.isPositive ? (
              <ArrowUpIcon className="mr-1 h-3 w-3" />
            ) : (
              <ArrowDownIcon className="mr-1 h-3 w-3" />
            )}
            {Math.abs(trend.value)}%
          </span>
          <span className="text-xs text-muted-foreground ml-1">vs last period</span>
        </div>
      )}
    </DataCard>
  );
};
