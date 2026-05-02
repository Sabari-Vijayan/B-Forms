import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useGetDashboardSummary, useListForms } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { FileText, Inbox, BarChart3, Plus, Globe2, Clock, Share2, Settings } from "lucide-react";
import { format } from "date-fns";

export default function Dashboard() {
  const { data: summary, isLoading: isSummaryLoading } = useGetDashboardSummary();
  const { data: forms, isLoading: isFormsLoading } = useListForms();

  if (isSummaryLoading || isFormsLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-8 animate-pulse">
          <div className="h-10 w-48 bg-muted rounded-md"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-muted rounded-xl"></div>
            ))}
          </div>
          <div className="space-y-4">
            <div className="h-8 w-32 bg-muted rounded-md"></div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-48 bg-muted rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome to Prompt to Form. Here's what's happening.</p>
        </div>
        <Link href="/create" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
          <Plus className="w-4 h-4 mr-2" />
          Create Form
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="border-border/50 shadow-sm bg-card hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Forms</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{summary?.totalForms || 0}</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm bg-card hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Published</CardTitle>
            <Globe2 className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{summary?.publishedForms || 0}</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm bg-card hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Drafts</CardTitle>
            <Inbox className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{summary?.draftForms || 0}</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm bg-card hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Responses</CardTitle>
            <BarChart3 className="w-4 h-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{summary?.totalResponses || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Your Forms</h2>
        {forms && forms.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {forms.map(form => (
              <Card key={form.id} className="flex flex-col border-border/50 shadow-sm bg-card group hover:border-primary/20 transition-all">
                <CardHeader className="pb-3 flex-1">
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <Badge variant={form.status === 'published' ? 'default' : form.status === 'closed' ? 'destructive' : 'secondary'} className={form.status === 'published' ? 'bg-primary/10 text-primary hover:bg-primary/20' : ''}>
                      {form.status.charAt(0).toUpperCase() + form.status.slice(1)}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">{form.title}</CardTitle>
                  {form.description && (
                    <CardDescription className="line-clamp-2 mt-1.5 text-sm">{form.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="flex items-center text-sm text-muted-foreground gap-4">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{format(new Date(form.createdAt), 'MMM d, yyyy')}</span>
                    </div>
                    {form.status === 'published' && (
                      <div className="flex items-center gap-1.5">
                        <Globe2 className="w-3.5 h-3.5 text-primary" />
                        <span className="font-medium text-foreground">{form.supportedLanguages?.length || 1} langs</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <div className="p-4 border-t border-border/50 bg-muted/20 flex items-center justify-between gap-2 mt-auto">
                  <Link href={`/forms/${form.id}`} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 flex-1">
                    <Settings className="w-4 h-4 mr-2" />
                    Edit
                  </Link>
                  {form.status === 'published' && (
                    <Link href={`/forms/${form.id}/share`} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 flex-1">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Link>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 border-2 border-dashed border-border rounded-xl bg-card/50">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No forms yet</h3>
            <p className="text-muted-foreground mt-2 mb-6 max-w-sm mx-auto">
              Create your first multilingual form in seconds using AI. Just describe what you need.
            </p>
            <Link href="/create" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
              <Plus className="w-4 h-4 mr-2" />
              Create Form
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
