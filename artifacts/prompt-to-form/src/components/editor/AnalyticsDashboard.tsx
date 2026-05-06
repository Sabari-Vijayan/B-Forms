import { useMemo, useState } from "react";
import { format, subDays, startOfDay } from "date-fns";
import { FileSpreadsheet, Loader2, BrainCircuit, Activity, CheckCircle2, Clock, Sparkles, Send } from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, 
  PieChart, Pie, Legend
} from "recharts";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";
import { useGenerateFormSentimentSummary } from "@workspace/api-client-react";
import type { Submission } from "@workspace/api-client-react";
import { useParams } from "wouter";

interface AnalyticsDashboardProps {
  formTitle: string;
  submissions: Submission[];
  fields: any[];
  isLoading: boolean;
  lastUpdatedAt: Date | null;
  newResponseCount: number;
}

const WEEKLY_COLORS = ["#e0e7ff", "#c7d2fe", "#a5b4fc", "#818cf8", "#6366f1", "#4f46e5", "#3730a3"];
const LANG_COLORS = ["#818cf8", "#34d399", "#60a5fa", "#f472b6", "#fb923c"];
const STATUS_COLORS: Record<string, string> = {
  done: "#10b981",
  pending: "#f59e0b",
  failed: "#ef4444",
  skipped: "#6b7280"
};

export function AnalyticsDashboard({
  submissions,
  fields,
  isLoading,
  lastUpdatedAt,
}: AnalyticsDashboardProps) {
  const { id } = useParams();
  const sentimentMutation = useGenerateFormSentimentSummary();
  const [aiSummary, setAiSummary] = useState<string | null>(null);

  const isAnalyzing = sentimentMutation.isPending;

  const stats = useMemo(() => {
    const total = submissions.length;
    const today = startOfDay(new Date());
    
    // Weekly Trend
    const weeklyTrend = Array.from({ length: 7 }, (_, i) => {
      const day = subDays(today, 6 - i);
      const dayStr = format(day, "MMM d");
      const count = submissions.filter(s => {
        if (!s.submittedAt) return false;
        const date = new Date(s.submittedAt);
        if (isNaN(date.getTime())) return false;
        return format(startOfDay(date), "MMM d") === dayStr;
      }).length;
      return { date: dayStr, count };
    });

    // Language Breakdown
    const langCounts: Record<string, number> = {};
    submissions.forEach(s => { langCounts[s.respondentLanguage] = (langCounts[s.respondentLanguage] || 0) + 1; });
    const langBreakdown = Object.entries(langCounts)
      .map(([code, count]) => ({ code, name: SUPPORTED_LANGUAGES.find(l => l.code === code)?.name || code, count }))
      .sort((a, b) => b.count - a.count);

    // Status Breakdown
    const statusCounts: Record<string, number> = { done: 0, pending: 0, failed: 0, skipped: 0 };
    submissions.forEach(s => { statusCounts[s.translationStatus] = (statusCounts[s.translationStatus] || 0) + 1; });
    const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

    // Field Distributions (Choice fields)
    const fieldDistributions = fields
      .filter(f => f.fieldType === "single_choice" || f.fieldType === "multi_choice" || f.fieldType === "rating")
      .map(f => {
        const counts: Record<string, number> = {};
        submissions.forEach(s => {
          const data = s.translatedResponsesJson || s.rawResponsesJson || {};
          const val = (data as Record<string, any>)[f.id];
          if (Array.isArray(val)) {
            val.forEach(v => { counts[String(v)] = (counts[String(v)] || 0) + 1; });
          } else if (val != null) {
            counts[String(val)] = (counts[String(val)] || 0) + 1;
          }
        });
        const data = Object.entries(counts).map(([name, count]) => ({ name, count }));
        return { fieldId: f.id, label: f.label, data };
      });

    return { total, weeklyTrend, langBreakdown, statusData, fieldDistributions };
  }, [submissions, fields]);

  const handleRunAnalysis = async () => {
    try {
      const result = await sentimentMutation.mutateAsync({ id: id! });
      setAiSummary(result.summary || "No summary generated.");
    } catch (err) {
      console.error("Analysis failed", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!stats.total) {
    return (
      <div className="border border-border py-20 text-center">
        <FileSpreadsheet className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm font-medium text-foreground">No responses yet</p>
        <p className="text-xs text-muted-foreground mt-1">Share your form to start collecting responses.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-32">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">
            {stats.total} {stats.total === 1 ? "response" : "responses"} collected
          </p>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-foreground opacity-40" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-foreground" />
            </span>
            <span className="text-xs text-muted-foreground">
              {lastUpdatedAt ? `Updated ${format(lastUpdatedAt, "HH:mm:ss")}` : "Live"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 border border-border divide-y sm:divide-y-0 sm:divide-x divide-border shadow-sm">
        <StatTile label="Total Responses" value={stats.total} icon={Activity} />
        <StatTile label="Avg / Day" value={(stats.total / 7).toFixed(1)} icon={Clock} />
        <StatTile label="Processing" value={`${Math.round(((stats.statusData.find(d => d.name === "done")?.value || 0) + (stats.statusData.find(d => d.name === "skipped")?.value || 0)) / stats.total * 100)}%`} icon={CheckCircle2} />
        <StatTile label="Top Language" value={stats.langBreakdown[0]?.name || "—"} icon={Languages} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard title="Submission Workflow" description="Tracking AI translation and processing status.">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={stats.statusData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {stats.statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: 0, fontSize: 12 }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Weekly Volume" description="Submissions received over the last 7 days.">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.weeklyTrend} barSize={22}>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis hide allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: 0, fontSize: 12, padding: "4px 10px" }}
                cursor={{ fill: "hsl(var(--muted))" }}
              />
              <Bar dataKey="count" radius={0}>
                {stats.weeklyTrend.map((_, i) => (
                  <Cell key={i} fill={WEEKLY_COLORS[i] ?? WEEKLY_COLORS[WEEKLY_COLORS.length - 1]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard title="Respondent Languages">
          <div className="space-y-4 pt-2">
            {stats.langBreakdown.map(({ code, name, count }, idx) => (
              <div key={code}>
                <div className="flex justify-between text-xs mb-1.5 font-medium">
                  <span className="text-foreground">{name}</span>
                  <span className="text-muted-foreground">{count} ({Math.round((count / stats.total) * 100)}%)</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all"
                    style={{ width: `${(count / stats.langBreakdown[0].count) * 100}%`, backgroundColor: LANG_COLORS[idx % LANG_COLORS.length] }}
                  />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        {stats.fieldDistributions.length > 0 && (
          <ChartCard title="Key Field Insight">
             <div className="space-y-6 pt-2">
                {stats.fieldDistributions.slice(0, 2).map((dist) => (
                  <div key={dist.fieldId}>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">{dist.label}</p>
                    <ResponsiveContainer width="100%" height={100}>
                      <BarChart data={dist.data.sort((a, b) => b.count - a.count).slice(0, 5)}>
                        <XAxis dataKey="name" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ fontSize: 11 }} />
                        <Bar dataKey="count" fill="#818cf8" radius={[2, 2, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ))}
             </div>
          </ChartCard>
        )}
      </div>

      {/* Large AI Sentiment Analysis Section */}
      <div className="border border-border bg-card shadow-sm overflow-hidden flex flex-col min-h-[400px]">
        <div className="p-6 border-b border-border bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center text-background">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-foreground">AI Intelligence Hub</p>
              <p className="text-[10px] text-muted-foreground uppercase font-medium tracking-tight mt-0.5">Sentiment Analysis & Qualitative Summary</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <div className="flex -space-x-2">
                {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-background bg-muted overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} alt="AI" />
                </div>)}
             </div>
             <span className="text-[10px] font-medium text-muted-foreground ml-2 uppercase tracking-wide">3 Models Active</span>
          </div>
        </div>

        <div className="flex-1 p-8 flex flex-col bg-background/50 relative overflow-y-auto max-h-[500px]">
          {!aiSummary && !isAnalyzing ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center max-w-sm mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-6 animate-pulse">
                 <Sparkles className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Ready to analyze feedback?</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-8">
                I can process all current submissions to find patterns, common complaints, and overall emotional tone across all languages.
              </p>
              <button 
                onClick={handleRunAnalysis}
                disabled={isAnalyzing}
                className="flex items-center gap-2.5 bg-foreground text-background px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Analyze Sentiment Now
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex gap-4 items-start max-w-3xl">
                <div className="w-8 h-8 rounded-full bg-foreground flex-shrink-0 flex items-center justify-center text-background shadow-md">
                   <BrainCircuit className="w-4 h-4" />
                </div>
                <div className="flex-1 bg-muted/40 p-6 rounded-2xl rounded-tl-none border border-border shadow-sm">
                   {isAnalyzing ? (
                     <div className="flex items-center gap-3 text-sm text-muted-foreground py-4">
                       <Loader2 className="w-4 h-4 animate-spin" />
                       <span className="italic">Scanning submissions and detecting emotional patterns...</span>
                     </div>
                   ) : (
                     <div className="prose prose-sm max-w-none text-foreground leading-relaxed whitespace-pre-wrap font-medium">
                       {aiSummary}
                     </div>
                   )}
                </div>
              </div>

              {!isAnalyzing && (
                <div className="flex justify-end gap-2 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
                   <button 
                    onClick={() => { setAiSummary(null); handleRunAnalysis(); }}
                    className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-full transition-colors"
                   >
                     <Activity className="w-3 h-3" />
                     Re-analyze
                   </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 bg-muted/20 border-t border-border flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">AI Engine Online</span>
           </div>
           <p className="text-[10px] text-muted-foreground italic">Powered by Gemini 1.5 Flash</p>
        </div>
      </div>
    </div>
  );
}

function StatTile({ label, value, icon: Icon }: { label: string, value: string | number, icon?: any }) {
  return (
    <div className="px-5 py-4 sm:px-6 sm:py-5 group hover:bg-muted/10 transition-colors">
      <div className="flex items-center gap-2 mb-1">
        {Icon && <Icon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />}
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</p>
      </div>
      <p className="text-2xl font-semibold text-foreground tracking-tight">{value}</p>
    </div>
  );
}

function ChartCard({ title, description, children, icon: Icon }: { title: string, description?: string, children: React.ReactNode, icon?: any }) {
  return (
    <div className="border border-border p-6 bg-card transition-all hover:border-border/80 shadow-sm">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {Icon && <Icon className="w-3.5 h-3.5 text-muted-foreground" />}
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{title}</p>
          </div>
          {description && <p className="text-[10px] text-muted-foreground/70 font-medium tracking-tight">{description}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

function Languages(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 8 6 6" />
      <path d="m4 14 6-6 2-3" />
      <path d="M2 5h12" />
      <path d="M7 2h1" />
      <path d="m22 22-5-10-5 10" />
      <path d="M14 18h6" />
    </svg>
  )
}
