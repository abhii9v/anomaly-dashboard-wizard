
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataCard } from "@/components/ui/data-card";
import { AlertOctagon, ArrowRight, Clock, DollarSign, FileText } from "lucide-react";
import { 
  Line,
  LineChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  TooltipProps,
  Legend
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";

// Mock data for incidents
const incidents = [
  {
    id: 1,
    title: "Database Server Outage",
    description: "Primary database server cluster went offline due to power failure at the data center",
    date: "2023-10-15",
    duration: "3h 45m",
    status: "resolved",
    financialLoss: 12500,
    severity: "high",
    affectedSystems: ["Ad Delivery", "Reporting", "Analytics"],
    recoveryTimeline: [
      { time: "00:00", stage: "Incident Detected", progress: 0 },
      { time: "00:30", stage: "Initial Assessment", progress: 20 },
      { time: "01:15", stage: "Backup Systems Activated", progress: 40 },
      { time: "02:30", stage: "Partial Functionality Restored", progress: 70 },
      { time: "03:45", stage: "Full Recovery", progress: 100 },
    ],
    recommendations: [
      "Implement redundant power systems at data center",
      "Review and update disaster recovery plan",
      "Conduct monthly backup verification tests"
    ]
  },
  {
    id: 2,
    title: "Ad Serving API Failure",
    description: "Critical failure in ad serving API causing no ads to be displayed for premium campaigns",
    date: "2023-11-02",
    duration: "1h 15m",
    status: "resolved",
    financialLoss: 8200,
    severity: "medium",
    affectedSystems: ["Ad Delivery", "Reporting"],
    recoveryTimeline: [
      { time: "00:00", stage: "Incident Detected", progress: 0 },
      { time: "00:15", stage: "Initial Assessment", progress: 20 },
      { time: "00:30", stage: "Root Cause Identified", progress: 40 },
      { time: "00:45", stage: "Fix Deployed", progress: 60 },
      { time: "01:15", stage: "Full Recovery", progress: 100 },
    ],
    recommendations: [
      "Implement enhanced monitoring for API endpoints",
      "Add circuit breaker pattern for API calls",
      "Review API rate limiting policies"
    ]
  },
  {
    id: 3,
    title: "Data Pipeline Failure",
    description: "ETL pipeline for campaign performance metrics failed causing reporting delays",
    date: "2023-11-12",
    duration: "5h 30m",
    status: "resolved",
    financialLoss: 4500,
    severity: "low",
    affectedSystems: ["Reporting", "Analytics"],
    recoveryTimeline: [
      { time: "00:00", stage: "Incident Detected", progress: 0 },
      { time: "01:00", stage: "Initial Assessment", progress: 15 },
      { time: "02:30", stage: "Root Cause Identified", progress: 40 },
      { time: "04:00", stage: "Fix Deployed", progress: 75 },
      { time: "05:30", stage: "Full Recovery", progress: 100 },
    ],
    recommendations: [
      "Implement data validation checks at each pipeline stage",
      "Create automated recovery process for pipeline failures",
      "Set up redundant data processing paths"
    ]
  },
  {
    id: 4,
    title: "Authentication Service Disruption",
    description: "User authentication service experienced intermittent failures affecting some campaign managers",
    date: "2023-11-25",
    duration: "2h 10m",
    status: "resolved",
    financialLoss: 2800,
    severity: "low",
    affectedSystems: ["User Access", "Campaign Management"],
    recoveryTimeline: [
      { time: "00:00", stage: "Incident Detected", progress: 0 },
      { time: "00:30", stage: "Initial Assessment", progress: 25 },
      { time: "01:15", stage: "Temporary Fix Applied", progress: 60 },
      { time: "02:10", stage: "Full Recovery", progress: 100 },
    ],
    recommendations: [
      "Implement JWT token caching mechanism",
      "Set up multiple authentication service instances",
      "Review connection pooling configuration"
    ]
  }
];

// Function to get badge color based on severity
const getSeverityBadge = (severity: string) => {
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

// Total financial impact calculation
const totalFinancialImpact = incidents.reduce((sum, incident) => sum + incident.financialLoss, 0);
const averageResolutionTime = incidents.reduce((sum, incident) => {
  const timeStr = incident.duration;
  const hours = parseInt(timeStr.split('h')[0]);
  const minutes = parseInt(timeStr.split(' ')[1].split('m')[0]);
  return sum + (hours * 60 + minutes);
}, 0) / incidents.length / 60;

const DisasterRecovery = () => {
  const [selectedIncident, setSelectedIncident] = useState(incidents[0]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Disaster Recovery Management</h1>
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <DataCard
          title="Total Incidents"
          value={incidents.length.toString()}
          icon={<AlertOctagon className="h-4 w-4" />}
          className="animate-delay-100"
        />
        <DataCard
          title="Financial Impact"
          value={`$${totalFinancialImpact.toLocaleString()}`}
          icon={<DollarSign className="h-4 w-4" />}
          className="animate-delay-200"
        />
        <DataCard
          title="Avg. Resolution Time"
          value={`${averageResolutionTime.toFixed(1)}h`}
          icon={<Clock className="h-4 w-4" />}
          className="animate-delay-300"
        />
        <DataCard
          title="Systems Affected"
          value="4"
          icon={<FileText className="h-4 w-4" />}
          className="animate-delay-400"
        />
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Incidents List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Recent Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {incidents.map((incident) => (
                <div 
                  key={incident.id} 
                  className={`p-4 border rounded-md cursor-pointer transition-all hover:shadow-md ${selectedIncident.id === incident.id ? 'border-primary bg-accent/10' : ''}`}
                  onClick={() => setSelectedIncident(incident)}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{incident.title}</h3>
                    <Badge variant="outline" className={getSeverityBadge(incident.severity)}>
                      {incident.severity}
                    </Badge>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <p>{incident.date} • {incident.duration}</p>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-sm font-medium">${incident.financialLoss.toLocaleString()}</span>
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      View Details <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Incident Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{selectedIncident.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="details">Incident Details</TabsTrigger>
                <TabsTrigger value="timeline">Recovery Timeline</TabsTrigger>
                <TabsTrigger value="insights">Actionable Insights</TabsTrigger>
              </TabsList>
              
              {/* Details Tab */}
              <TabsContent value="details">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Description</h4>
                    <p>{selectedIncident.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Date & Duration</h4>
                      <p>{selectedIncident.date} • {selectedIncident.duration}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Financial Loss</h4>
                      <p className="text-xl font-bold text-red-600">${selectedIncident.financialLoss.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Affected Systems</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedIncident.affectedSystems.map((system) => (
                        <Badge key={system} variant="outline">{system}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Timeline Tab */}
              <TabsContent value="timeline">
                <div className="space-y-4">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={selectedIncident.recoveryTimeline}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="progress" 
                          name="Recovery Progress (%)" 
                          stroke="#2563eb" 
                          strokeWidth={2} 
                          dot={{ r: 4 }} 
                          activeDot={{ r: 6 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Recovery Milestones</h4>
                    <div className="space-y-3">
                      {selectedIncident.recoveryTimeline.map((milestone, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-16 text-sm text-muted-foreground">{milestone.time}</div>
                          <div className={`h-2 w-2 rounded-full ${
                            milestone.progress === 100 ? 'bg-green-500' : 
                            milestone.progress > 50 ? 'bg-blue-500' : 
                            milestone.progress > 20 ? 'bg-amber-500' : 'bg-red-500'
                          }`}></div>
                          <div className="ml-2">{milestone.stage}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Insights Tab */}
              <TabsContent value="insights">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">AI-Generated Recommendations</h4>
                  <div className="space-y-3">
                    {selectedIncident.recommendations.map((recommendation, index) => (
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
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Risk Assessment</h4>
                    <p>Based on historical data and the nature of this incident, there is a <span className="font-medium">moderate</span> likelihood of recurrence in the next 30 days.</p>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                      <div className="flex justify-between text-xs mt-1">
                        <span>Low Risk</span>
                        <span>High Risk</span>
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

export default DisasterRecovery;
