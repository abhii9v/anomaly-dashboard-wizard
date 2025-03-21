import { ArrowUpIcon, ArrowDownIcon, Activity, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { DataCard } from "../ui/data-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface MetricsCardProps {
  title: string;
  value: string | number;
  comparisonValue?: string | number;
  comparisonLabel?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  anomalyData?: {
    isAnomaly: boolean;
    level: 'L1' | 'L2' | 'L3';
    percentageDiff: number;
  };
  icon?: React.ReactNode;
  className?: string;
  isLoading?: boolean;
}

export const MetricsCard = ({
  title,
  value,
  comparisonValue,
  comparisonLabel = "Forecast",
  trend,
  anomalyData,
  icon = <Activity className="h-4 w-4" />,
  className,
  isLoading = false,
}: MetricsCardProps) => {
  if (isLoading) {
    return (
      <DataCard
        title={title}
        icon={icon}
        className={cn("animate-pulse", className)}
      >
        <Skeleton className="h-8 w-2/3 mb-2" />
        {(trend || comparisonValue) && <Skeleton className="h-4 w-1/2" />}
      </DataCard>
    );
  }

  const isAnomaly = anomalyData?.isAnomaly || false;
  const anomalyLevel = anomalyData?.level;
  const percentageDiff = anomalyData?.percentageDiff;

  const getAnomalyColor = () => {
    if (!isAnomaly) return "";
    
    switch(anomalyLevel) {
      case 'L3': return "border-l-4 border-red-500";
      case 'L2': return "border-l-4 border-amber-500";
      case 'L1': return "border-l-4 border-blue-500";
      default: return "";
    }
  };

  const getAnomalyBadgeStyle = () => {
    switch(anomalyLevel) {
      case 'L3': return "bg-red-100 text-red-800 hover:bg-red-200";
      case 'L2': return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      case 'L1': return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      default: return "bg-slate-100 text-slate-800 hover:bg-slate-200";
    }
  };

  const formatValue = (val: string | number) => {
    if (typeof val === 'string') return val;
    
    // Format large numbers
    if (val >= 1000000) {
      return `$${(val / 1000000).toFixed(1)}M`;
    } else if (val >= 1000) {
      return `$${(val / 1000).toFixed(1)}K`;
    } else if (typeof val === 'number') {
      // For smaller numbers or percentages
      if (title.toLowerCase().includes('percentage') || title.toLowerCase().includes('accuracy')) {
        return `${val}%`;
      }
      return `$${val.toLocaleString()}`;
    }
    
    return val;
  };

  const getAnomalyTooltip = () => {
    if (!isAnomaly) return "";
    
    switch(anomalyLevel) {
      case 'L3': return "Critical Threshold Exceeded - Immediate Action Required";
      case 'L2': return "Warning Threshold Exceeded - Investigate Soon";
      case 'L1': return "Alert Threshold Exceeded - Monitor Closely";
      default: return "Anomaly Detected";
    }
  };

  return (
    <TooltipProvider>
      <DataCard
        title={title}
        icon={icon}
        className={cn(
          "animate-fade-in transition-all duration-300", 
          getAnomalyColor(),
          isAnomaly && "shadow-md hover:shadow-lg",
          className
        )}
      >
        <div className="text-2xl font-bold">{formatValue(value)}</div>
        
        {comparisonValue && (
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-muted-foreground">{comparisonLabel}:</span>
            <span className="text-sm font-medium">{formatValue(comparisonValue)}</span>
            
            {percentageDiff !== undefined && (
              <span className={cn(
                "text-xs font-medium ml-1",
                percentageDiff > 0 ? "text-rose-600" : "text-emerald-600"
              )}>
                {percentageDiff > 0 
                  ? <TrendingUp className="inline h-3 w-3 mr-0.5" /> 
                  : <TrendingDown className="inline h-3 w-3 mr-0.5" />}
                {Math.abs(percentageDiff).toFixed(1)}%
              </span>
            )}
            
            {isAnomaly && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "ml-auto",
                      getAnomalyBadgeStyle()
                    )}
                  >
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    {anomalyLevel}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{getAnomalyTooltip()}</p>
                  <p className="text-xs mt-1">Deviation: {Math.abs(percentageDiff || 0).toFixed(1)}%</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        )}
        
        {trend && !comparisonValue && (
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
            
            {isAnomaly && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "ml-auto",
                      getAnomalyBadgeStyle()
                    )}
                  >
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    {anomalyLevel}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{getAnomalyTooltip()}</p>
                  {percentageDiff !== undefined && (
                    <p className="text-xs mt-1">Deviation: {Math.abs(percentageDiff).toFixed(1)}%</p>
                  )}
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        )}
      </DataCard>
    </TooltipProvider>
  );
};