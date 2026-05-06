import { useState } from "react";
import { format } from "date-fns";
import { X, Languages } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";
import type { Submission } from "@workspace/api-client-react";

interface ResponseDrawerProps {
  submission: Submission | null;
  fields: any[];
  onClose: () => void;
}

export function ResponseDrawer({ submission, fields, onClose }: ResponseDrawerProps) {
  const [revealedFields, setRevealedFields] = useState<Record<string, boolean>>({});

  if (!submission) return null;

  const toggleReveal = (fieldId: string) => {
    setRevealedFields(prev => ({ ...prev, [fieldId]: !prev[fieldId] }));
  };

  const orderedFields = (fields || []).slice().sort((a, b) => a.orderIndex - b.orderIndex);
  const raw = (submission.rawResponsesJson || {}) as Record<string, any>;
  const translated = (submission.translatedResponsesJson || {}) as Record<string, any>;
  const hasTranslation = submission.translationStatus === "done";
  const langName = SUPPORTED_LANGUAGES.find(l => l.code === submission.respondentLanguage)?.name || submission.respondentLanguage;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] z-40 transition-opacity" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-background border-l border-border z-50 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between px-8 py-6 border-b border-border shrink-0 bg-card">
          <div>
            <h2 className="text-lg font-semibold text-foreground tracking-tight">Response Detail</h2>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1.5 font-medium">
              <span className="bg-muted px-2 py-0.5 rounded">
                {(() => {
                  if (!submission.submittedAt) return "N/A";
                  const d = new Date(submission.submittedAt);
                  if (isNaN(d.getTime())) return "Invalid Date";
                  return format(d, "MMM d, yyyy · HH:mm");
                })()}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Languages className="w-3 h-3" />
                {langName}
              </span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-all"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-4 bg-background">
          <div className="space-y-2">
            {orderedFields.map(f => {
              const rawVal = raw[f.id];
              const translatedVal = translated[f.id];
              const isRevealed = revealedFields[f.id];
              
              const rawDisplay = Array.isArray(rawVal) ? rawVal.join(", ") : rawVal != null ? String(rawVal) : "—";
              const translatedDisplay = Array.isArray(translatedVal) ? translatedVal.join(", ") : translatedVal != null ? String(translatedVal) : null;

              // Primary display is the translated text if it exists, otherwise the raw text
              const primaryDisplay = translatedDisplay || rawDisplay;
              const canReveal = hasTranslation && translatedDisplay && translatedDisplay !== rawDisplay;

              return (
                <div key={f.id} className="py-6 border-b border-border/50 last:border-0 group">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      {f.label}
                    </p>
                    {canReveal && (
                      <button 
                        onClick={() => toggleReveal(f.id)}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tight transition-all ${
                          isRevealed 
                            ? "bg-foreground text-background" 
                            : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                        }`}
                      >
                        <Languages className="w-3 h-3" />
                        {isRevealed ? "Hide Original" : "Show Original"}
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <p className="text-base text-foreground font-medium leading-relaxed whitespace-pre-wrap">
                      {primaryDisplay}
                    </p>
                    
                    {isRevealed && (
                      <div className="pl-4 border-l-2 border-muted py-1 animate-in fade-in slide-in-from-left-1 duration-200">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 opacity-60">
                          Original ({submission.respondentLanguage})
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed italic">
                          {rawDisplay}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6 border-t border-border bg-muted/20 shrink-0">
          <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-medium">
            End of Submission
          </p>
        </div>
      </div>
    </>
  );
}
