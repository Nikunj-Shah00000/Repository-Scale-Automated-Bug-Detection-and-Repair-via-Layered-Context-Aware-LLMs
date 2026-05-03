import { useGetDashboardStats, useGetRecentActivity } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Bug, GitPullRequest, ShieldAlert, CheckCircle2, XCircle, Shield, GitBranch, Bot, Languages } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

const ACTIVITY_ICONS: Record<string, React.ReactNode> = {
  bug_detected: <Bug className="h-3 w-3 text-destructive" />,
  patch_applied: <CheckCircle2 className="h-3 w-3 text-green-400" />,
  patch_rejected: <XCircle className="h-3 w-3 text-destructive" />,
  vulnerability_found: <Shield className="h-3 w-3 text-yellow-400" />,
  repository_analyzed: <GitBranch className="h-3 w-3 text-primary" />,
  agent_session_started: <Bot className="h-3 w-3 text-primary" />,
  translation_completed: <Languages className="h-3 w-3 text-blue-400" />,
};

const SEVERITY_COLORS: Record<string, string> = {
  critical: "text-red-400",
  high: "text-orange-400",
  medium: "text-yellow-400",
  low: "text-blue-400",
};

export default function Dashboard() {
  const { data: stats, isLoading } = useGetDashboardStats();
  const { data: activity, isLoading: isLoadingActivity } = useGetRecentActivity({ limit: 10 });

  const successRatePct = stats?.patchSuccessRate != null
    ? Math.round(stats.patchSuccessRate * 100)
    : 0;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-primary uppercase tracking-widest">System Overview</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 bg-muted/20" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary uppercase tracking-widest flex items-center gap-2">
          <Activity className="h-6 w-6" />
          System Overview
        </h1>
        <div className="text-xs text-muted-foreground bg-muted/30 px-3 py-1 border border-border font-mono">
          LAST_SYNC: {new Date().toISOString()}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Bugs"
          value={stats?.totalBugs}
          sub={`+${stats?.bugsThisWeek ?? 0} this week`}
          icon={<Bug className="h-4 w-4 text-destructive" />}
        />
        <StatCard
          title="Patches Applied"
          value={stats?.patchesApplied}
          sub={`+${stats?.patchesThisWeek ?? 0} this week`}
          icon={<GitPullRequest className="h-4 w-4 text-green-400" />}
        />
        <StatCard
          title="Open Vulns"
          value={stats?.openVulnerabilities}
          icon={<ShieldAlert className="h-4 w-4 text-yellow-400" />}
        />
        <StatCard
          title="Patch Success"
          value={`${successRatePct}%`}
          sub={`${stats?.patchesApplied ?? 0} / ${(stats?.patchesApplied ?? 0) + (stats?.totalBugs ?? 0)} resolved`}
          icon={<Activity className="h-4 w-4 text-primary" />}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="bg-card/50 border-border rounded-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Activity className="h-3 w-3" />
              Activity Feed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-0">
            {isLoadingActivity ? (
              <div className="space-y-2">
                {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-10 bg-muted/20" />)}
              </div>
            ) : activity && activity.length > 0 ? (
              <div className="divide-y divide-border">
                {activity.map((item: any) => (
                  <div key={item.id} className="py-2 flex items-start gap-2">
                    <div className="mt-0.5 shrink-0">
                      {ACTIVITY_ICONS[item.type] ?? <Activity className="h-3 w-3 text-muted-foreground" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-foreground truncate">{item.title}</span>
                        {item.severity && (
                          <span className={`text-[10px] uppercase font-mono ${SEVERITY_COLORS[item.severity] ?? ''}`}>
                            [{item.severity}]
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        {item.repositoryName && (
                          <span className="text-[10px] text-muted-foreground font-mono">{item.repositoryName}</span>
                        )}
                        <span className="text-[10px] text-muted-foreground">
                          {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground py-4 text-center">No activity yet</div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border rounded-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Bot className="h-3 w-3" />
              System Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <MetricRow label="Total Repositories" value={stats?.totalRepositories ?? 0} />
              <MetricRow label="Active Agent Sessions" value={stats?.activeAgentSessions ?? 0} />
              <MetricRow label="Translation Jobs" value={stats?.translationJobs ?? 0} />
              <MetricRow label="Bugs This Week" value={stats?.bugsThisWeek ?? 0} accent />
              <MetricRow label="Patches This Week" value={stats?.patchesThisWeek ?? 0} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, sub, icon }: { title: string; value: any; sub?: string; icon: React.ReactNode }) {
  return (
    <Card className="bg-card border-border rounded-none shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground font-mono">{value ?? '-'}</div>
        {sub && <p className="text-[10px] text-muted-foreground mt-1 font-mono">{sub}</p>}
      </CardContent>
    </Card>
  );
}

function MetricRow({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-border/40 pb-2 last:border-0">
      <span className="text-xs text-muted-foreground uppercase tracking-wide">{label}</span>
      <span className={`text-sm font-mono font-bold ${accent ? 'text-destructive' : 'text-foreground'}`}>
        {value}
      </span>
    </div>
  );
}
