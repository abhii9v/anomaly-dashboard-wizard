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
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

// Import the hooks
import { useLatestAnalytics, useAnalyticsForPastDays } from "@/hooks/use-analytics";
import { useRecentAnomalies } from "@/hooks/use-anomalies";

const Dashboard = () => {
  const [timeframe, setTimeframe] = useState("today");
  
  // Fetch analytics data
  const { data: latestAnalytics, isLoading: isLoadingAnalytics, error: analyticsError } = useLatestAnalytics();
  
  // Fetch analytics data for the past 7 days (for charts)
  const { data: pastWeekAnalytics, isLoading: isLoadingPastData } = useAnalyticsForPastDays(7);
  
  // Fetch recent anomalies
  const { data: recentAnomalies, isLoading: isLoadingAnomalies, error: anomaliesError } = useRecentAnomalies(4);

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

  // Handle errors
  if (analyticsError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error loading analytics data</AlertTitle>
        <AlertDescription>
          There was an error loading the dashboard data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Anomaly Detection Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
        </div>
      </div>
      
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {isLoadingAnalytics ? (
          // Loading state placeholders
          <>
            <Card className="animate-delay-100"><CardContent className="p-6"><Skeleton className="h-20 w-full" /></CardContent></Card>
            <Card className="animate-delay-200"><CardContent className="p-6"><Skeleton className="h-20 w-full" /></CardContent></Card>
            <Card className="animate-delay-300"><CardContent className="p-6"><Skeleton className="h-20 w-full" /></CardContent></Card>
            <Card className="animate-delay-400"><CardContent className="p-6"><Skeleton className="h-20 w-full" /></CardContent></Card>
          </>
        ) : (
          // Render metrics cards with real data
          <>
            <MetricsCard
              title="Ad Spend"
              value={`$${latestAnalytics?.total_ad_spend.toLocaleString()}`}
              trend={{ 
                value: 8.2, // Calculate this from historical data
                isPositive: true 
              }}
              icon={<DollarSign className="h-4 w-4" />}
              className="animate-delay-100"
            />
            <MetricsCard
              title="Anomalies Detected"
              value={String(latestAnalytics?.anomalies_detected || 0)}
              trend={{ 
                value: 3.5, // Calculate this from historical data
                isPositive: false 
              }}
              icon={<AlertTriangle className="h-4 w-4" />}
              className="animate-delay-200"
            />
            <MetricsCard
              title="Fraud Prevention"
              value={`$${latestAnalytics?.fraud_prevention_amount.toLocaleString()}`}
              trend={{ 
                value: 15.8, // Calculate this from historical data
                isPositive: true 
              }}
              icon={<Shield className="h-4 w-4" />}
              className="animate-delay-300"
            />
            <MetricsCard
              title="Forecast Accuracy"
              value={`${latestAnalytics?.forecast_accuracy}%`}
              trend={{ 
                value: 2.1, // Calculate this from historical data
                isPositive: true 
              }}
              icon={<TrendingUp className="h-4 w-4" />}
              className="animate-delay-400"
            />
          </>
        )}
      </div>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AnalyticsChart 
            title="Ad Spend vs. Forecast" 
            type="adSpend" 
            className="animate-delay-100" 
            // Pass the real data to the chart
            data={pastWeekAnalytics}
            isLoading={isLoadingPastData}
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
            {isLoadingAnomalies ? (
              // Loading state for anomalies
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-card border rounded-lg p-3">
                    <Skeleton className="h-4 w-1/3 mb-2" />
                    <Skeleton className="h-3 w-1/4 mb-3" />
                    <div className="grid grid-cols-2 gap-2">
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Render anomalies with real data
              <div className="space-y-4">
                {recentAnomalies?.map((anomaly) => (
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
                        <span className="font-medium text-red-600">${anomaly.value.toLocaleString()}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Expected: </span>
                        <span className="font-medium">${anomaly.expected.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Show message if no anomalies */}
                {recentAnomalies?.length === 0 && (
                  <div className="text-center p-6 text-muted-foreground">
                    <p>No anomalies detected recently.</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <AnalyticsChart 
          title="Hourly Anomaly Detection" 
          type="clicks" 
          className="animate-delay-100"
          data={pastWeekAnalytics}
          isLoading={isLoadingPastData}
        />
        <AnalyticsChart 
          title="Campaign Performance" 
          type="adSpend"
          chartType="bar" 
          className="animate-delay-200"
          data={pastWeekAnalytics}
          isLoading={isLoadingPastData}
        />
      </div>
    </div>
  );
};

export default Dashboard;