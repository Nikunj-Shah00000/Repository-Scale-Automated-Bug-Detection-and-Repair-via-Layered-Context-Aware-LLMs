import { useListPatches } from "@workspace/api-client-react";
import { Link } from "wouter";
import { GitPullRequest, Filter } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

export default function PatchesList() {
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: patches, isLoading } = useListPatches(
    { 
      ...(statusFilter !== "all" ? { status: statusFilter as any } : {})
    }
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-primary uppercase tracking-widest flex items-center gap-2">
          <GitPullRequest className="h-6 w-6" />
          Patch Queue
        </h1>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 border border-border bg-card px-2 h-10">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] border-none shadow-none h-8 text-xs font-mono uppercase focus:ring-0">
                <SelectValue placeholder="STATUS" />
              </SelectTrigger>
              <SelectContent className="rounded-none border-border font-mono text-xs uppercase">
                <SelectItem value="all">ALL STATUSES</SelectItem>
                <SelectItem value="pending">PENDING</SelectItem>
                <SelectItem value="applied">APPLIED</SelectItem>
                <SelectItem value="rejected">REJECTED</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="border border-border bg-card/50">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-bold uppercase tracking-wider text-xs text-muted-foreground">ID</TableHead>
              <TableHead className="font-bold uppercase tracking-wider text-xs text-muted-foreground">Bug</TableHead>
              <TableHead className="font-bold uppercase tracking-wider text-xs text-muted-foreground">Status</TableHead>
              <TableHead className="font-bold uppercase tracking-wider text-xs text-muted-foreground text-right">Confidence</TableHead>
              <TableHead className="font-bold uppercase tracking-wider text-xs text-muted-foreground text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5}><Skeleton className="h-8 w-full bg-muted/20" /></TableCell>
              </TableRow>
            ) : patches?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground font-mono text-xs">NO_PATCHES_FOUND</TableCell>
              </TableRow>
            ) : (
              patches?.map(patch => (
                <TableRow key={patch.id} className="border-border hover:bg-muted/20 transition-colors">
                  <TableCell>
                    <Link href={`/patches/${patch.id}`} className="font-mono text-xs text-primary hover:underline">
                      PTCH-{patch.id.toString().padStart(4, '0')}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/bugs/${patch.bugId}`} className="text-sm font-bold text-foreground hover:text-primary truncate max-w-[300px] block">
                      {patch.bugTitle || `Bug #${patch.bugId}`}
                    </Link>
                  </TableCell>
                  <TableCell><StatusBadge status={patch.status} /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${patch.confidence > 0.8 ? 'bg-primary' : patch.confidence > 0.5 ? 'bg-yellow-500' : 'bg-destructive'}`} 
                          style={{ width: `${patch.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono">{(patch.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-xs font-mono text-muted-foreground">
                    {format(new Date(patch.createdAt), "MMM d, HH:mm")}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
