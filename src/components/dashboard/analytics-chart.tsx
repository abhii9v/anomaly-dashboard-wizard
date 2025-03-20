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
  Legend
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { DailyAnalytics } from "@/services/analyticsService";

interface AnalyticsChartProps {
  title: string;
  type: "clicks" | "adSpend";
  chartType?: "line" | "bar";
  className?: string;
  data?: DailyAnalytics[];
  isLoading?: boolean;
}

export const AnalyticsChart = ({ 
  title, 
  type, 
  chartType = "line",
  className,
  data = [],
  isLoading = false
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
    // Format date to display as day and month
    const date = new Date(item.date);
    const formattedDate = `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
    
    if (type === "clicks") {
      return {
        date: formattedDate,
        clicks: item.total_clicks,
        uniqueUsers: item.total_unique_users
      };
    } else {
      return {
        date: formattedDate,
        spend: item.total_ad_spend,
        impressions: item.total_impressions / 100 // Scale down for better visualization
      };
    }
  });

  // Function to get color based on retention value
  const getColor = (value: number) => {
    // Scale from light blue to dark blue based on retention percentage
    const intensity = Math.floor((value / 100) * 255);
    return `rgb(${255 - intensity}, ${255 - intensity}, 255)`;
  };

  const renderChart = () => {
    if (chartType === "line") {
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