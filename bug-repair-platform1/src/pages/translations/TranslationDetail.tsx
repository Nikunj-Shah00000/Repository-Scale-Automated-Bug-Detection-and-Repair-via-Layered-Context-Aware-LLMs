import { useGetTranslation, getGetTranslationQueryKey } from "@workspace/api-client-react";
import { useParams, useLocation } from "wouter";
import { Globe2, ArrowLeft, ArrowRight, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function TranslationDetail() {
  const { id } = useParams<{ id: string }>();
  const jobId = parseInt(id || "0", 10);
  const [, setLocation] = useLocation();

  const { data: job, isLoading } = useGetTranslation(jobId, {
    query: { 
      enabled: !!jobId,
      queryKey: getGetTranslationQueryKey(jobId),
      refetchInterval: (q) => (q.state.data?.status === 'pending' || q.state.data?.status === 'processing') ? 2000 : false
    }
  });

  if (isLoading) return <Skeleton className="h-64 w-full bg-muted/20" />;
  if (!job) return <div className="text-center py-12 text-muted-foreground uppercase tracking-widest">Translation job not found</div>;

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-6rem)]">
      <div className="flex items-center gap-4 shrink-0">
        <Button variant="outline" size="icon" onClick={() => setLocation("/translations")} className="rounded-none border-border">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-xs font-mono font-bold text-primary flex items-center gap-1">
              <Globe2 className="h-3 w-3" />
              TRNS-{job.id.toString().padStart(4, '0')}
            </span>
            <StatusBadge status={job.status} />
          </div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-3 font-mono">
            {job.sourceLanguage.toUpperCase()} 
            <ArrowRight className="h-5 w-5 text-muted-foreground" /> 
            {job.targetLanguage.toUpperCase()}
          </h1>
        </div>
      </div>

      {job.notes && (
        <div className="shrink-0 bg-primary/10 border border-primary/30 p-3 text-sm text-primary">
          <span className="font-bold uppercase tracking-wider text-xs mr-2">Notes:</span> 
          {job.notes}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
        <div className="border border-border bg-[#0a0a0a] flex flex-col min-h-0">
          <div className="border-b border-border bg-muted/30 px-4 py-2 flex items-center justify-between">
            <h3 className="text-xs font-mono text-muted-foreground flex items-center gap-2">
              <Code className="h-4 w-4" /> SOURCE_{job.sourceLanguage.toUpperCase()}
            </h3>
          </div>
          <ScrollArea className="flex-1 p-4">
            <pre className="text-xs font-mono text-foreground/80 leading-relaxed">
              <code>{job.sourceCode}</code>
            </pre>
          </ScrollArea>
        </div>

        <div className="border border-border bg-[#0a0a0a] flex flex-col min-h-0">
          <div className="border-b border-border bg-muted/30 px-4 py-2 flex items-center justify-between">
            <h3 className="text-xs font-mono text-primary flex items-center gap-2">
              <Code className="h-4 w-4" /> TARGET_{job.targetLanguage.toUpperCase()}
            </h3>
          </div>
          <ScrollArea className="flex-1 p-4">
            {job.status === 'processing' || job.status === 'pending' ? (
              <div className="flex items-center gap-2 text-xs font-mono text-primary animate-pulse h-full justify-center">
                <div className="h-2 w-2 rounded-full bg-primary" />
                TRANSLATING_AST...
              </div>
            ) : job.translatedCode ? (
              <pre className="text-xs font-mono text-green-400/90 leading-relaxed">
                <code>{job.translatedCode}</code>
              </pre>
            ) : (
              <div className="flex items-center justify-center h-full text-xs font-mono text-destructive">
                TRANSLATION_FAILED
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
