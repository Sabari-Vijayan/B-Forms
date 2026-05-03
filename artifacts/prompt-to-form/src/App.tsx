import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import CreateForm from "@/pages/CreateForm";
import FormEditor from "@/pages/FormEditor";
import FormShare from "@/pages/FormShare";
import PublicForm from "@/pages/PublicForm";
import AuthCallback from "@/pages/AuthCallback";
import Templates from "@/pages/Templates";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000, // 30 seconds global default
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

// Create a persister to sync with localStorage
const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
  key: "ptf_query_cache",
});

// Apply persistence
persistQueryClient({
  queryClient,
  persister: localStoragePersister,
  maxAge: 1000 * 60 * 60 * 24, // 24 hours
});

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/auth/callback" component={AuthCallback} />
      <Route path="/" component={Dashboard} />
      <Route path="/create" component={CreateForm} />
      <Route path="/forms/:id" component={FormEditor} />
      <Route path="/forms/:id/share" component={FormShare} />
      <Route path="/templates" component={Templates} />
      <Route path="/f/:slug" component={PublicForm} />
      <Route component={NotFound} />
    </Switch>
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

