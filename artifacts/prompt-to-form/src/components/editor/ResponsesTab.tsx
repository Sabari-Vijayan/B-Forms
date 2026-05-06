import { useMemo, useState } from "react";
import { format } from "date-fns";
import { FileSpreadsheet, Download, Loader2 } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";
import type { Submission } from "@workspace/api-client-react";
import { toast } from "sonner";

interface ResponsesTabProps {
  formTitle: string;
  submissions: Submission[];
  fields: any[];
  isLoading: boolean;
  onViewSubmission: (sub: Submission) => void;
  selectedSubmissionId?: string;
}

export function ResponsesTab({
  formTitle,
  submissions,
  fields,
  isLoading,
  onViewSubmission,
  selectedSubmissionId
}: ResponsesTabProps) {
  const [isExporting, setIsExporting] = useState(false);
  const orderedFields = useMemo(() => 
    (fields || []).slice().sort((a, b) => a.orderIndex - b.orderIndex)
  , [fields]);

  const handleExportCSV = () => {
    if (!submissions.length) return;
    setIsExporting(true);

    setTimeout(() => {
      try {
        const metaCols = ["Submitted At", "Language", "Translation Status"];
        const fieldCols = orderedFields.map(f => f.label);
        const header = [...metaCols, ...fieldCols];
        
        const rows = submissions.map(sub => {
          const data = sub.translatedResponsesJson || sub.rawResponsesJson || {};
          const lName = SUPPORTED_LANGUAGES.find(l => l.code === sub.respondentLanguage)?.name || sub.respondentLanguage;
          
          let dateStr = "N/A";
          if (sub.submittedAt) {
            const d = new Date(sub.submittedAt);
            if (!isNaN(d.getTime())) {
              dateStr = format(d, "yyyy-MM-dd HH:mm");
            }
          }

          const meta = [dateStr, lName, sub.translationStatus];
          const answers = orderedFields.map(f => {
            const val = (data as Record<string, any>)[f.id];
            if (Array.isArray(val)) return val.join("; ");
            return val != null ? String(val) : "";
          });
          return [...meta, ...answers];
        });

        const escape = (v: any) => {
          const str = String(v ?? "");
          return `"${str.replace(/"/g, '""')}"`;
        };
        
        const csvContent = [
          header.map(escape).join(","),
          ...rows.map(row => row.map(escape).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${formTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_responses_${format(new Date(), "yyyy-MM-dd")}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("CSV export complete");
      } catch (err) {
        console.error("Export failed:", err);
        toast.error("Failed to export CSV. Please try again.");
      } finally {
        setIsExporting(false);
      }
    }, 100);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!submissions.length) {
    return (
      <div className="border border-border py-20 text-center">
        <FileSpreadsheet className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm font-medium text-foreground">No responses yet</p>
        <p className="text-xs text-muted-foreground mt-1">Share your form to start collecting responses.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {submissions.length} {submissions.length === 1 ? "response" : "responses"}
        </p>
        <button
          onClick={handleExportCSV}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2 text-sm border border-border hover:border-foreground text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Export CSV
            </>
          )}
        </button>
      </div>

      <div className="border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">#</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Date</th>
              {orderedFields.slice(0, 3).map(f => (
                <th key={f.id} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground truncate max-w-[150px]">
                  {f.label}
                </th>
              ))}
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Language</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Translation</th>
              <th className="px-4 py-3 w-20" />
            </tr>
          </thead>
          <tbody>
            {submissions.map((sub, idx) => {
              const data = sub.translatedResponsesJson || sub.rawResponsesJson || {};
              return (
                <tr
                  key={sub.id}
                  onClick={() => onViewSubmission(sub)}
                  className={`border-b border-border last:border-0 transition-colors cursor-pointer ${selectedSubmissionId === sub.id ? "bg-muted/40" : "hover:bg-muted/20"}`}
                >
                  <td className="px-4 py-3 text-muted-foreground">{idx + 1}</td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {(() => {
                      if (!sub.submittedAt) return "N/A";
                      const d = new Date(sub.submittedAt);
                      if (isNaN(d.getTime())) return "Invalid Date";
                      return format(d, "MMM d, yyyy · HH:mm");
                    })()}
                  </td>
                  {orderedFields.slice(0, 3).map(f => {
                    const val = (data as Record<string, any>)[f.id];
                    const display = Array.isArray(val) ? val.join(", ") : val != null ? String(val) : "—";
                    return (
                      <td key={f.id} className="px-4 py-3 text-foreground truncate max-w-[150px]">
                        {display}
                      </td>
                    );
                  })}
                  <td className="px-4 py-3">
                    <span className="border border-border px-2 py-0.5 text-xs font-medium">
                      {SUPPORTED_LANGUAGES.find(l => l.code === sub.respondentLanguage)?.name || sub.respondentLanguage}
                    </span>
                  </td>
                  <td className="px-4 py-3 capitalize text-xs">{sub.translationStatus}</td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-xs font-medium text-muted-foreground hover:text-foreground">View</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
