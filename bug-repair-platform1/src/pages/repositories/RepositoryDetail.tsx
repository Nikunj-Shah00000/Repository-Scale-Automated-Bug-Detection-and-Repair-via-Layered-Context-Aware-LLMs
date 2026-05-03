import { useGetRepository, useListBugs, useDeleteRepository, getListRepositoriesQueryKey, getGetRepositoryQueryKey, getListBugsQueryKey } from "@workspace/api-client-react";
import { useParams, useLocation, Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { FolderGit2, Trash2, ArrowLeft, ExternalLink, Bug as BugIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge, SeverityBadge } from "@/components/ui/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

export default function RepositoryDetail() {
  const { id } = useParams<{ id: string }>();
  const repoId = parseInt(id || "0", 10);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data: repo, isLoading: isLoadingRepo } = useGetRepository(repoId, {
    query: { enabled: !!repoId, queryKey: getGetRepositoryQueryKey(repoId) }
  });

  const { data: bugs, isLoading: isLoadingBugs } = useListBugs(
    { repositoryId: repoId },
    { query: { enabled: !!repoId, queryKey: getListBugsQueryKey({ repositoryId: repoId }) } }
  );

  const deleteRepo = useDeleteRepository({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListRepositoriesQueryKey() });
        setLocation("/repositories");
      }
    }
  });

  if (isLoadingRepo) {
    return <Skeleton className="h-64 w-full bg-muted/20" />;
  }

  if (!repo) {
    return <div className="text-center py-12 text-muted-foreground uppercase tracking-widest">Repository not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => setLocation("/repositories")} className="rounded-none border-border">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold text-primary uppercase tracking-widest flex items-center gap-2 flex-1">
          <FolderGit2 className="h-6 w-6" />
          {repo.name}
        </h1>
        <Button 
          variant="outline" 
          className="rounded-none border-destructive text-destructive hover:bg-destructive/10"
          onClick={() => deleteRepo.mutate({ id: repoId })}
          disabled={deleteRepo.isPending}
        >
          <Trash2 className="mr-2 h-4 w-4" /> DELETE
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-4">
          <div className="border border-border bg-card/50 p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Git URL</div>
                <a href={repo.url} target="_blank" rel="noreferrer" className="text-sm font-mono text-primary hover:underline flex items-center gap-1">
                  {repo.url} <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Language</div>
                <div className="text-sm font-mono">{repo.primaryLanguage}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Status</div>
                <StatusBadge status={repo.status} />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Last Analyzed</div>
                <div className="text-sm font-mono text-muted-foreground">
                  {repo.lastAnalyzedAt ? format(new Date(repo.lastAnalyzedAt), "PP pp") : "NEVER"}
                </div>
              </div>
            </div>
            {repo.description && (
              <div className="pt-4 border-t border-border">
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Description</div>
                <div className="text-sm">{repo.description}</div>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="border border-border bg-card/50 p-4 text-center">
            <div className="text-4xl font-bold font-mono text-primary mb-2">{repo.bugCount}</div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Total Bugs</div>
          </div>
          <div className="border border-border bg-card/50 p-4 text-center">
            <div className="text-4xl font-bold font-mono text-primary mb-2">{repo.patchedCount}</div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Patches Applied</div>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-border">
        <h2 className="text-lg font-bold uppercase tracking-widest flex items-center gap-2">
          <BugIcon className="h-5 w-5 text-primary" /> 
          Detected Bugs
        </h2>
        
        <div className="border border-border bg-card/50">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="font-bold uppercase tracking-wider text-xs text-muted-foreground">Bug</TableHead>
                <TableHead className="font-bold uppercase tracking-wider text-xs text-muted-foreground">Severity</TableHead>
                <TableHead className="font-bold uppercase tracking-wider text-xs text-muted-foreground">Status</TableHead>
                <TableHead className="font-bold uppercase tracking-wider text-xs text-muted-foreground">Path</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingBugs ? (
                <TableRow>
                  <TableCell colSpan={4}><Skeleton className="h-8 w-full bg-muted/20" /></TableCell>
                </TableRow>
              ) : bugs?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground font-mono text-xs">NO_BUGS_DETECTED</TableCell>
                </TableRow>
              ) : (
                bugs?.map(bug => (
                  <TableRow key={bug.id} className="border-border hover:bg-muted/20 transition-colors">
                    <TableCell>
                      <Link href={`/bugs/${bug.id}`} className="font-bold text-primary hover:underline block truncate max-w-xs">
                        {bug.title}
                      </Link>
                    </TableCell>
                    <TableCell><SeverityBadge severity={bug.severity} /></TableCell>
                    <TableCell><StatusBadge status={bug.status} /></TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground truncate max-w-xs">
                      {bug.filePath}{bug.lineNumber ? `:${bug.lineNumber}` : ''}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
