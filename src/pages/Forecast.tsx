
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { 
  Calendar, 
  ChevronRight, 
  DollarSign, 
  LineChart as LineChartIcon, 
  Truck, 
  Users, 
  AlertTriangle,
  Bell,
  CheckCircle,
  ShieldAlert
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataCard } from "@/components/ui/data-card";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis, 
  Legend 
} from "recharts";

// Mock data for forecast events
const forecastEvents = [
  {
    id: 1,
    name: "Black Friday",
    date: "2023-11-24",
    daysUntil: 7,
    expectedTraffic: 350000,
    expectedRevenue: 1200000,
    expectedAdSpend: 150000,
    historicalTraffic: 320000,
    historicalRevenue: 980000,
    historicalAdSpend: 120000,
    trafficChange: "+9.4%",
    revenueChange: "+22.4%",
    adSpendChange: "+25.0%",
    priority: "high",
    resources: [
      { name: "Server Capacity", current: 75, required: 95 },
      { name: "Customer Support", current: 60, required: 100 },
      { name: "Inventory Stock", current: 90, required: 100 },
      { name: "Ad Budget", current: 85, required: 100 }
    ],
    hourlyForecast: [
      { hour: "12am", traffic: 8000, revenue: 24000, adSpend: 3000 },
      { hour: "3am", traffic: 5000, revenue: 15000, adSpend: 1500 },
      { hour: "6am", traffic: 15000, revenue: 45000, adSpend: 6000 },
      { hour: "9am", traffic: 40000, revenue: 120000, adSpend: 18000 },
      { hour: "12pm", traffic: 65000, revenue: 195000, adSpend: 28000 },
      { hour: "3pm", traffic: 85000, revenue: 255000, adSpend: 35000 },
      { hour: "6pm", traffic: 75000, revenue: 225000, adSpend: 32000 },
      { hour: "9pm", traffic: 57000, revenue: 171000, adSpend: 26500 }
    ],
    alertLevels: {
      L1: { threshold: 20000, description: "Initial monitoring" },
      L2: { threshold: 30000, description: "Enhanced vigilance required" },
      L3: { threshold: 40000, description: "Critical threshold - Ad pause consideration" }
    },
    recommendations: [
      "Increase server capacity by 20% for the 72-hour period surrounding Black Friday",
      "Schedule additional customer support staff with 24-hour coverage",
      "Implement traffic queuing system for checkout process during peak hours",
      "Prepare backup inventory for top 20 products based on forecast models",
      "Set up automated alerts at 80%, 90%, and 100% of projected ad spend"
    ]
  },
  {
    id: 2,
    name: "Cyber Monday",
    date: "2023-11-27",
    daysUntil: 10,
    expectedTraffic: 320000,
    expectedRevenue: 950000,
    expectedAdSpend: 120000,
    historicalTraffic: 290000,
    historicalRevenue: 870000,
    historicalAdSpend: 100000,
    trafficChange: "+10.3%",
    revenueChange: "+9.2%",
    adSpendChange: "+20.0%",
    priority: "high",
    resources: [
      { name: "Server Capacity", current: 75, required: 90 },
      { name: "Customer Support", current: 60, required: 85 },
      { name: "Inventory Stock", current: 85, required: 95 },
      { name: "Ad Budget", current: 80, required: 95 }
    ],
    hourlyForecast: [
      { hour: "12am", traffic: 10000, revenue: 30000, adSpend: 4000 },
      { hour: "3am", traffic: 7000, revenue: 21000, adSpend: 2500 },
      { hour: "6am", traffic: 18000, revenue: 54000, adSpend: 7000 },
      { hour: "9am", traffic: 45000, revenue: 135000, adSpend: 15000 },
      { hour: "12pm", traffic: 60000, revenue: 180000, adSpend: 22000 },
      { hour: "3pm", traffic: 75000, revenue: 225000, adSpend: 29000 },
      { hour: "6pm", traffic: 68000, revenue: 204000, adSpend: 25000 },
      { hour: "9pm", traffic: 37000, revenue: 111000, adSpend: 15500 }
    ],
    alertLevels: {
      L1: { threshold: 15000, description: "Initial monitoring" },
      L2: { threshold: 25000, description: "Enhanced vigilance required" },
      L3: { threshold: 35000, description: "Critical threshold - Ad pause consideration" }
    },
    recommendations: [
      "Optimize database query performance for product search functionality",
      "Deploy additional API servers to handle increased checkout traffic",
      "Implement caching strategy for product pages to reduce database load",
      "Set up automatic scaling for web services based on traffic thresholds",
      "Configure real-time ad spend monitoring with 15-minute interval checks"
    ]
  },
  {
    id: 3,
    name: "Christmas Shopping Peak",
    date: "2023-12-15",
    daysUntil: 28,
    expectedTraffic: 280000,
    expectedRevenue: 850000,
    expectedAdSpend: 110000,
    historicalTraffic: 265000,
    historicalRevenue: 795000,
    historicalAdSpend: 95000,
    trafficChange: "+5.7%",
    revenueChange: "+6.9%",
    adSpendChange: "+15.8%",
    priority: "medium",
    resources: [
      { name: "Server Capacity", current: 75, required: 85 },
      { name: "Customer Support", current: 60, required: 80 },
      { name: "Inventory Stock", current: 78, required: 90 },
      { name: "Ad Budget", current: 70, required: 90 }
    ],
    hourlyForecast: [
      { hour: "12am", traffic: 5000, revenue: 15000, adSpend: 2000 },
      { hour: "3am", traffic: 4000, revenue: 12000, adSpend: 1500 },
      { hour: "6am", traffic: 12000, revenue: 36000, adSpend: 4500 },
      { hour: "9am", traffic: 35000, revenue: 105000, adSpend: 13000 },
      { hour: "12pm", traffic: 55000, revenue: 165000, adSpend: 22000 },
      { hour: "3pm", traffic: 65000, revenue: 195000, adSpend: 26000 },
      { hour: "6pm", traffic: 60000, revenue: 180000, adSpend: 24000 },
      { hour: "9pm", traffic: 44000, revenue: 132000, adSpend: 17000 }
    ],
    alertLevels: {
      L1: { threshold: 15000, description: "Initial monitoring" },
      L2: { threshold: 22000, description: "Enhanced vigilance required" },
      L3: { threshold: 30000, description: "Critical threshold - Ad pause consideration" }
    },
    recommendations: [
      "Increase holiday-specific product visibility in recommendation engine",
      "Prepare contingency plan for shipping delays due to weather conditions",
      "Implement customer gift-wrapping option with adequate staffing",
      "Update inventory tracking system to account for holiday return policy",
      "Create ad spend safety margins with daily caps during peak periods"
    ]
  },
  {
    id: 4,
    name: "New Year's Sale",
    date: "2023-12-31",
    daysUntil: 44,
    expectedTraffic: 210000,
    expectedRevenue: 620000,
    expectedAdSpend: 80000,
    historicalTraffic: 200000,
    historicalRevenue: 580000,
    historicalAdSpend: 70000,
    trafficChange: "+5.0%",
    revenueChange: "+6.9%",
    adSpendChange: "+14.3%",
    priority: "medium",
    resources: [
      { name: "Server Capacity", current: 75, required: 80 },
      { name: "Customer Support", current: 60, required: 75 },
      { name: "Inventory Stock", current: 70, required: 85 },
      { name: "Ad Budget", current: 65, required: 80 }
    ],
    hourlyForecast: [
      { hour: "12am", traffic: 7000, revenue: 21000, adSpend: 2800 },
      { hour: "3am", traffic: 5000, revenue: 15000, adSpend: 2000 },
      { hour: "6am", traffic: 10000, revenue: 30000, adSpend: 4000 },
      { hour: "9am", traffic: 25000, revenue: 75000, adSpend: 10000 },
      { hour: "12pm", traffic: 42000, revenue: 126000, adSpend: 16800 },
      { hour: "3pm", traffic: 50000, revenue: 150000, adSpend: 20000 },
      { hour: "6pm", traffic: 45000, revenue: 135000, adSpend: 18000 },
      { hour: "9pm", traffic: 26000, revenue: 78000, adSpend: 10400 }
    ],
    alertLevels: {
      L1: { threshold: 10000, description: "Initial monitoring" },
      L2: { threshold: 18000, description: "Enhanced vigilance required" },
      L3: { threshold: 25000, description: "Critical threshold - Ad pause consideration" }
    },
    recommendations: [
      "Focus marketing on clearance inventory with automated email campaigns",
      "Schedule system maintenance during off-peak hours in early January",
      "Prepare for increased mobile traffic with optimized mobile checkout",
      "Implement simplified return process for post-holiday customer service",
      "Design tiered ad spend alerts with appropriate escalation paths"
    ]
  }
];

// Function to get priority badge color
const getPriorityBadge = (priority: string) => {
  switch (priority) {
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

// Calculate totals for overview cards
const totalExpectedTraffic = forecastEvents.reduce((sum, event) => sum + event.expectedTraffic, 0);
const totalExpectedRevenue = forecastEvents.reduce((sum, event) => sum + event.expectedRevenue, 0);
const totalExpectedAdSpend = forecastEvents.reduce((sum, event) => sum + event.expectedAdSpend, 0);

// Mock alert data
const mockAlertData = {
  L1: { users: ["Sarah Johnson", "Emily Wilson"], sla: "5 min" },
  L2: { users: ["Michael Rodriguez", "Jennifer Lee"], sla: "15 min" },
  L3: { users: ["David Chen", "Katherine Taylor"], sla: "30 min" }
};

const Forecast = () => {
  const [selectedEvent, setSelectedEvent] = useState(forecastEvents[0]);
  const [view, setView] = useState<'traffic' | 'revenue' | 'adSpend'>('traffic');
  const [showAlertDemo, setShowAlertDemo] = useState(false);
  const [alertLevel, setAlertLevel] = useState<'L1' | 'L2' | 'L3' | null>(null);

  const triggerAlertDemo = (level: 'L1' | 'L2' | 'L3') => {
    setAlertLevel(level);
    setShowAlertDemo(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Upcoming High Forecasted Days</h1>
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <DataCard
          title="Upcoming Events"
          value={forecastEvents.length.toString()}
          icon={<Calendar className="h-4 w-4" />}
          className="animate-delay-100"
        />
        <DataCard
          title="Expected Traffic"
          value={`${(totalExpectedTraffic / 1000000).toFixed(1)}M`}
          icon={<Users className="h-4 w-4" />}
          className="animate-delay-200"
        />
        <DataCard
          title="Revenue Forecast"
          value={`$${(totalExpectedRevenue / 1000000).toFixed(1)}M`}
          icon={<DollarSign className="h-4 w-4" />}
          className="animate-delay-300"
        />
        <DataCard
          title="Ad Spend Forecast"
          value={`$${(totalExpectedAdSpend / 1000).toFixed(0)}K`}
          icon={<LineChartIcon className="h-4 w-4" />}
          className="animate-delay-400"
        />
      </div>

      {/* Alert Demo Popup */}
      {showAlertDemo && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md animate-in fade-in zoom-in duration-300">
            <CardHeader className={`${
              alertLevel === 'L3' ? 'bg-red-100' : 
              alertLevel === 'L2' ? 'bg-amber-100' : 'bg-blue-100'
            }`}>
              <CardTitle className="flex items-center">
                {alertLevel === 'L3' ? (
                  <ShieldAlert className="h-5 w-5 mr-2 text-red-700" />
                ) : alertLevel === 'L2' ? (
                  <AlertTriangle className="h-5 w-5 mr-2 text-amber-700" />
                ) : (
                  <Bell className="h-5 w-5 mr-2 text-blue-700" />
                )}
                {alertLevel === 'L3' ? 'CRITICAL ALERT' : alertLevel === 'L2' ? 'URGENT ALERT' : 'MONITORING ALERT'}
              </CardTitle>
              <CardDescription>
                {alertLevel === 'L3' 
                  ? 'Ad spend has reached critical threshold!' 
                  : alertLevel === 'L2' 
                    ? 'Ad spend requires immediate attention'
                    : 'Ad spend threshold reached, monitoring required'}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2">Alert Details</h4>
                  <p className="text-sm">
                    {selectedEvent.name} event has {alertLevel === 'L3' ? 'exceeded' : 'reached'} the {alertLevel} alert threshold for ad spend.
                  </p>
                  <p className="text-sm mt-2">
                    Current Ad Spend: ${alertLevel === 'L3' ? '42,500' : alertLevel === 'L2' ? '32,000' : '22,000'}
                  </p>
                  <p className="text-sm mt-1">
                    Threshold: ${alertLevel === 'L3' ? '40,000' : alertLevel === 'L2' ? '30,000' : '20,000'}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2">Responsible Team Members</h4>
                  <div className="space-y-1">
                    {mockAlertData[alertLevel].users.map((user, i) => (
                      <div key={i} className="text-sm flex items-center">
                        <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                        {user}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Response SLA: {mockAlertData[alertLevel].sla}
                  </p>
                </div>

                {alertLevel === 'L3' && (
                  <div className="pt-2 border-t">
                    <h4 className="text-sm font-semibold mb-3">Action Required</h4>
                    <div className="flex gap-3">
                      <Button variant="destructive" size="sm" className="flex-1">
                        Stop Ads
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        Continue Monitoring
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <Button variant="ghost" size="sm" onClick={() => setShowAlertDemo(false)}>
                    Close Demo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Event Calendar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Event Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {forecastEvents.map((event) => (
                <div 
                  key={event.id} 
                  className={`p-4 border rounded-md cursor-pointer transition-all hover:shadow-md ${selectedEvent.id === event.id ? 'border-primary bg-accent/10' : ''}`}
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{event.name}</h3>
                    <Badge variant="outline" className={getPriorityBadge(event.priority)}>
                      {event.priority}
                    </Badge>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <p>{event.date} ({event.daysUntil} days away)</p>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Traffic: </span>
                      <span className="font-medium">{(event.expectedTraffic / 1000).toFixed(0)}k</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Revenue: </span>
                      <span className="font-medium">${(event.expectedRevenue / 1000).toFixed(0)}k</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 px-2 mt-2">
                    View Analysis <ChevronRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Event Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{selectedEvent.name} Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="forecast" className="w-full">
              <TabsList className="w-full grid grid-cols-4">
                <TabsTrigger value="forecast">Visual Forecast</TabsTrigger>
                <TabsTrigger value="impact">Impact Analysis</TabsTrigger>
                <TabsTrigger value="alerts">Ad Spend Alerts</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </TabsList>
              
              {/* Forecast Tab */}
              <TabsContent value="forecast">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">
                      Hourly {
                        view === 'traffic' ? 'Traffic' : 
                        view === 'revenue' ? 'Revenue' : 'Ad Spend'
                      } Forecast
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant={view === 'traffic' ? "default" : "outline"} 
                        size="sm" 
                        onClick={() => setView('traffic')}
                      >
                        Traffic
                      </Button>
                      <Button 
                        variant={view === 'revenue' ? "default" : "outline"} 
                        size="sm" 
                        onClick={() => setView('revenue')}
                      >
                        Revenue
                      </Button>
                      <Button 
                        variant={view === 'adSpend' ? "default" : "outline"} 
                        size="sm" 
                        onClick={() => setView('adSpend')}
                      >
                        Ad Spend
                      </Button>
                    </div>
                  </div>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={selectedEvent.hourlyForecast}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey={view} 
                          name={
                            view === 'traffic' ? 'Visitors' : 
                            view === 'revenue' ? 'Revenue ($)' : 'Ad Spend ($)'
                          } 
                          stroke={
                            view === 'traffic' ? '#2563eb' : 
                            view === 'revenue' ? '#16a34a' : '#d97706'
                          } 
                          strokeWidth={2} 
                          dot={{ r: 4 }} 
                          activeDot={{ r: 6 }} 
                        />
                        {view === 'adSpend' && (
                          <>
                            <Line 
                              type="monotone" 
                              dataKey={() => selectedEvent.alertLevels.L1.threshold} 
                              name="L1 Alert Threshold" 
                              stroke="#3b82f6" 
                              strokeWidth={1} 
                              strokeDasharray="5 5" 
                              dot={false}
                            />
                            <Line 
                              type="monotone" 
                              dataKey={() => selectedEvent.alertLevels.L2.threshold} 
                              name="L2 Alert Threshold" 
                              stroke="#f59e0b" 
                              strokeWidth={1} 
                              strokeDasharray="5 5" 
                              dot={false}
                            />
                            <Line 
                              type="monotone" 
                              dataKey={() => selectedEvent.alertLevels.L3.threshold} 
                              name="L3 Alert Threshold" 
                              stroke="#ef4444" 
                              strokeWidth={1} 
                              strokeDasharray="5 5" 
                              dot={false}
                            />
                          </>
                        )}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Historical Comparison</h3>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Traffic</span>
                            <div>
                              <span className="font-medium">{(selectedEvent.expectedTraffic / 1000).toFixed(0)}k</span>
                              <span className="ml-1 text-green-600">{selectedEvent.trafficChange}</span>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div className="bg-blue-300 h-2 rounded-full" style={{ width: `${(selectedEvent.historicalTraffic / selectedEvent.expectedTraffic) * 100}%` }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Revenue</span>
                            <div>
                              <span className="font-medium">${(selectedEvent.expectedRevenue / 1000).toFixed(0)}k</span>
                              <span className="ml-1 text-green-600">{selectedEvent.revenueChange}</span>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div className="bg-green-300 h-2 rounded-full" style={{ width: `${(selectedEvent.historicalRevenue / selectedEvent.expectedRevenue) * 100}%` }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Ad Spend</span>
                            <div>
                              <span className="font-medium">${(selectedEvent.expectedAdSpend / 1000).toFixed(0)}k</span>
                              <span className="ml-1 text-amber-600">{selectedEvent.adSpendChange}</span>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div className="bg-amber-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div className="bg-amber-300 h-2 rounded-full" style={{ width: `${(selectedEvent.historicalAdSpend / selectedEvent.expectedAdSpend) * 100}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Key Metrics</h3>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-sm text-muted-foreground">Expected Visitors:</dt>
                          <dd className="text-sm font-medium">{selectedEvent.expectedTraffic.toLocaleString()}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-muted-foreground">Expected Revenue:</dt>
                          <dd className="text-sm font-medium">${selectedEvent.expectedRevenue.toLocaleString()}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-muted-foreground">Expected Ad Spend:</dt>
                          <dd className="text-sm font-medium">${selectedEvent.expectedAdSpend.toLocaleString()}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-muted-foreground">ROAS (Return on Ad Spend):</dt>
                          <dd className="text-sm font-medium">{(selectedEvent.expectedRevenue / selectedEvent.expectedAdSpend).toFixed(2)}x</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-muted-foreground">Conversion Rate:</dt>
                          <dd className="text-sm font-medium">3.5%</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Impact Analysis Tab */}
              <TabsContent value="impact">
                <div className="space-y-6">
                  <h3 className="text-sm font-medium mb-2">Resource Requirements</h3>
                  <div className="space-y-4">
                    {selectedEvent.resources.map((resource) => (
                      <div key={resource.name}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">{resource.name}</span>
                          <span className="text-sm font-medium">
                            {resource.current}% / {resource.required}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full">
                          <div 
                            className={`h-2 rounded-full ${
                              resource.current >= resource.required ? 'bg-green-500' : 
                              resource.current >= resource.required * 0.8 ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${resource.current}%` }}
                          ></div>
                        </div>
                        <div className="w-full h-1">
                          <div 
                            className="h-3 border-l-2 border-gray-400"
                            style={{ marginLeft: `${resource.required}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">System Impact Projection</h3>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { name: 'Database Load', current: 40, projected: 85 },
                          { name: 'API Servers', current: 30, projected: 90 },
                          { name: 'Payment Processing', current: 25, projected: 75 },
                          { name: 'Ad Delivery', current: 35, projected: 85 },
                          { name: 'CDN Usage', current: 50, projected: 85 }
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="current" name="Current Usage (%)" fill="#94a3b8" />
                          <Bar dataKey="projected" name="Projected Peak (%)" fill="#2563eb" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Ad Spend Alerts Tab */}
              <TabsContent value="alerts">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Ad Spend Alert Thresholds</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      The following thresholds are set for {selectedEvent.name}. When ad spend reaches these levels, 
                      automated alerts will be triggered to the responsible teams.
                    </p>
                    
                    <div className="space-y-4">
                      <Alert className="border-blue-200 bg-blue-50">
                        <AlertTitle className="flex items-center">
                          <Bell className="h-4 w-4 mr-2 text-blue-700" />
                          Level 1 Alert (${selectedEvent.alertLevels.L1.threshold.toLocaleString()})
                        </AlertTitle>
                        <AlertDescription className="text-sm">
                          {selectedEvent.alertLevels.L1.description}. Notification sent to L1 team members.
                          <div className="mt-2">
                            <Button variant="outline" size="sm" onClick={() => triggerAlertDemo('L1')}>
                              View L1 Alert Demo
                            </Button>
                          </div>
                        </AlertDescription>
                      </Alert>
                      
                      <Alert className="border-amber-200 bg-amber-50">
                        <AlertTitle className="flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-2 text-amber-700" />
                          Level 2 Alert (${selectedEvent.alertLevels.L2.threshold.toLocaleString()})
                        </AlertTitle>
                        <AlertDescription className="text-sm">
                          {selectedEvent.alertLevels.L2.description}. Escalation to L2 team members with urgent popup.
                          <div className="mt-2">
                            <Button variant="outline" size="sm" onClick={() => triggerAlertDemo('L2')}>
                              View L2 Alert Demo
                            </Button>
                          </div>
                        </AlertDescription>
                      </Alert>
                      
                      <Alert className="border-red-200 bg-red-50">
                        <AlertTitle className="flex items-center">
                          <ShieldAlert className="h-4 w-4 mr-2 text-red-700" />
                          Level 3 Alert (${selectedEvent.alertLevels.L3.threshold.toLocaleString()})
                        </AlertTitle>
                        <AlertDescription className="text-sm">
                          {selectedEvent.alertLevels.L3.description}. Critical escalation to L3 team with ad pause option.
                          <div className="mt-2">
                            <Button variant="outline" size="sm" onClick={() => triggerAlertDemo('L3')}>
                              View L3 Alert Demo
                            </Button>
                          </div>
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-sm font-medium mb-2">Responsible Teams</h3>
                    <div className="space-y-2 border rounded-md p-4">
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center">
                          <Badge variant="outline" className="bg-blue-100 text-blue-800 mr-2">L1</Badge>
                          <span>Initial Response Team</span>
                        </div>
                        <span>5 min SLA</span>
                      </div>
                      <div className="text-xs text-muted-foreground ml-10">
                        Sarah Johnson, Emily Wilson
                      </div>
                      
                      <div className="flex justify-between text-sm pt-2">
                        <div className="flex items-center">
                          <Badge variant="outline" className="bg-amber-100 text-amber-800 mr-2">L2</Badge>
                          <span>Technical Support Team</span>
                        </div>
                        <span>15 min SLA</span>
                      </div>
                      <div className="text-xs text-muted-foreground ml-10">
                        Michael Rodriguez, Jennifer Lee
                      </div>
                      
                      <div className="flex justify-between text-sm pt-2">
                        <div className="flex items-center">
                          <Badge variant="outline" className="bg-red-100 text-red-800 mr-2">L3</Badge>
                          <span>Emergency Response Team</span>
                        </div>
                        <span>30 min SLA</span>
                      </div>
                      <div className="text-xs text-muted-foreground ml-10">
                        David Chen, Katherine Taylor
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Recommendations Tab */}
              <TabsContent value="recommendations">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium mb-2">AI-Generated Recommendations</h3>
                  <div className="space-y-3">
                    {selectedEvent.recommendations.map((recommendation, index) => (
                      <div key={index} className="p-3 border rounded-md bg-card">
                        <div className="flex items-start">
                          <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs mr-2 mt-0.5">
                            {index + 1}
                          </div>
                          <p>{recommendation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-sm font-medium mb-2">Readiness Checklist</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input type="checkbox" id="check1" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                        <label htmlFor="check1" className="ml-2 text-sm">Scale infrastructure capacity according to forecast</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="check2" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                        <label htmlFor="check2" className="ml-2 text-sm">Configure ad spend alert thresholds</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="check3" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                        <label htmlFor="check3" className="ml-2 text-sm">Set up enhanced monitoring for critical systems</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="check4" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                        <label htmlFor="check4" className="ml-2 text-sm">Test system with projected peak load simulation</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="check5" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                        <label htmlFor="check5" className="ml-2 text-sm">Brief team on incident response procedures</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="check6" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                        <label htmlFor="check6" className="ml-2 text-sm">Verify ad spend pause mechanisms are fully functional</label>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Forecast;
