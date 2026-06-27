import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in-50 duration-500">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 mb-4 ring-1 ring-border/50">
        <Icon className="h-8 w-8 text-muted-foreground/70" strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
