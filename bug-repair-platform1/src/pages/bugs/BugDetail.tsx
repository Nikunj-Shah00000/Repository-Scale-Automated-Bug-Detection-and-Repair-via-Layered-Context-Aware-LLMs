import { useGetBug, useListPatches, useCreateAgentSession, useDeleteBug, getListBugsQueryKey, getGetBugQueryKey, getListPatchesQueryKey } from "@workspace/api-client-react";
import { useParams, useLocation, Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { Bug as BugIcon, Trash2, ArrowLeft, Activity, GitPullRequest, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge, SeverityBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function BugDetail() {
  const { id } = useParams<{ id: string }>();
  const bugId = parseInt(id || "0", 10);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data: bug, isLoading: isLoadingBug } = useGetBug(bugId, {
    query: { enabled: !!bugId, queryKey: getGetBugQueryKey(bugId) }
  });

  const { data: patches, isLoading: isLoadingPatches } = useListPatches(
    { bugId },
    { query: { enabled: !!bugId, queryKey: getListPatchesQueryKey({ bugId }) } }
  );

  const deleteBug = useDeleteBug({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListBugsQueryKey() });
        setLocation("/bugs");
      }
    }
  });

  const createSession = useCreateAgentSession({
    mutation: {
      onSuccess: (session) => {
        setLocation(`/agents/${session.id}`);
      }
    }
  });

  if (isLoadingBug) return <Skeleton className="h-64 w-full bg-muted/20" />;
  if (!bug) return <div className="text-center py-12 text-muted-foreground uppercase tracking-widest">Bug not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => setLocation("/bugs")} className="rounded-none border-border">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <SeverityBadge severity={bug.severity} />
            <StatusBadge status={bug.status} />
            <span className="text-xs text-muted-foreground font-mono">ID: {bug.id}</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">{bug.title}</h1>
        </div>
        <Button 
          className="rounded-none border-primary bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground font-bold tracking-wider"
          onClick={() => createSession.mutate({ data: { bugId } })}
          disabled={createSession.isPending}
        >
          <Activity className="mr-2 h-4 w-4" /> 
          {createSession.isPending ? "INITIALIZING..." : "TRIGGER AGENTS"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="border border-border bg-card/50 p-6 space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Bug Description</h3>
            <div className="prose prose-invert max-w-none text-sm">
              {bug.description}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold uppercase tracking-widest flex items-center gap-2">
              <GitPullRequest className="h-5 w-5 text-primary" />
              Generated Patches
            </h3>
            
            {isLoadingPatches ? (
              <Skeleton className="h-24 w-full bg-muted/20" />
            ) : patches?.length === 0 ? (
              <div className="border border-border border-dashed p-8 text-center text-muted-foreground font-mono text-xs">
                NO_PATCHES_GENERATED
              </div>
            ) : (
              <div className="space-y-3">
                {patches?.map(patch => (
                  <Link key={patch.id} href={`/patches/${patch.id}`}>
                    <div className="border border-border bg-card/50 p-4 hover:border-primary/50 transition-colors cursor-pointer group">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <StatusBadge status={patch.status} />
                          <span className="text-xs font-mono text-muted-foreground">Confidence: {(patch.confidence * 100).toFixed(0)}%</span>
                        </div>
                        <span className="text-xs text-muted-foreground font-mono group-hover:text-primary transition-colors">VIEW_DIFF &rarr;</span>
                      </div>
                      <p className="text-sm text-foreground line-clamp-2">{patch.explanation}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="border border-border bg-card/50 p-4 space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-4 border-b border-border pb-2">Metadata</h3>
            
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Repository</div>
              <Link href={`/repositories/${bug.repositoryId}`} className="text-sm text-primary hover:underline font-mono">
                {bug.repositoryName}
              </Link>
            </div>
            
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Location</div>
              <div className="text-sm font-mono flex items-center gap-2">
                <Code2 className="h-3 w-3 text-muted-foreground" />
                {bug.filePath}
                {bug.lineNumber && <span className="text-muted-foreground">:{bug.lineNumber}</span>}
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Language</div>
              <Badge variant="outline" className="rounded-none font-mono text-[10px] bg-muted/20 border-border">
                {bug.language}
              </Badge>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Context Level</div>
              <Badge variant="outline" className="rounded-none font-mono text-[10px] bg-muted/20 border-border">
                {bug.contextLevel}
              </Badge>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Type</div>
              <div className="text-sm font-mono">{bug.bugType}</div>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Detected At</div>
              <div className="text-xs font-mono text-muted-foreground">
                {format(new Date(bug.detectedAt), "PP pp")}
              </div>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full rounded-none border-destructive text-destructive hover:bg-destructive/10"
            onClick={() => deleteBug.mutate({ id: bugId })}
            disabled={deleteBug.isPending}
          >
            <Trash2 className="mr-2 h-4 w-4" /> DELETE BUG
          </Button>
        </div>
      </div>
    </div>
  );
}
