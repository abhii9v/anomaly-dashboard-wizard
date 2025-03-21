import { useState, useEffect, useMemo, useCallback } from "react";
import { 
  DollarSign, 
  AlertTriangle, 
  TrendingUp, 
  Shield,
  Clock,
  Calendar
} from "lucide-react";
import { AnalyticsChart } from "@/components/dashboard/analytics-chart";
import { MetricsCard } from "@/components/dashboard/metrics-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

// Import the hooks
import { useLatestAnalytics, useAnalyticsForPastDays } from "@/hooks/use-analytics";
import { 
  useRecentAnomalies,
  useForecastComparison,
  getAnomalySeverityColor
} from "@/hooks/use-anomalies";

const Dashboard = () => {
  const [timeframe, setTimeframe] = useState("7d");
  const [chartView, setChartView] = useState("composed");
  
  // Calculate date range based on timeframe - memoized to prevent recalculation
  const { startDate, endDate } = useMemo(() => {
    const end = new Date();
    const start = new Date();
    
    switch (timeframe) {
      case "24h":
        start.setHours(start.getHours() - 24);
        break;
      case "3d":
        start.setDate(start.getDate() - 3);
        break;
      case "7d":
        start.setDate(start.getDate() - 7);
        break;
      case "30d":
        start.setDate(start.getDate() - 30);
        break;
      default:
        start.setDate(start.getDate() - 7);
    }
    
    return {
      startDate: start.toISOString(),
      endDate: end.toISOString()
    };
  }, [timeframe]);
  
  // Fetch analytics data
  const { 
    data: latestAnalytics, 
    isLoading: isLoadingAnalytics, 
    error: analyticsError 
  } = useLatestAnalytics();
  
  // Calculate number of past days to fetch based on timeframe
  const pastDays = useMemo(() => {
    if (timeframe === "30d") return 30;
    if (timeframe === "7d") return 7;
    if (timeframe === "3d") return 3;
    return 1;
  }, [timeframe]);
  
  // Fetch analytics data for the past days
  const { 
    data: pastWeekAnalytics, 
    isLoading: isLoadingPastData 
  } = useAnalyticsForPastDays(pastDays);
  
  // Fetch recent anomalies
  const { 
    data: recentAnomalies, 
    isLoading: isLoadingAnomalies
  } = useRecentAnomalies(4);
  
  // Fetch forecast comparison data
  const { 
    data: forecastData, 
    isLoading: isLoadingForecast, 
    error: forecastError 
  } = useForecastComparison(
    undefined, // campaignId
    startDate,
    endDate
  );

  // Calculate current anomalies from forecast data
  const currentAnomaly = useMemo(() => 
    forecastData?.find(item => item.is_anomaly),
    [forecastData]
  );
  
  const latestPerformance = useMemo(() => 
    forecastData?.[0],
    [forecastData]
  );

  // Number of anomalies detected
  const anomalyCount = useMemo(() => 
    forecastData?.filter(d => d.is_anomaly).length || 0,
    [forecastData]
  );

  // Handle errors
  if (analyticsError || forecastError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error loading dashboard data</AlertTitle>
        <AlertDescription>
          {analyticsError?.message || forecastError?.message || "There was an error loading the dashboard data. Please try again later."}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Anomaly Detection Dashboard</h1>
        <div className="flex items-center gap-3">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="3d">Last 3 Days</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
          <div className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>
      </div>
      
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {isLoadingAnalytics || isLoadingForecast ? (
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
              title="Current Ad Spend"
              value={latestPerformance?.actual_spend || latestAnalytics?.total_ad_spend || 0}
              comparisonValue={latestPerformance?.forecast_spend || 0}
              comparisonLabel="Forecast"
              anomalyData={latestPerformance?.is_anomaly ? {
                isAnomaly: true,
                level: latestPerformance.threshold_exceeded as 'L1' | 'L2' | 'L3',
                percentageDiff: latestPerformance.percentage_difference
              } : undefined}
              icon={<DollarSign className="h-4 w-4" />}
              className="animate-delay-100"
            />
            <MetricsCard
              title="Anomalies Detected"
              value={anomalyCount}
              trend={{ 
                value: 3.5, // Sample value - replace with actual calculation
                isPositive: false 
              }}
              icon={<AlertTriangle className="h-4 w-4" />}
              className="animate-delay-200"
            />
            <MetricsCard
              title="Fraud Prevention"
              value={latestAnalytics?.fraud_prevention_amount || 0}
              trend={{ 
                value: 15.8, // Sample value - replace with actual calculation
                isPositive: true 
              }}
              icon={<Shield className="h-4 w-4" />}
              className="animate-delay-300"
            />
            <MetricsCard
              title="Forecast Accuracy"
              value={latestAnalytics?.forecast_accuracy || 0}
              trend={{ 
                value: 2.1, // Sample value - replace with actual calculation
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Ad Spend vs. Forecast</CardTitle>
              <div className="flex items-center gap-2">
                <Tabs value={chartView} onValueChange={setChartView}>
                  <TabsList className="grid grid-cols-3 h-8">
                    <TabsTrigger value="composed" className="text-xs px-2">Combined</TabsTrigger>
                    <TabsTrigger value="line" className="text-xs px-2">Line</TabsTrigger>
                    <TabsTrigger value="area" className="text-xs px-2">Area</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingForecast ? (
                <div className="flex items-center justify-center h-[300px]">
                  <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                </div>
              ) : forecastData && forecastData.length > 0 ? (
                <AnalyticsChart 
                  title="" 
                  type="forecast" 
                  chartType={chartView as any}
                  className="animate-delay-100" 
                  data={forecastData}
                  showThresholds={true}
                />
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  <p>No forecast data available for the selected time period</p>
                </div>
              )}
            </CardContent>
          </Card>
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
                {/* Show detected anomalies from forecast data first */}
                {forecastData?.filter(item => item.is_anomaly).slice(0, 2).map((anomaly, idx) => (
                  <div key={`forecast-${idx}`} className="bg-card border rounded-lg p-3 hover:shadow-sm transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">
                          {anomaly.campaign_name || `Ad Item ${anomaly.ad_item_id}`}
                        </div>
                        <div className="flex items-center mt-1 text-sm text-muted-foreground">
                          <Calendar className="mr-1 h-3 w-3" />
                          {new Date(anomaly.date_time).toLocaleString()}
                        </div>
                      </div>
                      <Badge variant="outline" className={getAnomalySeverityColor(anomaly.severity)}>
                        {anomaly.severity}
                      </Badge>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Actual: </span>
                        <span className="font-medium text-red-600">${anomaly.actual_spend.toFixed(2)}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Forecast: </span>
                        <span className="font-medium">${anomaly.forecast_spend.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Then show the regular anomalies */}
                {recentAnomalies?.slice(0, 4 - (forecastData?.filter(item => item.is_anomaly).slice(0, 2).length || 0)).map((anomaly) => (
                  <div key={anomaly.id} className="bg-card border rounded-lg p-3 hover:shadow-sm transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{anomaly.campaign}</div>
                        <div className="flex items-center mt-1 text-sm text-muted-foreground">
                          <Clock className="mr-1 h-3 w-3" />
                          {anomaly.time}
                        </div>
                      </div>
                      <Badge variant="outline" className={getAnomalySeverityColor(anomaly.severity)}>
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
                {(!recentAnomalies || recentAnomalies.length === 0) && 
                 (!forecastData || forecastData.filter(item => item.is_anomaly).length === 0) && (
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
        <Card>
          <CardHeader>
            <CardTitle>Hourly Performance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingForecast ? (
              <div className="flex items-center justify-center h-[300px]">
                <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              </div>
            ) : forecastData && forecastData.length > 0 ? (
              <AnalyticsChart 
                title="" 
                type="forecast"
                chartType="line" 
                data={forecastData.slice(0, 24)}
              />
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                <p>No hourly data available</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingPastData ? (
              <div className="flex items-center justify-center h-[300px]">
                <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              </div>
            ) : pastWeekAnalytics && pastWeekAnalytics.length > 0 ? (
              <AnalyticsChart 
                title=""
                type="adSpend"
                chartType="bar" 
                data={pastWeekAnalytics}
              />
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                <p>No campaign data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Show active anomalies section only when anomalies are detected */}
      {forecastData && forecastData.filter(item => item.is_anomaly).length > 0 && (
        <Card className="border-l-4 border-amber-500">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
              Active Anomaly Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
              {forecastData.filter(item => item.is_anomaly).slice(0, 3).map((anomaly, idx) => (
                <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{anomaly.campaign_name || `Ad Item ${anomaly.ad_item_id}`}</h3>
                    <Badge variant="outline" className={getAnomalySeverityColor(anomaly.severity)}>
                      {anomaly.threshold_exceeded}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm text-muted-foreground">Actual Spend:</div>
                      <div className="text-sm font-medium">${anomaly.actual_spend.toFixed(2)}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm text-muted-foreground">Forecast:</div>
                      <div className="text-sm font-medium">${anomaly.forecast_spend.toFixed(2)}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm text-muted-foreground">Deviation:</div>
                      <div className="text-sm font-medium text-amber-600">
                        {anomaly.percentage_difference.toFixed(1)}%
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm text-muted-foreground">Time:</div>
                      <div className="text-sm">{new Date(anomaly.date_time).toLocaleTimeString()}</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <Button size="sm" variant="outline">View Details</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;