import { useListRepositories, useCreateRepository, getListRepositoriesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { FolderGit2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function RepositoriesList() {
  const { data: repositories, isLoading } = useListRepositories();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [lang, setLang] = useState("");
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const createRepo = useCreateRepository({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListRepositoriesQueryKey() });
        setOpen(false);
        setName("");
        setUrl("");
        setLang("");
        toast({ title: "Repository added", description: "Successfully tracking new repository" });
      },
    }
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createRepo.mutate({ data: { name, url, primaryLanguage: lang, description: "" } });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary uppercase tracking-widest flex items-center gap-2">
          <FolderGit2 className="h-6 w-6" />
          Repositories
        </h1>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-none font-bold uppercase tracking-wider text-xs">
              <Plus className="mr-2 h-4 w-4" /> Add Repo
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-none border-border bg-background sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="uppercase tracking-widest text-primary">Track New Repository</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs uppercase tracking-wider text-muted-foreground">Name</Label>
                <Input id="name" value={name} onChange={e => setName(e.target.value)} required className="rounded-none bg-muted/20 font-mono text-sm" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url" className="text-xs uppercase tracking-wider text-muted-foreground">Git URL</Label>
                <Input id="url" value={url} onChange={e => setUrl(e.target.value)} required className="rounded-none bg-muted/20 font-mono text-sm" placeholder="https://github.com/..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lang" className="text-xs uppercase tracking-wider text-muted-foreground">Primary Language</Label>
                <Input id="lang" value={lang} onChange={e => setLang(e.target.value)} required className="rounded-none bg-muted/20 font-mono text-sm" />
              </div>
              <Button type="submit" disabled={createRepo.isPending} className="w-full rounded-none">
                {createRepo.isPending ? "INITIALIZING..." : "TRACK REPOSITORY"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border border-border bg-card/50">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-bold uppercase tracking-wider text-xs text-muted-foreground">Name</TableHead>
              <TableHead className="font-bold uppercase tracking-wider text-xs text-muted-foreground">Status</TableHead>
              <TableHead className="font-bold uppercase tracking-wider text-xs text-muted-foreground">Language</TableHead>
              <TableHead className="font-bold uppercase tracking-wider text-xs text-muted-foreground text-right">Bugs</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4}><Skeleton className="h-8 w-full bg-muted/20" /></TableCell>
              </TableRow>
            ) : repositories?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">NO_REPOSITORIES_TRACKED</TableCell>
              </TableRow>
            ) : (
              repositories?.map(repo => (
                <TableRow key={repo.id} className="border-border hover:bg-muted/20 transition-colors">
                  <TableCell>
                    <Link href={`/repositories/${repo.id}`} className="font-bold text-primary hover:underline">
                      {repo.name}
                    </Link>
                  </TableCell>
                  <TableCell><StatusBadge status={repo.status} /></TableCell>
                  <TableCell className="text-xs">{repo.primaryLanguage}</TableCell>
                  <TableCell className="text-right text-xs font-mono">{repo.bugCount}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
