import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useGetDashboardSummary, useListForms, useDeleteForm, useDuplicateForm } from "@/hooks/api";
import { Link } from "wouter";
import { FileText, Plus, Clock, Share2, Settings, TrendingUp, Languages, Trash2, Copy, Loader2 } from "lucide-react";
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
  const { data: summary, isLoading: isSummaryLoading } = useGetDashboardSummary({
    query: { staleTime: 60_000, queryKey: ["/api/dashboard/summary"] }
  });
  const { data: forms, isLoading: isFormsLoading } = useListForms({
    query: { staleTime: 60_000, queryKey: ["/api/forms"] }
  });
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

        {/* 1. Primary Call to Action */}
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 p-8 sm:p-12 rounded-2xl relative overflow-hidden flex flex-col items-center text-center shadow-xl border border-slate-800">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]"></div>
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">What do you want to build today?</h1>
            <p className="text-slate-400 text-sm sm:text-lg max-w-xl mx-auto leading-relaxed">
              Describe your ideal form in natural language, and our AI will generate a complete, multilingual form for you in seconds.
            </p>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-slate-950 text-sm sm:text-base font-semibold rounded-xl hover:bg-slate-100 transition-all shadow-2xl active:scale-[0.98]"
            >
              <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
              Create a New Form
            </Link>
          </div>
        </div>

        {/* 2. Statistics Overview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">Overview</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Forms", value: summary?.totalForms ?? "—" },
              { label: "Published", value: summary?.publishedForms ?? "—" },
              { label: "Drafts", value: summary?.draftForms ?? "—" },
              { label: "Total Responses", value: summary?.totalResponses ?? "—" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-card border border-border rounded-xl p-5 shadow-sm transition-all hover:shadow-md">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
                <p className="text-2xl sm:text-3xl font-bold mt-2 text-foreground" style={{ fontFamily: "var(--app-font-display)" }}>
                  {isLoading ? <span className="inline-block w-10 h-7 bg-muted animate-pulse rounded" /> : value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Weekly trend — spans 2 cols */}
          <div className="md:col-span-2 bg-card border border-border rounded-xl p-5 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Responses — last 7 days</span>
            </div>
            {isLoading ? (
              <div className="h-40 bg-muted rounded-lg animate-pulse" />
            ) : summary?.weeklyTrend?.length ? (
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={summary.weeklyTrend} barSize={22}>
                  <XAxis
                    dataKey="date"
                    tickFormatter={(d) => {
                      try {
                        const date = parseISO(d);
                        return isNaN(date.getTime()) ? d : format(date, "MMM d");
                      } catch {
                        return d;
                      }
                    }}
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
                    cursor={{ fill: "hsl(var(--muted))", radius: 4 }}
                    contentStyle={{
                      background: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 12,
                      fontSize: 12,
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    }}
                    formatter={(v: number) => [v, "responses"]}
                    labelFormatter={(d) => {
                      try {
                        const date = parseISO(d as string);
                        return isNaN(date.getTime()) ? String(d) : format(date, "MMM d, yyyy");
                      } catch {
                        return String(d);
                      }
                    }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {summary.weeklyTrend.map((_, i) => (
                      <Cell key={i} fill={WEEKLY_COLORS[i] ?? WEEKLY_COLORS[WEEKLY_COLORS.length - 1]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-40 flex items-center justify-center text-sm text-muted-foreground border border-dashed border-border rounded-xl">
                No responses yet
              </div>
            )}
          </div>

          {/* Language breakdown */}
          <div className="bg-card border border-border rounded-xl p-5 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Languages className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Top Languages</span>
            </div>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-6 bg-muted rounded animate-pulse" />)}
              </div>
            ) : summary?.topLanguages?.length ? (
              <div className="space-y-5">
                {summary.topLanguages.slice(0, 5).map(({ language, count }, idx) => {
                  const maxCount = summary.topLanguages[0].count;
                  const pct = Math.round((count / maxCount) * 100);
                  const color = LANG_COLORS[idx % LANG_COLORS.length];
                  return (
                    <div key={language}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-foreground font-medium">{langName(language)}</span>
                        <span className="text-muted-foreground">{count}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-40 flex items-center justify-center text-sm text-muted-foreground border border-dashed border-border rounded-xl">
                No data yet
              </div>
            )}
          </div>
        </div>

        {/* Most active form highlight */}
        {!isLoading && summary?.mostActiveForm && (
          <div className="bg-card border border-border rounded-xl p-5 flex items-center justify-between gap-4 flex-wrap shadow-sm transition-all hover:shadow-md">
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Most Active Form</p>
              <p className="text-lg font-semibold text-foreground truncate">{summary.mostActiveForm.title}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{summary.mostActiveForm.responseCount} responses</p>
            </div>
            <Link
              href={`/forms/${summary.mostActiveForm.id}?tab=responses`}
              className="px-6 py-2.5 border border-border rounded-lg text-sm font-semibold hover:bg-muted transition-all active:scale-[0.98] whitespace-nowrap shrink-0"
            >
              View Responses
            </Link>
          </div>
        )}

        {/* 3. Forms List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">Your Forms</h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => <div key={i} className="h-40 bg-muted/40 rounded-xl animate-pulse" />)}
            </div>
          ) : forms && forms.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {forms.map(form => (
                <div key={form.id} className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col justify-between transition-all hover:shadow-lg group">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="p-2 bg-muted rounded-lg text-muted-foreground group-hover:text-foreground transition-colors">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleDuplicate(form.id, form.title)}
                          disabled={duplicatingId === form.id}
                          className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                          title="Duplicate"
                        >
                          {duplicatingId === form.id
                            ? <Loader2 className="w-4 h-4 animate-spin" />
                            : <Copy className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => setDeletingForm({ id: form.id, title: form.title })}
                          className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <h3 className="font-semibold text-foreground truncate mb-1">{form.title}</h3>
                    
                    <div className="aspect-[21/9] w-full overflow-hidden rounded-md border mb-4 bg-muted/50 group-hover:border-foreground/20 transition-colors relative">
                      {form.featureImageUrl ? (
                        <img 
                          src={form.featureImageUrl} 
                          alt={form.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                          <FileText className="w-8 h-8 opacity-20" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span className={`text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded ${form.status === 'published' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                        {form.status}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {(() => {
                          const d = new Date(form.createdAt);
                          return isNaN(d.getTime()) ? "N/A" : format(d, "MMM d, yyyy");
                        })()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 pt-4 border-t border-border/50">
                    <Link href={`/forms/${form.id}`} className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-border rounded-lg text-xs font-semibold hover:bg-muted transition-colors">
                      <Settings className="w-3.5 h-3.5" />
                      Manage
                    </Link>
                    {form.status === "published" && (
                      <Link href={`/forms/${form.id}/share`} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-foreground text-background rounded-lg text-xs font-semibold hover:opacity-90 transition-colors">
                        <Share2 className="w-3.5 h-3.5" />
                        Share
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card border border-border border-dashed rounded-2xl py-20 text-center shadow-sm">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-lg font-semibold text-foreground">Start building your first form</p>
              <p className="text-sm text-muted-foreground mt-1 mb-8 max-w-sm mx-auto">Create professional, multilingual forms in seconds with the power of AI.</p>
              <Link
                href="/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background text-sm font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg active:scale-[0.98]"
              >
                <Plus className="w-5 h-5" /> Create a Form
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
