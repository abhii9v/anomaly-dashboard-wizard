
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
import { cn } from "@/lib/utils";

// Generate sample data for clicks over time
const generateClicksData = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    
    data.push({
      date: `${day} ${month}`,
      clicks: Math.floor(Math.random() * 500) + 100,
      uniqueUsers: Math.floor(Math.random() * 200) + 50,
    });
  }
  
  return data;
};

// Generate sample data for ad spend
const generateAdSpendData = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    
    data.push({
      date: `${day} ${month}`,
      spend: Math.floor(Math.random() * 1000) + 200,
      impressions: Math.floor(Math.random() * 5000) + 1000,
    });
  }
  
  return data;
};

interface AnalyticsChartProps {
  title: string;
  type: "clicks" | "adSpend";
  chartType?: "line" | "bar";
  className?: string;
}

export const AnalyticsChart = ({ 
  title, 
  type, 
  chartType = "line",
  className 
}: AnalyticsChartProps) => {
  const [data, setData] = useState<any[]>([]);
  const [animateChart, setAnimateChart] = useState(false);
  
  useEffect(() => {
    // Generate the data based on the chart type
    const chartData = type === "clicks" ? generateClicksData() : generateAdSpendData();
    setData([]);
    
    // Animate the chart data loading
    const timeout = setTimeout(() => {
      setData(chartData);
      setAnimateChart(true);
    }, 500);
    
    return () => clearTimeout(timeout);
  }, [type]);

  const renderChart = () => {
    if (chartType === "line") {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
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
            data={data}
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
                  fill="hsl(222, 47%, 11%)"
                  radius={[4, 4, 0, 0]}
                  isAnimationActive={animateChart}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
                <Bar 
                  dataKey="uniqueUsers" 
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
                  fill="hsl(208, 100%, 54%)"
                  radius={[4, 4, 0, 0]}
                  isAnimationActive={animateChart}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
                <Bar 
                  dataKey="impressions" 
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
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-[300px]">
            <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          </div>
        ) : (
          renderChart()
        )}
      </CardContent>
    </Card>
  );
};
