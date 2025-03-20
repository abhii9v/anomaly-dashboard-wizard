
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, AlertTriangle, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AlertDialogAdSpendProps {
  level: 'L1' | 'L2' | 'L3';
  onClose: () => void;
  eventName: string;
  currentSpend: number;
  threshold: number;
  teamUsers: string[];
  sla: string;
}

export const AlertDialogAdSpend = ({
  level,
  onClose,
  eventName,
  currentSpend,
  threshold,
  teamUsers,
  sla
}: AlertDialogAdSpendProps) => {
  const [showStopOptions, setShowStopOptions] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md animate-in fade-in zoom-in duration-300">
        <CardHeader className={`${
          level === 'L3' ? 'bg-red-100' : 
          level === 'L2' ? 'bg-amber-100' : 'bg-blue-100'
        }`}>
          <CardTitle className="flex items-center">
            {level === 'L3' ? (
              <ShieldAlert className="h-5 w-5 mr-2 text-red-700" />
            ) : level === 'L2' ? (
              <AlertTriangle className="h-5 w-5 mr-2 text-amber-700" />
            ) : (
              <Bell className="h-5 w-5 mr-2 text-blue-700" />
            )}
            {level === 'L3' ? 'CRITICAL ALERT' : level === 'L2' ? 'URGENT ALERT' : 'MONITORING ALERT'}
          </CardTitle>
          <CardDescription>
            {level === 'L3' 
              ? 'Ad spend has reached critical threshold!' 
              : level === 'L2' 
                ? 'Ad spend requires immediate attention'
                : 'Ad spend threshold reached, monitoring required'}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold mb-2">Alert Details</h4>
              <p className="text-sm">
                {eventName} event has {level === 'L3' ? 'exceeded' : 'reached'} the {level} alert threshold for ad spend.
              </p>
              <p className="text-sm mt-2">
                Current Ad Spend: ${currentSpend.toLocaleString()}
              </p>
              <p className="text-sm mt-1">
                Threshold: ${threshold.toLocaleString()}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">Responsible Team Members</h4>
              <div className="space-y-1">
                {teamUsers.map((user, i) => (
                  <div key={i} className="text-sm flex items-center">
                    <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                    {user}
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Response SLA: {sla}
              </p>
            </div>

            {level === 'L3' && !showStopOptions && (
              <div className="pt-2 border-t">
                <h4 className="text-sm font-semibold mb-3">Action Required</h4>
                <div className="flex gap-3">
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => setShowStopOptions(true)}
                  >
                    Stop Ads
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={onClose}>
                    Continue Monitoring
                  </Button>
                </div>
              </div>
            )}

            {level === 'L3' && showStopOptions && (
              <div className="pt-2 border-t">
                <h4 className="text-sm font-semibold mb-3">Confirm Ad Stop</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Are you sure you want to stop all ads for this event? This will prevent any further ad spend.
                </p>
                <div className="flex gap-3">
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="flex-1"
                    onClick={onClose}
                  >
                    Yes, Stop All Ads
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1" 
                    onClick={() => setShowStopOptions(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {(level !== 'L3' || showStopOptions) && (
              <div className="flex justify-end pt-2">
                <Button variant="ghost" size="sm" onClick={onClose}>
                  {showStopOptions ? "Back" : "Close"}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
