// src/components/dashboard/alert-demo-button.tsx
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertDialogAdSpend } from '@/components/ui/alert-dialog-ad-spend';

const mockAlertData = [
  { level: 'L1', users: ['Keval Shah', 'Clarissa Coetzee', 'Pulkit Bansal', 'Rahul Singh', 'Namanpreet Singh'], sla: '5 min' },
  { level: 'L2', users: ['Cristopher Manriquez', 'Ankit Gupta'], sla: '15 min' },
  { level: 'L3', users: ['Shobhit Khandelwal', 'Sandeep Chandrashekhar'], sla: '30 min' },
];

export const AlertDemoButton = () => {
  const [showAlertDemo, setShowAlertDemo] = useState(false);
  const [alertLevel, setAlertLevel] = useState<'L1' | 'L2' | 'L3' | null>(null);

  useEffect(() => {
    if (showAlertDemo) {
      const timer = setTimeout(() => {
        if (alertLevel === 'L1') {
          setAlertLevel('L2');
        } else if (alertLevel === 'L2') {
          setAlertLevel('L3');
        }
      }, 12000);

      return () => clearTimeout(timer);
    }
  }, [showAlertDemo, alertLevel]);

  const triggerAlertDemo = () => {
    setTimeout(() => {
      setAlertLevel('L1');
      setShowAlertDemo(true);
    }, 5000);
  };

  const handleClose = () => {
    setShowAlertDemo(false);
    setAlertLevel(null);
  };

  return (
    <>
      <Button onClick={triggerAlertDemo}>Boost Ad Spend</Button>

      {showAlertDemo && (
        <AlertDialogAdSpend
          level={alertLevel!}
          onClose={handleClose}
          eventName="Anomaly"
          currentSpend={42000}
          threshold={alertLevel === 'L1' ? 20000 : alertLevel === 'L2' ? 30000 : 40000}
          teamUsers={mockAlertData.find(data => data.level === alertLevel)?.users || []}
          sla={mockAlertData.find(data => data.level === alertLevel)?.sla || ''}
        />
      )}
    </>
  );
};