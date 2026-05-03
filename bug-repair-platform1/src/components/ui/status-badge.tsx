import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getVariants = (s: string) => {
    switch (s.toLowerCase()) {
      case "idle":
      case "pending":
      case "detected":
      case "open":
      case "initializing":
        return "border-muted-foreground text-muted-foreground";
      case "analyzing":
      case "in_progress":
      case "processing":
      case "debating":
        return "border-yellow-500/50 text-yellow-500 bg-yellow-500/10";
      case "analyzed":
      case "patched":
      case "verified":
      case "completed":
      case "mitigated":
      case "resolved":
      case "applied":
      case "converged":
        return "border-primary/50 text-primary bg-primary/10";
      case "error":
      case "rejected":
      case "failed":
        return "border-destructive/50 text-destructive bg-destructive/10";
      default:
        return "border-muted text-muted-foreground";
    }
  };

  return (
    <Badge
      variant="outline"
      className={cn("uppercase text-[10px] tracking-wider font-mono", getVariants(status), className)}
    >
      {status}
    </Badge>
  );
}

export function SeverityBadge({ severity, className }: { severity: string; className?: string }) {
  const getVariants = (s: string) => {
    switch (s.toLowerCase()) {
      case "critical":
        return "border-destructive text-destructive bg-destructive/10 font-bold";
      case "high":
        return "border-orange-500/50 text-orange-500 bg-orange-500/10";
      case "medium":
        return "border-yellow-500/50 text-yellow-500 bg-yellow-500/10";
      case "low":
        return "border-primary/50 text-primary bg-primary/10";
      default:
        return "border-muted text-muted-foreground";
    }
  };

  return (
    <Badge
      variant="outline"
      className={cn("uppercase text-[10px] tracking-wider font-mono", getVariants(severity), className)}
    >
      {severity}
    </Badge>
  );
}
