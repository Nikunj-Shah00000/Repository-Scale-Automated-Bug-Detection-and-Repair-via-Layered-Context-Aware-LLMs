import { useListAgentSessions } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Activity, Cpu } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export default function AgentsList() {
  const { data: sessions, isLoading } = useListAgentSessions();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary uppercase tracking-widest flex items-center gap-2">
          <Activity className="h-6 w-6" />
          Agent Sessions
        </h1>
      </div>

      <div className="border border-border bg-card/50">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-bold uppercase tracking-wider text-xs text-muted-foreground">Session ID</TableHead>
              <TableHead className="font-bold uppercase tracking-wider text-xs text-muted-foreground">Target Bug</TableHead>
              <TableHead className="font-bold uppercase tracking-wider text-xs text-muted-foreground">Status</TableHead>
              <TableHead className="font-bold uppercase tracking-wider text-xs text-muted-foreground">Agents</TableHead>
              <TableHead className="font-bold uppercase tracking-wider text-xs text-muted-foreground text-right">Started</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5}><Skeleton className="h-8 w-full bg-muted/20" /></TableCell>
              </TableRow>
            ) : sessions?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground font-mono text-xs">NO_SESSIONS_FOUND</TableCell>
              </TableRow>
            ) : (
              sessions?.map(session => (
                <TableRow key={session.id} className="border-border hover:bg-muted/20 transition-colors">
                  <TableCell>
                    <Link href={`/agents/${session.id}`} className="font-mono text-xs text-primary hover:underline flex items-center gap-2">
                      <Cpu className="h-3 w-3" />
                      SESS-{session.id.toString().padStart(4, '0')}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/bugs/${session.bugId}`} className="text-sm text-foreground hover:text-primary">
                      {session.bugTitle}
                    </Link>
                  </TableCell>
                  <TableCell><StatusBadge status={session.status} /></TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {(session.agents as unknown as string[])?.map((agent, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-mono px-1 border border-border bg-muted/40 text-muted-foreground"
                          title={agent}
                        >
                          {agent.substring(0, 3).toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-xs font-mono text-muted-foreground">
                    {format(new Date(session.createdAt), "MMM d, HH:mm")}
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
