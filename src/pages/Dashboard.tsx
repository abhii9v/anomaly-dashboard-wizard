
import { useState } from "react";
import { 
  MousePointer, 
  DollarSign, 
  AlertTriangle, 
  TrendingUp, 
  Shield,
  Clock 
} from "lucide-react";
import { AnalyticsChart } from "@/components/dashboard/analytics-chart";
import { MetricsCard } from "@/components/dashboard/metrics-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  const [timeframe, setTimeframe] = useState("today");

  // Sample anomalies data
  const recentAnomalies = [
    { id: 1, time: "Today, 10:45 AM", campaign: "Summer Sale", value: "$245.67", expected: "$120.33", severity: "high" },
    { id: 2, time: "Today, 08:12 AM", campaign: "Product Launch", value: "$189.22", expected: "$150.00", severity: "medium" },
    { id: 3, time: "Yesterday, 11:30 PM", campaign: "Retargeting", value: "$78.33", expected: "$25.00", severity: "high" },
    { id: 4, time: "Yesterday, 2:15 PM", campaign: "Email Campaign", value: "$112.45", expected: "$80.00", severity: "low" },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "medium":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      case "low":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      default:
        return "bg-slate-100 text-slate-800 hover:bg-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Anomaly Detection Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
        </div>
      </div>
      
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <MetricsCard
          title="Ad Spend"
          value="$8,942"
          trend={{ value: 8.2, isPositive: true }}
          icon={<DollarSign className="h-4 w-4" />}
          className="animate-delay-100"
        />
        <MetricsCard
          title="Anomalies Detected"
          value="12"
          trend={{ value: 3.5, isPositive: false }}
          icon={<AlertTriangle className="h-4 w-4" />}
          className="animate-delay-200"
        />
        <MetricsCard
          title="Fraud Prevention"
          value="$1,245"
          trend={{ value: 15.8, isPositive: true }}
          icon={<Shield className="h-4 w-4" />}
          className="animate-delay-300"
        />
        <MetricsCard
          title="Forecast Accuracy"
          value="92.4%"
          trend={{ value: 2.1, isPositive: true }}
          icon={<TrendingUp className="h-4 w-4" />}
          className="animate-delay-400"
        />
      </div>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AnalyticsChart 
            title="Ad Spend vs. Forecast" 
            type="adSpend" 
            className="animate-delay-100" 
          />
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
              Recent Anomalies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAnomalies.map((anomaly) => (
                <div key={anomaly.id} className="bg-card border rounded-lg p-3 hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{anomaly.campaign}</div>
                      <div className="flex items-center mt-1 text-sm text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        {anomaly.time}
                      </div>
                    </div>
                    <Badge variant="outline" className={getSeverityColor(anomaly.severity)}>
                      {anomaly.severity}
                    </Badge>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Actual: </span>
                      <span className="font-medium text-red-600">{anomaly.value}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Expected: </span>
                      <span className="font-medium">{anomaly.expected}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <AnalyticsChart 
          title="Hourly Anomaly Detection" 
          type="clicks" 
          className="animate-delay-100" 
        />
        <AnalyticsChart 
          title="Campaign Performance" 
          type="adSpend"
          chartType="bar" 
          className="animate-delay-200" 
        />
      </div>
    </div>
  );
};

export default Dashboard;
