import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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

const queryClient = new QueryClient();

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

