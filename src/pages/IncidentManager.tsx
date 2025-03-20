
import { useState } from "react";
import { 
  Card, CardContent, CardDescription, 
  CardHeader, CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Clock,
  Shield,
  CheckCircle,
  XCircle,
  Filter
} from "lucide-react";
import { DataCard } from "@/components/ui/data-card";
import { cn } from "@/lib/utils";

// Generate sample incidents
const generateIncidents = () => {
  const incidents = [];
  const types = ["suspicious-login", "data-access", "api-abuse", "ddos-attempt"];
  const severities = ["critical", "high", "medium", "low"];
  const statuses = ["open", "investigating", "resolved", "false-positive"];
  
  for (let i = 1; i <= 6; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const detected = new Date(Date.now() - Math.floor(Math.random() * 86400000 * 5));
    
    incidents.push({
      id: i,
      title: `Incident #${i}: ${type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}`,
      type,
      severity,
      status,
      detectedAt: detected.toLocaleString(),
      description: `Detected unusual activity related to ${type.replace(/-/g, ' ')}.`,
      affectedUsers: Math.floor(Math.random() * 20) + 1,
    });
  }
  
  return incidents;
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "critical":
      return "bg-rose-100 text-rose-800 hover:bg-rose-200";
    case "high":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    case "medium":
      return "bg-amber-100 text-amber-800 hover:bg-amber-200";
    case "low":
      return "bg-emerald-100 text-emerald-800 hover:bg-emerald-200";
    default:
      return "bg-slate-100 text-slate-800 hover:bg-slate-200";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "open":
      return "bg-sky-100 text-sky-800 hover:bg-sky-200";
    case "investigating":
      return "bg-purple-100 text-purple-800 hover:bg-purple-200";
    case "resolved":
      return "bg-emerald-100 text-emerald-800 hover:bg-emerald-200";
    case "false-positive":
      return "bg-slate-100 text-slate-800 hover:bg-slate-200";
    default:
      return "bg-slate-100 text-slate-800 hover:bg-slate-200";
  }
};

const getIncidentIcon = (type: string) => {
  switch (type) {
    case "suspicious-login":
      return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    case "data-access":
      return <Shield className="h-5 w-5 text-purple-500" />;
    case "api-abuse":
      return <XCircle className="h-5 w-5 text-rose-500" />;
    case "ddos-attempt":
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    default:
      return <AlertTriangle className="h-5 w-5 text-amber-500" />;
  }
};

const IncidentManager = () => {
  const [incidents] = useState(generateIncidents());
  const [activeFilter, setActiveFilter] = useState("all");
  
  const filteredIncidents = activeFilter === "all" 
    ? incidents 
    : incidents.filter(incident => 
        activeFilter === "open" 
          ? incident.status === "open" || incident.status === "investigating"
          : incident.status === activeFilter
      );
  
  const openCount = incidents.filter(incident => 
    incident.status === "open" || incident.status === "investigating"
  ).length;
  
  const resolvedCount = incidents.filter(incident => 
    incident.status === "resolved"
  ).length;
  
  const falsePositiveCount = incidents.filter(incident => 
    incident.status === "false-positive"
  ).length;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Incident Manager</h1>
        <Button>Report Incident</Button>
      </div>
      
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <DataCard
          title="Open Incidents"
          icon={<Clock className="h-4 w-4" />}
          className="animate-fade-in animate-delay-100"
        >
          <div className="text-2xl font-bold">{openCount}</div>
          <div className="mt-2 text-xs text-muted-foreground">
            {incidents.filter(i => i.status === "investigating").length} currently investigating
          </div>
        </DataCard>
        
        <DataCard
          title="Critical Incidents"
          icon={<AlertTriangle className="h-4 w-4" />}
          className="animate-fade-in animate-delay-200"
        >
          <div className="text-2xl font-bold">
            {incidents.filter(i => i.severity === "critical").length}
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            {incidents.filter(i => i.severity === "critical" && (i.status === "open" || i.status === "investigating")).length} need attention
          </div>
        </DataCard>
        
        <DataCard
          title="Resolved"
          icon={<CheckCircle className="h-4 w-4" />}
          className="animate-fade-in animate-delay-300"
        >
          <div className="text-2xl font-bold">{resolvedCount}</div>
          <div className="mt-2 text-xs text-muted-foreground">
            In the last 30 days
          </div>
        </DataCard>
        
        <DataCard
          title="False Positives"
          icon={<XCircle className="h-4 w-4" />}
          className="animate-fade-in animate-delay-400"
        >
          <div className="text-2xl font-bold">{falsePositiveCount}</div>
          <div className="mt-2 text-xs text-muted-foreground">
            {Math.round((falsePositiveCount / incidents.length) * 100)}% of total incidents
          </div>
        </DataCard>
      </div>
      
      <div className="flex gap-3 items-center flex-wrap">
        <Button 
          variant={activeFilter === "all" ? "default" : "outline"} 
          size="sm"
          onClick={() => setActiveFilter("all")}
        >
          All
        </Button>
        <Button 
          variant={activeFilter === "open" ? "default" : "outline"} 
          size="sm"
          onClick={() => setActiveFilter("open")}
        >
          Open
        </Button>
        <Button 
          variant={activeFilter === "resolved" ? "default" : "outline"} 
          size="sm"
          onClick={() => setActiveFilter("resolved")}
        >
          Resolved
        </Button>
        <Button 
          variant={activeFilter === "false-positive" ? "default" : "outline"} 
          size="sm"
          onClick={() => setActiveFilter("false-positive")}
        >
          False Positive
        </Button>
        <Button variant="outline" size="icon" className="ml-auto">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredIncidents.map((incident, index) => (
          <Card 
            key={incident.id}
            className={cn(
              "transition-all duration-300 hover:shadow-md",
              "animate-fade-in",
              {
                "animate-delay-100": index % 3 === 0,
                "animate-delay-200": index % 3 === 1,
                "animate-delay-300": index % 3 === 2,
              }
            )}
          >
            <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="text-base font-medium">
                  {incident.title}
                </CardTitle>
                <CardDescription className="flex items-center mt-1">
                  <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                  <span>{incident.detectedAt}</span>
                </CardDescription>
              </div>
              {getIncidentIcon(incident.type)}
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{incident.description}</p>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className={getSeverityColor(incident.severity)}>
                  {incident.severity}
                </Badge>
                <Badge variant="outline" className={getStatusColor(incident.status)}>
                  {incident.status}
                </Badge>
                <Badge variant="outline">
                  {incident.affectedUsers} affected user{incident.affectedUsers > 1 ? 's' : ''}
                </Badge>
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm">Details</Button>
                {(incident.status === "open" || incident.status === "investigating") && (
                  <Button size="sm">Investigate</Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredIncidents.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center p-10 text-center">
              <CheckCircle className="h-12 w-12 text-emerald-500 mb-4" />
              <h3 className="text-lg font-medium">No incidents found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                There are no incidents matching your current filter.
              </p>
              <Button className="mt-4" onClick={() => setActiveFilter("all")}>
                View all incidents
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default IncidentManager;
