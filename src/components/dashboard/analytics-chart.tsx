import { useState, useEffect } from "react";
import { 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  ReferenceLine,
  Area,
  AreaChart,
  ComposedChart
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DailyAnalytics } from "@/services/analyticsService";
import { CombinedPerformanceData } from "@/services/anomalyService";

interface AnalyticsChartProps {
  title: string;
  type: "clicks" | "adSpend" | "forecast";
  chartType?: "line" | "bar" | "area" | "composed";
  className?: string;
  data?: DailyAnalytics[] | CombinedPerformanceData[];
  isLoading?: boolean;
  showThresholds?: boolean;
}

export const AnalyticsChart = ({ 
  title, 
  type, 
  chartType = "line",
  className,
  data = [],
  isLoading = false,
  showThresholds = false
}: AnalyticsChartProps) => {
  const [animateChart, setAnimateChart] = useState(false);
  
  useEffect(() => {
    // Only animate if we have data and it's not loading
    if (data.length > 0 && !isLoading) {
      // Small delay to allow the UI to render first
      const timeout = setTimeout(() => {
        setAnimateChart(true);
      }, 300);
      
      return () => clearTimeout(timeout);
    }
  }, [data, isLoading]);

  // Format the data for the charts
  const formattedData = data.map(item => {
    if ('date' in item) {
      // Handle DailyAnalytics type data
      const dailyItem = item as DailyAnalytics;
      
      // Format date to display as day and month
      const date = new Date(dailyItem.date);
      const formattedDate = `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
      
      if (type === "clicks") {
        return {
          date: formattedDate,
          clicks: dailyItem.total_clicks,
          uniqueUsers: dailyItem.total_unique_users
        };
      } else {
        return {
          date: formattedDate,
          spend: dailyItem.total_ad_spend,
          impressions: dailyItem.total_impressions / 100 // Scale down for better visualization
        };
      }
    } else {
      // Handle CombinedPerformanceData type data
      const performanceItem = item as CombinedPerformanceData;
      
      // Format date to display
      const date = new Date(performanceItem.date_time);
      const formattedDate = `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })} ${date.getHours()}:00`;
      
      return {
        date: formattedDate,
        actual: performanceItem.actual_spend,
        forecast: performanceItem.forecast_spend,
        difference: performanceItem.difference,
        percentageDiff: performanceItem.percentage_difference,
        isAnomaly: performanceItem.is_anomaly,
        severity: performanceItem.severity,
        thresholdExceeded: performanceItem.threshold_exceeded
      };
    }
  });

  const renderChart = () => {
    if (type === "forecast") {
      // Special case for forecast vs actual visualization
      switch (chartType) {
        case "composed":
          return (
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart
                data={formattedData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={{ stroke: 'hsl(var(--border))' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={{ stroke: 'hsl(var(--border))' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-md">
                          <p className="font-medium">{data.date}</p>
                          <p className="text-sm text-primary">Actual: ${data.actual.toFixed(2)}</p>
                          <p className="text-sm text-blue-500">Forecast: ${data.forecast.toFixed(2)}</p>
                          <div className="mt-1 pt-1 border-t">
                            <p className="text-xs text-muted-foreground">
                              Difference: {data.percentageDiff.toFixed(1)}%
                            </p>
                            {data.isAnomaly && (
                              <Badge 
                                variant="outline" 
                                className={cn(
                                  "mt-1",
                                  data.severity === 'high' ? 'bg-red-100 text-red-800' :
                                  data.severity === 'medium' ? 'bg-amber-100 text-amber-800' :
                                  'bg-blue-100 text-blue-800'
                                )}
                              >
                                {data.thresholdExceeded} Alert
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                
                {/* Show thresholds as reference areas */}
                {showThresholds && (
                  <>
                    <ReferenceLine 
                      y={0} 
                      stroke="hsl(var(--border))" 
                      strokeWidth={1}
                    />
                    <ReferenceLine 
                      y={15} // L1 threshold
                      stroke="hsl(217, 91%, 60%)" 
                      strokeWidth={1}
                      strokeDasharray="3 3"
                      label={{ value: 'L1 (15%)', position: 'insideBottomRight', fill: 'hsl(217, 91%, 60%)' }}
                    />
                    <ReferenceLine 
                      y={30} // L2 threshold
                      stroke="hsl(45, 93%, 47%)" 
                      strokeWidth={1}
                      strokeDasharray="3 3"
                      label={{ value: 'L2 (30%)', position: 'insideBottomRight', fill: 'hsl(45, 93%, 47%)' }}
                    />
                    <ReferenceLine 
                      y={50} // L3 threshold
                      stroke="hsl(0, 84%, 60%)" 
                      strokeWidth={1}
                      strokeDasharray="3 3"
                      label={{ value: 'L3 (50%)', position: 'insideBottomRight', fill: 'hsl(0, 84%, 60%)' }}
                    />
                  </>
                )}
                
                <Bar 
                  dataKey="percentageDiff" 
                  name="Difference (%)"
                  fill="hsl(var(--muted))"
                  radius={[4, 4, 0, 0]}
                  isAnimationActive={animateChart}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
                
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  name="Actual Spend ($)"
                  stroke="hsl(208, 100%, 54%)" 
                  strokeWidth={2}
                  dot={{ stroke: 'hsl(208, 100%, 54%)', strokeWidth: 2, r: 4, fill: 'hsl(var(--card))' }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: 'hsl(208, 100%, 54%)' }}
                  isAnimationActive={animateChart}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
                
                <Line 
                  type="monotone" 
                  dataKey="forecast" 
                  name="Forecast Spend ($)"
                  stroke="hsl(142, 71%, 45%)" 
                  strokeWidth={2} 
                  strokeDasharray="5 5"
                  dot={{ stroke: 'hsl(142, 71%, 45%)', strokeWidth: 2, r: 4, fill: 'hsl(var(--card))' }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: 'hsl(142, 71%, 45%)' }}
                  isAnimationActive={animateChart}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
              </ComposedChart>
            </ResponsiveContainer>
          );
          
        case "area":
          return (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={formattedData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={{ stroke: 'hsl(var(--border))' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={{ stroke: 'hsl(var(--border))' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="forecast" 
                  name="Forecast Spend ($)"
                  stroke="hsl(142, 71%, 45%)"
                  fill="hsl(142, 71%, 45%)"
                  fillOpacity={0.3}
                  isAnimationActive={animateChart}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
                <Area 
                  type="monotone" 
                  dataKey="actual" 
                  name="Actual Spend ($)"
                  stroke="hsl(208, 100%, 54%)"
                  fill="hsl(208, 100%, 54%)"
                  fillOpacity={0.3}
                  isAnimationActive={animateChart}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          );
          
        default: // line or bar
          return (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={formattedData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={{ stroke: 'hsl(var(--border))' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={{ stroke: 'hsl(var(--border))' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  name="Actual Spend ($)"
                  stroke="hsl(208, 100%, 54%)" 
                  strokeWidth={2}
                  dot={{ stroke: 'hsl(208, 100%, 54%)', strokeWidth: 2, r: 4, fill: 'hsl(var(--card))' }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: 'hsl(208, 100%, 54%)' }}
                  isAnimationActive={animateChart}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
                <Line 
                  type="monotone" 
                  dataKey="forecast" 
                  name="Forecast Spend ($)"
                  stroke="hsl(142, 71%, 45%)" 
                  strokeWidth={2} 
                  strokeDasharray="5 5"
                  dot={{ stroke: 'hsl(142, 71%, 45%)', strokeWidth: 2, r: 4, fill: 'hsl(var(--card))' }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: 'hsl(142, 71%, 45%)' }}
                  isAnimationActive={animateChart}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
              </LineChart>
            </ResponsiveContainer>
          );
      }
    } else if (chartType === "line") {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={formattedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={{ stroke: 'hsl(var(--border))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={{ stroke: 'hsl(var(--border))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                color: 'hsl(var(--foreground))'
              }}
            />
            <Legend />
            {type === "clicks" ? (
              <>
                <Line 
                  type="monotone" 
                  dataKey="clicks" 
                  name="Clicks" 
                  stroke="hsl(222, 47%, 11%)" 
                  strokeWidth={2} 
                  dot={{ stroke: 'hsl(222, 47%, 11%)', strokeWidth: 2, r: 4, fill: 'hsl(var(--card))' }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: 'hsl(222, 47%, 11%)' }}
                  isAnimationActive={animateChart}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
                <Line 
                  type="monotone" 
                  dataKey="uniqueUsers" 
                  name="Unique Users"
                  stroke="hsl(215, 16%, 47%)" 
                  strokeWidth={2} 
                  strokeDasharray="5 5"
                  dot={{ stroke: 'hsl(215, 16%, 47%)', strokeWidth: 2, r: 4, fill: 'hsl(var(--card))' }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: 'hsl(215, 16%, 47%)' }}
                  isAnimationActive={animateChart}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
              </>
            ) : (
              <>
                <Line 
                  type="monotone" 
                  dataKey="spend" 
                  name="Ad Spend ($)"
                  stroke="hsl(208, 100%, 54%)" 
                  strokeWidth={2}
                  dot={{ stroke: 'hsl(208, 100%, 54%)', strokeWidth: 2, r: 4, fill: 'hsl(var(--card))' }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: 'hsl(208, 100%, 54%)' }}
                  isAnimationActive={animateChart}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
                <Line 
                  type="monotone" 
                  dataKey="impressions" 
                  name="Impressions (x100)" 
                  stroke="hsl(142, 71%, 45%)" 
                  strokeWidth={2} 
                  strokeDasharray="5 5"
                  dot={{ stroke: 'hsl(142, 71%, 45%)', strokeWidth: 2, r: 4, fill: 'hsl(var(--card))' }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: 'hsl(142, 71%, 45%)' }}
                  isAnimationActive={animateChart}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      );
    } else {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={formattedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={{ stroke: 'hsl(var(--border))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={{ stroke: 'hsl(var(--border))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                color: 'hsl(var(--foreground))'
              }}
            />
            <Legend />
            {type === "clicks" ? (
              <>
                <Bar 
                  dataKey="clicks" 
                  name="Clicks"
                  fill="hsl(222, 47%, 11%)"
                  radius={[4, 4, 0, 0]}
                  isAnimationActive={animateChart}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
                <Bar 
                  dataKey="uniqueUsers" 
                  name="Unique Users"
                  fill="hsl(215, 16%, 47%)"
                  radius={[4, 4, 0, 0]}
                  isAnimationActive={animateChart}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
              </>
            ) : (
              <>
                <Bar 
                  dataKey="spend" 
                  name="Ad Spend ($)"
                  fill="hsl(208, 100%, 54%)"
                  radius={[4, 4, 0, 0]}
                  isAnimationActive={animateChart}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
                <Bar 
                  dataKey="impressions" 
                  name="Impressions (x100)"
                  fill="hsl(142, 71%, 45%)"
                  radius={[4, 4, 0, 0]}
                  isAnimationActive={animateChart}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
              </>
            )}
          </BarChart>
        </ResponsiveContainer>
      );
    }
  };

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[300px]">
            <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          </div>
        ) : formattedData.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            <p>No data available</p>
          </div>
        ) : (
          renderChart()
        )}
      </CardContent>
    </Card>
  );
};