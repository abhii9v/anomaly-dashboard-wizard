import { useState } from "react";
import { 
  AlertTriangle,
  Clock,
  Filter,
  CheckCircle
} from "lucide-react";
import { 
  Card, CardContent, CardDescription, 
  CardHeader, CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataCard } from "@/components/ui/data-card";
import { 
  useIncidents, 
  useIncidentStatistics,
  useUpdateIncidentStatus
} from "@/hooks/use-incidents";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Function to get severity badge color
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

const IncidentManager = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const { toast } = useToast();
  
  // Fetch incidents based on active filter
  const { 
    data: incidents, 
    isLoading: isLoadingIncidents, 
    error: incidentsError 
  } = useIncidents(
    activeFilter === "open" 
      ? "open" 
      : activeFilter === "resolved" 
        ? "resolved" 
        : activeFilter === "false-positive" 
          ? "false-positive" 
          : undefined
  );

  // Fetch incident statistics
  const { 
    data: statistics, 
    isLoading: isLoadingStatistics 
  } = useIncidentStatistics();

  // Mutation hook for updating incident status
  const updateIncidentStatus = useUpdateIncidentStatus();

  // Handler for updating incident status
  const handleStatusUpdate = async (id: number, newStatus: string) => {
    try {
      await updateIncidentStatus.mutateAsync({ id, status: newStatus });
      toast({
        title: "Incident Updated",
        description: `Incident status updated to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update incident status",
        variant: "destructive"
      });
    }
  };

  // Handle errors
  if (incidentsError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error Loading Incidents</AlertTitle>
        <AlertDescription>
          {incidentsError.message || "Unable to fetch incidents. Please try again later."}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Incident Manager</h1>
        <Button>Report Incident</Button>
      </div>
      
      {/* Overview Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {isLoadingStatistics ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className={`animate-delay-${i * 100}`}>
                <CardContent className="p-6">
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            <DataCard
              title="Total Incidents"
              value={statistics?.total.toString() || "0"}
              icon={<AlertTriangle className="h-4 w-4" />}
              className="animate-delay-100"
            />
            <DataCard
              title="Open Incidents"
              value={statistics?.open.toString() || "0"}
              icon={<Clock className="h-4 w-4" />}
              className="animate-delay-200"
            />
            <DataCard
              title="Resolved"
              value={statistics?.resolved.toString() || "0"}
              icon={<Clock className="h-4 w-4" />}
              className="animate-delay-300"
            />
            <DataCard
              title="False Positives"
              value={statistics?.falsePositives.toString() || "0"}
              icon={<Clock className="h-4 w-4" />}
              className="animate-delay-400"
            />
          </>
        )}
      </div>
      
      {/* Filter Buttons */}
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
      
      {/* Incidents Grid */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {isLoadingIncidents ? (
          // Loading state
          <>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card 
                key={i} 
                className={cn(
                  "transition-all duration-300 hover:shadow-md",
                  "animate-fade-in",
                  {
                    "animate-delay-100": i % 3 === 0,
                    "animate-delay-200": i % 3 === 1,
                    "animate-delay-300": i % 3 === 2,
                  }
                )}
              >
                <CardContent className="p-6">
                  <Skeleton className="h-24 w-full" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : incidents && incidents.length > 0 ? (
          incidents.map((incident, index) => (
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
                    <span>{new Date(incident.detected_at).toLocaleString()}</span>
                  </CardDescription>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge variant="outline" className={getSeverityColor(incident.severity)}>
                    {incident.severity}
                  </Badge>
                  <Badge variant="outline" className={getStatusColor(incident.status)}>
                    {incident.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {incident.description}
                </p>
                
                <div className="flex justify-between items-center">
                  <Badge variant="outline">
                    {incident.affected_users ? 
                      `${incident.affected_users} affected user${incident.affected_users > 1 ? 's' : ''}` 
                      : 'No users affected'}
                  </Badge>
                  
                  {incident.financial_loss && (
                    <div className="text-sm font-medium text-red-600">
                      ${incident.financial_loss.toLocaleString()}
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end gap-2 pt-2">
                  {(incident.status === "open" || incident.status === "investigating") && (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleStatusUpdate(incident.id, "investigating")}
                      >
                        Investigate
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleStatusUpdate(incident.id, "resolved")}
                      >
                        Resolve
                      </Button>
                    </>
                  )}
                  {incident.status === "resolved" && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleStatusUpdate(incident.id, "false-positive")}
                    >
                      Mark as False Positive
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          // No incidents found
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