import { useListBugs, useCreateBug, getListBugsQueryKey, useListRepositories } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Bug, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge, SeverityBadge } from "@/components/ui/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function BugsList() {
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: bugs, isLoading } = useListBugs(
    { 
      ...(severityFilter !== "all" ? { severity: severityFilter as any } : {}),
      ...(statusFilter !== "all" ? { status: statusFilter as any } : {})
    }
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-primary uppercase tracking-widest flex items-center gap-2">
          <Bug className="h-6 w-6" />
          Bugs Database
        </h1>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 border border-border bg-card px-2 h-10">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-[130px] border-none shadow-none h-8 text-xs font-mono uppercase focus:ring-0">
                <SelectValue placeholder="SEVERITY" />
              </SelectTrigger>
              <SelectContent className="rounded-none border-border font-mono text-xs uppercase">
                <SelectItem value="all">ALL SEVERITIES</SelectItem>
                <SelectItem value="critical">CRITICAL</SelectItem>
                <SelectItem value="high">HIGH</SelectItem>
                <SelectItem value="medium">MEDIUM</SelectItem>
                <SelectItem value="low">LOW</SelectItem>
              </SelectContent>
            </Select>
            <div className="w-px h-4 bg-border mx-1"></div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] border-none shadow-none h-8 text-xs font-mono uppercase focus:ring-0">
                <SelectValue placeholder="STATUS" />
              </SelectTrigger>
              <SelectContent className="rounded-none border-border font-mono text-xs uppercase">
                <SelectItem value="all">ALL STATUSES</SelectItem>
                <SelectItem value="detected">DETECTED</SelectItem>
                <SelectItem value="in_progress">IN PROGRESS</SelectItem>
                <SelectItem value="patched">PATCHED</SelectItem>
                <SelectItem value="verified">VERIFIED</SelectItem>
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
              <TableHead className="font-bold uppercase tracking-wider text-xs text-muted-foreground">Title</TableHead>
              <TableHead className="font-bold uppercase tracking-wider text-xs text-muted-foreground">Repository</TableHead>
              <TableHead className="font-bold uppercase tracking-wider text-xs text-muted-foreground">Severity</TableHead>
              <TableHead className="font-bold uppercase tracking-wider text-xs text-muted-foreground">Status</TableHead>
              <TableHead className="font-bold uppercase tracking-wider text-xs text-muted-foreground">Language</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5}><Skeleton className="h-8 w-full bg-muted/20" /></TableCell>
              </TableRow>
            ) : bugs?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground font-mono text-xs">NO_BUGS_MATCHING_CRITERIA</TableCell>
              </TableRow>
            ) : (
              bugs?.map(bug => (
                <TableRow key={bug.id} className="border-border hover:bg-muted/20 transition-colors">
                  <TableCell>
                    <Link href={`/bugs/${bug.id}`} className="font-bold text-primary hover:underline">
                      {bug.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/repositories/${bug.repositoryId}`} className="text-xs text-muted-foreground hover:text-primary">
                      {bug.repositoryName}
                    </Link>
                  </TableCell>
                  <TableCell><SeverityBadge severity={bug.severity} /></TableCell>
                  <TableCell><StatusBadge status={bug.status} /></TableCell>
                  <TableCell className="text-xs font-mono">{bug.language}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
