import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import RepositoriesList from "@/pages/repositories/RepositoriesList";
import RepositoryDetail from "@/pages/repositories/RepositoryDetail";
import BugsList from "@/pages/bugs/BugsList";
import BugDetail from "@/pages/bugs/BugDetail";
import PatchesList from "@/pages/patches/PatchesList";
import PatchDetail from "@/pages/patches/PatchDetail";
import AgentsList from "@/pages/agents/AgentsList";
import AgentDetail from "@/pages/agents/AgentDetail";
import TranslationsList from "@/pages/translations/TranslationsList";
import TranslationDetail from "@/pages/translations/TranslationDetail";
import VulnerabilitiesList from "@/pages/vulnerabilities/VulnerabilitiesList";

const queryClient = new QueryClient();

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/repositories" component={RepositoriesList} />
        <Route path="/repositories/:id" component={RepositoryDetail} />
        <Route path="/bugs" component={BugsList} />
        <Route path="/bugs/:id" component={BugDetail} />
        <Route path="/patches" component={PatchesList} />
        <Route path="/patches/:id" component={PatchDetail} />
        <Route path="/agents" component={AgentsList} />
        <Route path="/agents/:id" component={AgentDetail} />
        <Route path="/translations" component={TranslationsList} />
        <Route path="/translations/:id" component={TranslationDetail} />
        <Route path="/vulnerabilities" component={VulnerabilitiesList} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
