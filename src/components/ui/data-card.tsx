
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface DataCardProps {
  title: string;
  value?: string | number;
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

export const DataCard = ({
  title,
  value,
  icon,
  children,
  className,
  headerClassName,
  contentClassName,
}: DataCardProps) => {
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-200 hover:shadow-md", 
        className
      )}
    >
      <CardHeader 
        className={cn(
          "flex flex-row items-center justify-between space-y-0 pb-2",
          headerClassName
        )}
      >
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className="h-5 w-5 text-muted-foreground">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent className={cn("p-6 pt-0", contentClassName)}>
        {value && (
          <div className="text-2xl font-bold">{value}</div>
        )}
        {children}
      </CardContent>
    </Card>
  );
};
