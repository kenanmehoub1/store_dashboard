// components/DashboardCard.tsx
"use client";

interface DashboardCardProps {
  title: string;
  value?: number | string;
  icon?: React.ReactNode;
  isBreakdown?: boolean;
  breakdownData?: {
    label: string;
    value: number;
    color: string;
  }[];
}

const getColorClass = (color: string) => {
  switch (color) {
    case 'green':
      return 'bg-green-500';
    case 'yellow':
      return 'bg-yellow-500';
    case 'blue':
      return 'bg-blue-500';
    case 'red':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

export function DashboardCard({ 
  title, 
  value, 
  icon, 
  isBreakdown = false,
  breakdownData 
}: DashboardCardProps) {
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xs text-muted-foreground uppercase tracking-wider">
          {title}
        </h3>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </div>
      
      {!isBreakdown ? (
        <div className="text-left">
          <p className="text-3xl font-bold text-card-foreground">
            {value}
          </p>
        </div>
      ) : (
        <div className="space-y-3 mt-2">
          {breakdownData?.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getColorClass(item.color)}`}></div>
                <span className="text-sm text-muted-foreground">
                  {item.label}
                </span>
              </div>
              <span className="text-sm font-semibold text-card-foreground">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}