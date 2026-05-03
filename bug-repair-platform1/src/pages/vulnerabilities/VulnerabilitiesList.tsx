import { useListVulnerabilities, useUpdateVulnerability, getListVulnerabilitiesQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { ShieldAlert, Filter, CheckCircle2, Shield } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge, SeverityBadge } from "@/components/ui/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function VulnerabilitiesList() {
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("open");
  const queryClient = useQueryClient();

  const { data: vulns, isLoading } = useListVulnerabilities(
    { 
      ...(severityFilter !== "all" ? { severity: severityFilter as any } : {}),
      ...(statusFilter !== "all" ? { status: statusFilter as any } : {})
    }
  );

  const updateVuln = useUpdateVulnerability({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListVulnerabilitiesQueryKey() });
      }
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-destructive uppercase tracking-widest flex items-center gap-2">
          <ShieldAlert className="h-6 w-6" />
          Security Center
        </h1>
        
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
            <SelectTrigger className="w-[130px] border-none shadow-none h-8 text-xs font-mono uppercase focus:ring-0">
              <SelectValue placeholder="STATUS" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-border font-mono text-xs uppercase">
              <SelectItem value="all">ALL STATUSES</SelectItem>
              <SelectItem value="open">OPEN</SelectItem>
              <SelectItem value="mitigated">MITIGATED</SelectItem>
              <SelectItem value="resolved">RESOLVED</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border border-border bg-card/50">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-bold uppercase tracking-wider text-xs text-muted-foreground w-12">CVE</TableHead>
              <TableHead className="font-bold uppercase tracking-wider text-xs text-muted-foreground">Vulnerability</TableHead>
              <TableHead className="font-bold uppercase tracking-wider text-xs text-muted-foreground">Severity</TableHead>
              <TableHead className="font-bold uppercase tracking-wider text-xs text-muted-foreground">Status</TableHead>
              <TableHead className="font-bold uppercase tracking-wider text-xs text-muted-foreground">Repository</TableHead>
              <TableHead className="font-bold uppercase tracking-wider text-xs text-muted-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6}><Skeleton className="h-8 w-full bg-muted/20" /></TableCell>
              </TableRow>
            ) : vulns?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground font-mono text-xs">NO_VULNERABILITIES_FOUND</TableCell>
              </TableRow>
            ) : (
              vulns?.map(vuln => (
                <TableRow key={vuln.id} className="border-border hover:bg-muted/20 transition-colors">
                  <TableCell className="font-mono text-xs whitespace-nowrap">
                    {vuln.cveId || 'UNKNOWN'}
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-foreground mb-1">{vuln.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">{vuln.description}</div>
                    {vuln.bugId && (
                      <Link href={`/bugs/${vuln.bugId}`} className="text-[10px] text-primary hover:underline mt-1 inline-block font-mono">
                        LINKED_BUG: {vuln.bugTitle}
                      </Link>
                    )}
                  </TableCell>
                  <TableCell><SeverityBadge severity={vuln.severity} /></TableCell>
                  <TableCell><StatusBadge status={vuln.status} /></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{vuln.repositoryName}</TableCell>
                  <TableCell className="text-right">
                    {vuln.status === 'open' && (
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-7 text-[10px] font-mono uppercase rounded-none border-border"
                          onClick={() => updateVuln.mutate({ id: vuln.id, data: { status: 'mitigated' } })}
                        >
                          <Shield className="mr-1 h-3 w-3" /> Mitigate
                        </Button>
                        <Button 
                          size="sm" 
                          className="h-7 text-[10px] font-mono uppercase rounded-none bg-primary/20 text-primary border border-primary hover:bg-primary hover:text-primary-foreground"
                          onClick={() => updateVuln.mutate({ id: vuln.id, data: { status: 'resolved' } })}
                        >
                          <CheckCircle2 className="mr-1 h-3 w-3" /> Resolve
                        </Button>
                      </div>
                    )}
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
