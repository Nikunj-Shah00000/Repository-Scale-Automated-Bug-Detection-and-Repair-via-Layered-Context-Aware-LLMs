import { useGetPatch, useUpdatePatch, getGetPatchQueryKey, getListPatchesQueryKey } from "@workspace/api-client-react";
import { useParams, useLocation, Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { GitPullRequest, ArrowLeft, Check, X, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";

export default function PatchDetail() {
  const { id } = useParams<{ id: string }>();
  const patchId = parseInt(id || "0", 10);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data: patch, isLoading } = useGetPatch(patchId, {
    query: { enabled: !!patchId, queryKey: getGetPatchQueryKey(patchId) }
  });

  const updatePatch = useUpdatePatch({
    mutation: {
      onSuccess: (data) => {
        queryClient.setQueryData(getGetPatchQueryKey(patchId), data);
      }
    }
  });

  if (isLoading) return <Skeleton className="h-64 w-full bg-muted/20" />;
  if (!patch) return <div className="text-center py-12 text-muted-foreground uppercase tracking-widest">Patch not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => setLocation("/patches")} className="rounded-none border-border">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-xs font-mono font-bold text-primary">PTCH-{patch.id.toString().padStart(4, '0')}</span>
            <StatusBadge status={patch.status} />
          </div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            Patch for <Link href={`/bugs/${patch.bugId}`} className="text-primary hover:underline">{patch.bugTitle}</Link>
          </h1>
        </div>
        
        {patch.status === "pending" && (
          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              className="rounded-none border-destructive text-destructive hover:bg-destructive/10 uppercase tracking-widest text-xs font-bold"
              onClick={() => updatePatch.mutate({ id: patchId, data: { status: "rejected" } })}
              disabled={updatePatch.isPending}
            >
              <X className="mr-2 h-4 w-4" /> Reject
            </Button>
            <Button 
              className="rounded-none bg-primary/20 text-primary border border-primary hover:bg-primary hover:text-primary-foreground uppercase tracking-widest text-xs font-bold"
              onClick={() => updatePatch.mutate({ id: patchId, data: { status: "applied" } })}
              disabled={updatePatch.isPending}
            >
              <Check className="mr-2 h-4 w-4" /> Apply Patch
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3 space-y-6">
          <div className="border border-border bg-card/50 p-6 space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Explanation</h3>
            <div className="prose prose-invert max-w-none text-sm">
              {patch.explanation}
            </div>
          </div>

          <div className="border border-border bg-card/50 overflow-hidden flex flex-col">
            <div className="border-b border-border bg-muted/30 px-4 py-2 flex items-center justify-between">
              <h3 className="text-xs font-mono text-muted-foreground flex items-center gap-2">
                <Code className="h-4 w-4" /> Code Diff
              </h3>
            </div>
            <div className="p-4 bg-[#0d1117] overflow-x-auto">
              <pre className="text-xs font-mono leading-relaxed">
                <code dangerouslySetInnerHTML={{ __html: highlightDiff(patch.diffCode) }} />
              </pre>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="border border-border bg-card/50 p-4 space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-4 border-b border-border pb-2">Analysis</h3>
            
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Confidence Score</div>
              <div className="flex items-center gap-2">
                <div className="text-xl font-bold font-mono text-primary">{(patch.confidence * 100).toFixed(1)}%</div>
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${patch.confidence * 100}%` }} />
                </div>
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Generated Tests</div>
              <div className="text-sm font-mono text-foreground">{patch.testsGenerated} test cases</div>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Context Used</div>
              <Badge variant="outline" className="rounded-none font-mono text-[10px] bg-muted/20 border-border">
                {patch.contextUsed}
              </Badge>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Agent ID</div>
              <div className="text-xs font-mono text-muted-foreground break-all">{patch.agentId}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Very simple client side diff highlighting
function highlightDiff(diff: string) {
  if (!diff) return "";
  return diff.split('\n').map(line => {
    const escaped = line.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    if (line.startsWith('+')) return `<span class="text-green-400 bg-green-500/10 block w-full">${escaped}</span>`;
    if (line.startsWith('-')) return `<span class="text-red-400 bg-red-500/10 block w-full">${escaped}</span>`;
    if (line.startsWith('@@')) return `<span class="text-primary block w-full">${escaped}</span>`;
    return `<span class="text-muted-foreground block w-full">${escaped}</span>`;
  }).join('\n');
}
