import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useGetDashboardSummary, useListForms } from "@workspace/api-client-react";
import { Link } from "wouter";
import { FileText, Plus, Globe2, Clock, Share2, Settings, TrendingUp, Languages } from "lucide-react";
import { format, parseISO } from "date-fns";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

const langName = (code: string) =>
  SUPPORTED_LANGUAGES.find((l) => l.code === code)?.name || code;

export default function Dashboard() {
  const { data: summary, isLoading: isSummaryLoading } = useGetDashboardSummary();
  const { data: forms, isLoading: isFormsLoading } = useListForms();

  const isLoading = isSummaryLoading || isFormsLoading;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Overview of your forms and responses.</p>
          </div>
          <Link
            href="/create"
            className="flex items-center gap-2 px-4 py-2 bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            New Form
          </Link>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border border border-border">
          {[
            { label: "Total Forms", value: summary?.totalForms ?? "—" },
            { label: "Published", value: summary?.publishedForms ?? "—" },
            { label: "Drafts", value: summary?.draftForms ?? "—" },
            { label: "Total Responses", value: summary?.totalResponses ?? "—" },
          ].map(({ label, value }) => (
            <div key={label} className="bg-background px-6 py-5">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{label}</p>
              <p className="text-3xl font-semibold mt-2 text-foreground">
                {isLoading ? <span className="inline-block w-10 h-7 bg-muted animate-pulse" /> : value}
              </p>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid md:grid-cols-3 gap-px bg-border border border-border">

          {/* Weekly trend — spans 2 cols */}
          <div className="md:col-span-2 bg-background p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Responses — last 7 days</span>
            </div>
            {isLoading ? (
              <div className="h-36 bg-muted animate-pulse" />
            ) : summary?.weeklyTrend?.length ? (
              <ResponsiveContainer width="100%" height={144}>
                <BarChart data={summary.weeklyTrend} barSize={20}>
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
                    {summary.weeklyTrend.map((_, i, arr) => (
                      <Cell
                        key={i}
                        fill={i === arr.length - 1 ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground)/0.35)"}
                      />
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
          <div className="bg-background p-6">
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
                {summary.topLanguages.slice(0, 6).map(({ language, count }) => {
                  const maxCount = summary.topLanguages[0].count;
                  const pct = Math.round((count / maxCount) * 100);
                  return (
                    <div key={language}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-foreground font-medium">{langName(language)}</span>
                        <span className="text-muted-foreground">{count}</span>
                      </div>
                      <div className="h-1.5 bg-muted">
                        <div className="h-full bg-foreground" style={{ width: `${pct}%` }} />
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
          <div className="border border-border p-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Most Active Form</p>
              <p className="text-sm font-semibold text-foreground">{summary.mostActiveForm.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{summary.mostActiveForm.responseCount} responses</p>
            </div>
            <Link
              href={`/forms/${summary.mostActiveForm.id}`}
              className="px-4 py-2 border border-border text-sm hover:border-foreground transition-colors whitespace-nowrap"
            >
              View Responses
            </Link>
          </div>
        )}

        {/* Forms List */}
        <div>
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-4">Your Forms</h2>

          {isLoading ? (
            <div className="space-y-px border border-border">
              {[1, 2, 3].map(i => <div key={i} className="h-16 bg-muted/40 animate-pulse" />)}
            </div>
          ) : forms && forms.length > 0 ? (
            <div className="border border-border divide-y divide-border">
              {forms.map(form => (
                <div key={form.id} className="flex items-center justify-between px-5 py-4 hover:bg-muted/20 transition-colors group">
                  <div className="flex items-center gap-4 min-w-0">
                    <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{form.title}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className={`text-xs uppercase tracking-wide font-medium ${form.status === 'published' ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {form.status}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(new Date(form.createdAt), "MMM d, yyyy")}
                        </span>
                        {form.status === "published" && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Globe2 className="w-3 h-3" />
                            {form.supportedLanguages?.length || 1} lang{form.supportedLanguages?.length !== 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-4">
                    <Link href={`/forms/${form.id}`} className="flex items-center gap-1.5 px-3 py-1.5 border border-border text-xs hover:border-foreground transition-colors">
                      <Settings className="w-3.5 h-3.5" /> Edit
                    </Link>
                    {form.status === "published" && (
                      <Link href={`/forms/${form.id}/share`} className="flex items-center gap-1.5 px-3 py-1.5 border border-border text-xs hover:border-foreground transition-colors">
                        <Share2 className="w-3.5 h-3.5" /> Share
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-border py-20 text-center">
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
    </DashboardLayout>
  );
}
