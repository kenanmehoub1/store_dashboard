// components/LargeCard.tsx
"use client";

interface LargeCardProps {
  title: string;
  children: React.ReactNode;
  onViewAll?: () => void;
}

export function LargeCard({ title, children, onViewAll }: LargeCardProps) {
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-center p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-card-foreground">
          {title}
        </h3>
        <button
          onClick={onViewAll}
          className="px-4 py-2 text-sm bg-card border border-border rounded-lg hover:bg-muted transition-colors duration-200 text-muted-foreground"
        >
          View All
        </button>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}