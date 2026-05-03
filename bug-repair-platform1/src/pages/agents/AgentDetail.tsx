import { useGetAgentSession, getGetAgentSessionQueryKey } from "@workspace/api-client-react";
import { useParams, useLocation, Link } from "wouter";
import { Activity, ArrowLeft, Cpu, Terminal, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AgentDetail() {
  const { id } = useParams<{ id: string }>();
  const sessionId = parseInt(id || "0", 10);
  const [, setLocation] = useLocation();

  const { data: session, isLoading } = useGetAgentSession(sessionId, {
    query: {
      enabled: !!sessionId,
      queryKey: getGetAgentSessionQueryKey(sessionId),
      refetchInterval: (query) => {
        const status = query.state.data?.status;
        return (status === 'initializing' || status === 'analyzing' || status === 'debating') ? 2000 : false;
      }
    }
  });

  if (isLoading) return <Skeleton className="h-64 w-full bg-muted/20" />;
  if (!session) return <div className="text-center py-12 text-muted-foreground uppercase tracking-widest">Session not found</div>;

  const agents = (session.agents as unknown as string[]) ?? [];
  const steps = (session.reasoningSteps as unknown as { step: number; agent: string; msg: string }[]) ?? [];

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-6rem)]">
      <div className="flex items-center gap-4 shrink-0">
        <Button variant="outline" size="icon" onClick={() => setLocation("/agents")} className="rounded-none border-border">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-xs font-mono font-bold text-primary flex items-center gap-1">
              <Activity className="h-3 w-3" />
              SESS-{session.id.toString().padStart(4, '0')}
            </span>
            <StatusBadge status={session.status} />
            {session.patchId && (
              <Link href={`/patches/${session.patchId}`}>
                <Badge variant="outline" className="rounded-none border-primary/50 text-primary bg-primary/10 hover:bg-primary hover:text-primary-foreground font-mono text-[10px] uppercase cursor-pointer">
                  View Generated Patch &rarr;
                </Badge>
              </Link>
            )}
          </div>
          <h1 className="text-xl font-bold text-foreground">
            Debugging <Link href={`/bugs/${session.bugId}`} className="text-primary hover:underline">{session.bugTitle}</Link>
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 flex-1 min-h-0">
        <div className="md:col-span-1 space-y-4 overflow-y-auto">
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-bold border-b border-border pb-2">Active Agents</h3>
          <div className="space-y-2">
            {agents.map((name, idx) => (
              <div key={idx} className="border border-border bg-card/50 p-3 flex items-center gap-2">
                <Cpu className="h-4 w-4 text-primary shrink-0" />
                <div>
                  <div className="text-sm font-bold text-foreground">{name}</div>
                  <div className="text-[10px] text-muted-foreground font-mono uppercase">Agent #{idx + 1}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-3 border border-border bg-[#0a0a0a] flex flex-col min-h-0">
          <div className="border-b border-border bg-muted/30 px-4 py-2 flex items-center gap-2">
            <Terminal className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Execution_Log</h3>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {steps.length === 0 ? (
                <div className="text-xs font-mono text-muted-foreground flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  INITIALIZING_AGENTS...
                </div>
              ) : (
                steps.map((step, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                      <span className="text-primary">[STEP_{step.step}]</span>
                      <span className="font-bold text-foreground">{step.agent}</span>
                      <span className="text-muted-foreground/60">&gt;</span>
                    </div>
                    <div className="pl-4 ml-[1.1rem] border-l border-border/50 text-sm font-mono text-foreground/80">
                      {step.msg}
                    </div>
                  </div>
                ))
              )}

              {(session.status === 'analyzing' || session.status === 'debating') && (
                <div className="text-xs font-mono text-muted-foreground flex items-center gap-2 pt-4">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  AWAITING_CONSENSUS...
                </div>
              )}

              {session.consensus && (
                <div className="mt-4 border border-primary/30 bg-primary/5 p-4 space-y-2">
                  <div className="text-xs font-bold font-mono text-primary uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" /> FINAL_CONSENSUS
                  </div>
                  <div className="text-sm font-mono text-foreground/90">
                    {session.consensus.replace(/_/g, ' ')}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
