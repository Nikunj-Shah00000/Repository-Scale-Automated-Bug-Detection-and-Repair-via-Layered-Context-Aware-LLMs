import { useListTranslations, useCreateTranslation, getListTranslationsQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { Globe2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { format } from "date-fns";

export default function TranslationsList() {
  const { data: translations, isLoading } = useListTranslations();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const [sourceLang, setSourceLang] = useState<"python" | "java" | "cpp">("python");
  const [targetLang, setTargetLang] = useState<"python" | "java" | "cpp">("java");
  const [sourceCode, setSourceCode] = useState("");

  const createJob = useCreateTranslation({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListTranslationsQueryKey() });
        setOpen(false);
        setSourceCode("");
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createJob.mutate({
      data: { sourceLanguage: sourceLang, targetLanguage: targetLang, sourceCode }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary uppercase tracking-widest flex items-center gap-2">
          <Globe2 className="h-6 w-6" />
          Translation Jobs
        </h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-none font-bold uppercase tracking-wider text-xs">
              <Plus className="mr-2 h-4 w-4" /> New Translation
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-none border-border bg-background sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="uppercase tracking-widest text-primary">Submit Translation Job</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Source Language</Label>
                  <Select value={sourceLang} onValueChange={(v: any) => setSourceLang(v)}>
                    <SelectTrigger className="rounded-none bg-muted/20 border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-none border-border">
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                      <SelectItem value="cpp">C++</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Target Language</Label>
                  <Select value={targetLang} onValueChange={(v: any) => setTargetLang(v)}>
                    <SelectTrigger className="rounded-none bg-muted/20 border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-none border-border">
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                      <SelectItem value="cpp">C++</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Source Code</Label>
                <Textarea 
                  value={sourceCode} 
                  onChange={e => setSourceCode(e.target.value)} 
                  required 
                  className="min-h-[200px] font-mono text-xs rounded-none bg-muted/20 border-border"
                  placeholder="Paste code here..."
                />
              </div>
              <Button type="submit" disabled={createJob.isPending} className="w-full rounded-none font-bold tracking-wider">
                {createJob.isPending ? "INITIALIZING..." : "START TRANSLATION"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border border-border bg-card/50">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-bold uppercase tracking-wider text-xs text-muted-foreground">Job ID</TableHead>
              <TableHead className="font-bold uppercase tracking-wider text-xs text-muted-foreground">Mapping</TableHead>
              <TableHead className="font-bold uppercase tracking-wider text-xs text-muted-foreground">Status</TableHead>
              <TableHead className="font-bold uppercase tracking-wider text-xs text-muted-foreground text-right">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4}><Skeleton className="h-8 w-full bg-muted/20" /></TableCell>
              </TableRow>
            ) : translations?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12 text-muted-foreground font-mono text-xs">NO_TRANSLATIONS_FOUND</TableCell>
              </TableRow>
            ) : (
              translations?.map(job => (
                <TableRow key={job.id} className="border-border hover:bg-muted/20 transition-colors">
                  <TableCell>
                    <Link href={`/translations/${job.id}`} className="font-mono text-xs text-primary hover:underline">
                      TRNS-{job.id.toString().padStart(4, '0')}
                    </Link>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {job.sourceLanguage.toUpperCase()} <span className="text-primary">&rarr;</span> {job.targetLanguage.toUpperCase()}
                  </TableCell>
                  <TableCell><StatusBadge status={job.status} /></TableCell>
                  <TableCell className="text-right text-xs font-mono text-muted-foreground">
                    {format(new Date(job.createdAt), "MMM d, HH:mm")}
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
