import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useGetDashboardSummary, useListForms, useDeleteForm, useDuplicateForm } from "@workspace/api-client-react";
import { Link } from "wouter";
import { FileText, Plus, Clock, Share2, Settings, TrendingUp, Languages, Trash2, Copy } from "lucide-react";
import { format, parseISO } from "date-fns";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const langName = (code: string) =>
  SUPPORTED_LANGUAGES.find((l) => l.code === code)?.name || code;

// Indigo ramp: oldest bars lightest, today darkest
const WEEKLY_COLORS = ["#e0e7ff", "#c7d2fe", "#a5b4fc", "#818cf8", "#6366f1", "#4f46e5", "#3730a3"];
// Subtle palette for language bars (cycle by rank)
const LANG_COLORS = ["#818cf8", "#34d399", "#60a5fa", "#f472b6", "#fb923c"];

export default function Dashboard() {
  const queryClient = useQueryClient();
  const { data: summary, isLoading: isSummaryLoading } = useGetDashboardSummary();
  const { data: forms, isLoading: isFormsLoading } = useListForms();
  const deleteForm = useDeleteForm();
  const duplicateForm = useDuplicateForm();

  const [deletingForm, setDeletingForm] = useState<{ id: string; title: string } | null>(null);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);

  const isLoading = isSummaryLoading || isFormsLoading;

  const handleDuplicate = async (id: string, title: string) => {
    setDuplicatingId(id);
    try {
      await duplicateForm.mutateAsync({ id });
      toast.success(`"${title}" duplicated`);
      queryClient.invalidateQueries({ queryKey: ["/api/forms"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/summary"] });
    } catch {
      toast.error("Failed to duplicate form.");
    } finally {
      setDuplicatingId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingForm) return;
    try {
      await deleteForm.mutateAsync({ id: deletingForm.id });
      toast.success(`"${deletingForm.title}" deleted`);
      queryClient.invalidateQueries({ queryKey: ["/api/forms"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/summary"] });
    } catch {
      toast.error("Failed to delete form.");
    } finally {
      setDeletingForm(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Overview of your forms and responses.</p>
          </div>
          <Link
            href="/create"
            className="flex items-center gap-2 px-4 py-2 bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Form</span>
            <span className="sm:hidden">New</span>
          </Link>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border border border-border">
          {[
            { label: "Total Forms", value: summary?.totalForms ?? "—" },
            { label: "Published", value: summary?.publishedForms ?? "—" },
            { label: "Drafts", value: summary?.draftForms ?? "—" },
            { label: "Responses", value: summary?.totalResponses ?? "—" },
          ].map(({ label, value }) => (
            <div key={label} className="bg-background px-4 sm:px-6 py-5">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{label}</p>
              <p className="text-2xl sm:text-3xl font-semibold mt-2 text-foreground" style={{ fontFamily: "var(--app-font-display)" }}>
                {isLoading ? <span className="inline-block w-10 h-7 bg-muted animate-pulse" /> : value}
              </p>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border">

          {/* Weekly trend — spans 2 cols */}
          <div className="md:col-span-2 bg-background p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Responses — last 7 days</span>
            </div>
            {isLoading ? (
              <div className="h-36 bg-muted animate-pulse" />
            ) : summary?.weeklyTrend?.length ? (
              <ResponsiveContainer width="100%" height={144}>
                <BarChart data={summary.weeklyTrend} barSize={22}>
                  <XAxis
                    dataKey="date"
                    tickFormatter={(d) => format(parseISO(d), "MMM d")}
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                    width={24}
                  />
                  <Tooltip
                    cursor={{ fill: "hsl(var(--muted))" }}
                    contentStyle={{
                      background: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 0,
                      fontSize: 12,
                    }}
                    formatter={(v: number) => [v, "responses"]}
                    labelFormatter={(d) => format(parseISO(d as string), "MMM d, yyyy")}
                  />
                  <Bar dataKey="count" radius={0}>
                    {summary.weeklyTrend.map((_, i) => (
                      <Cell key={i} fill={WEEKLY_COLORS[i] ?? WEEKLY_COLORS[WEEKLY_COLORS.length - 1]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-36 flex items-center justify-center text-sm text-muted-foreground">
                No responses yet
              </div>
            )}
          </div>

          {/* Language breakdown */}
          <div className="bg-background p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Languages className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Languages</span>
            </div>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <div key={i} className="h-6 bg-muted animate-pulse" />)}
              </div>
            ) : summary?.topLanguages?.length ? (
              <div className="space-y-3">
                {summary.topLanguages.slice(0, 6).map(({ language, count }, idx) => {
                  const maxCount = summary.topLanguages[0].count;
                  const pct = Math.round((count / maxCount) * 100);
                  const color = LANG_COLORS[idx % LANG_COLORS.length];
                  return (
                    <div key={language}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-foreground font-medium">{langName(language)}</span>
                        <span className="text-muted-foreground">{count}</span>
                      </div>
                      <div className="h-1.5 bg-muted">
                        <div className="h-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No data yet</p>
            )}
          </div>
        </div>

        {/* Most active form highlight */}
        {!isLoading && summary?.mostActiveForm && (
          <div className="border border-border p-4 sm:p-5 flex items-center justify-between gap-4 flex-wrap">
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Most Active Form</p>
              <p className="text-sm font-semibold text-foreground truncate">{summary.mostActiveForm.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{summary.mostActiveForm.responseCount} responses</p>
            </div>
            <Link
              href={`/forms/${summary.mostActiveForm.id}`}
              className="px-4 py-2 border border-border text-sm hover:border-foreground transition-colors whitespace-nowrap shrink-0"
            >
              View Responses
            </Link>
          </div>
        )}

        {/* Forms List */}
        <div>
          <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-4" style={{ fontFamily: "var(--app-font-sans)", letterSpacing: "0.08em" }}>Your Forms</h2>

          {isLoading ? (
            <div className="space-y-px border border-border">
              {[1, 2, 3].map(i => <div key={i} className="h-16 bg-muted/40 animate-pulse" />)}
            </div>
          ) : forms && forms.length > 0 ? (
            <div className="border border-border divide-y divide-border">
              {forms.map(form => (
                <div key={form.id} className="flex items-center justify-between px-4 sm:px-5 py-4 hover:bg-muted/20 transition-colors">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{form.title}</p>
                      <div className="flex items-center gap-2 sm:gap-3 mt-0.5 flex-wrap">
                        <span className={`text-xs uppercase tracking-wide font-medium ${form.status === 'published' ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {form.status}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(new Date(form.createdAt), "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-3">
                    <Link href={`/forms/${form.id}`} className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 border border-border text-xs hover:border-foreground transition-colors">
                      <Settings className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Edit</span>
                    </Link>
                    {form.status === "published" && (
                      <Link href={`/forms/${form.id}/share`} className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 border border-border text-xs hover:border-foreground transition-colors">
                        <Share2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Share</span>
                      </Link>
                    )}
                    <button
                      onClick={() => handleDuplicate(form.id, form.title)}
                      disabled={duplicatingId === form.id}
                      className="flex items-center justify-center w-8 h-8 border border-border text-muted-foreground hover:border-foreground hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      title="Duplicate form"
                    >
                      {duplicatingId === form.id
                        ? <span className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin" />
                        : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => setDeletingForm({ id: form.id, title: form.title })}
                      className="flex items-center justify-center w-8 h-8 border border-border text-muted-foreground hover:border-destructive hover:text-destructive transition-colors"
                      title="Delete form"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-border py-16 sm:py-20 text-center">
              <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground">No forms yet</p>
              <p className="text-xs text-muted-foreground mt-1 mb-6">Create your first multilingual form using AI.</p>
              <Link
                href="/create"
                className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <Plus className="w-4 h-4" /> Create Form
              </Link>
            </div>
          )}
        </div>

      </div>
      <AlertDialog open={!!deletingForm} onOpenChange={(open) => { if (!open) setDeletingForm(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete form?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>"{deletingForm?.title}"</strong> and all its responses will be permanently deleted. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
