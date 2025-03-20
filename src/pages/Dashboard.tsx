
import { MousePointer, DollarSign, Zap, TrendingUp } from "lucide-react";
import { AnalyticsChart } from "@/components/dashboard/analytics-chart";
import { MetricsCard } from "@/components/dashboard/metrics-card";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
        </div>
      </div>
      
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <MetricsCard
          title="Total Clicks"
          value="14,856"
          trend={{ value: 12.5, isPositive: true }}
          icon={<MousePointer className="h-4 w-4" />}
          className="animate-delay-100"
        />
        <MetricsCard
          title="Ad Spend"
          value="$8,942"
          trend={{ value: 8.2, isPositive: true }}
          icon={<DollarSign className="h-4 w-4" />}
          className="animate-delay-200"
        />
        <MetricsCard
          title="Conversion Rate"
          value="3.6%"
          trend={{ value: 1.8, isPositive: false }}
          icon={<Zap className="h-4 w-4" />}
          className="animate-delay-300"
        />
        <MetricsCard
          title="CTR"
          value="5.42%"
          trend={{ value: 3.1, isPositive: true }}
          icon={<TrendingUp className="h-4 w-4" />}
          className="animate-delay-400"
        />
      </div>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <AnalyticsChart 
          title="Clicks Overview" 
          type="clicks" 
          className="animate-delay-100" 
        />
        <AnalyticsChart 
          title="Ad Spend" 
          type="adSpend" 
          className="animate-delay-200" 
        />
      </div>
    </div>
  );
};

export default Dashboard;
