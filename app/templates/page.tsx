"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useListTemplates, useUseTemplate } from "@/hooks/api";
import { Loader2, LayoutTemplate, Search, FileText, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const CATEGORIES = [
  { value: "", label: "All" },
  { value: "general", label: "General" },
  { value: "survey", label: "Survey" },
  { value: "feedback", label: "Feedback" },
  { value: "registration", label: "Registration" },
  { value: "quiz", label: "Quiz" },
  { value: "contact", label: "Contact" },
  { value: "event", label: "Event" },
  { value: "hr", label: "HR" },
  { value: "education", label: "Education" },
];

export default function TemplatesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [usingId, setUsingId] = useState<string | null>(null);

  const { data: templates, isLoading } = useListTemplates(category || undefined);

  const useTemplate = useUseTemplate();

  const filtered = (templates || []).filter((t: any) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return t.title.toLowerCase().includes(q) || (t.description || "").toLowerCase().includes(q);
  });

  const handleUse = async (templateId: string, title: string) => {
    setUsingId(templateId);
    try {
      const newForm = await useTemplate.mutateAsync({ id: templateId });
      toast.success(`"${title}" copied to your forms`);
      router.push(`/forms/${newForm.id}`);
    } catch {
      toast.error("Failed to use template. Please try again.");
      setUsingId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-foreground text-2xl font-bold">Templates</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Browse community form templates and use them as a starting point.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              className="pl-9 bg-muted/30"
              placeholder="Search templates…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap -mt-4">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setCategory(c.value)}
              className={`px-3 py-1 text-xs font-medium border transition-colors ${
                category === c.value
                  ? "bg-foreground text-background border-foreground"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="border border-border p-5 space-y-3 animate-pulse">
                <div className="h-4 bg-muted w-3/4" />
                <div className="h-3 bg-muted w-full" />
                <div className="h-3 bg-muted w-1/2" />
                <div className="h-8 bg-muted mt-4" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="border border-border py-20 text-center">
            <LayoutTemplate className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground">
              {search || category ? "No templates match your filter" : "No templates yet"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {search || category
                ? "Try a different search or category."
                : "Publish one of your forms as a template to get started."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((tmpl: any) => (
              <div
                key={tmpl.id}
                className="border border-border p-5 flex flex-col gap-3 hover:border-foreground/40 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                    {tmpl.category}
                  </span>
                  {!tmpl.isPublic && (
                    <span className="text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-700">Private</span>
                  )}
                </div>

                <div className="aspect-[21/9] w-full overflow-hidden rounded-md border bg-muted/50 relative group-hover:border-foreground/20 transition-colors">
                  {tmpl.featureImageUrl ? (
                    <img 
                      src={tmpl.featureImageUrl} 
                      alt={tmpl.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                      <LayoutTemplate className="w-8 h-8 opacity-20" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground leading-snug">{tmpl.title}</p>
                  {tmpl.description && (
                    <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{tmpl.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" />
                    {tmpl.itemCount} field{tmpl.itemCount !== 1 ? "s" : ""}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {tmpl.useCount} use{tmpl.useCount !== 1 ? "s" : ""}
                  </span>
                </div>

                <button
                  onClick={() => handleUse(tmpl.id, tmpl.title)}
                  disabled={usingId === tmpl.id}
                  className="w-full py-2 text-sm font-medium border border-foreground bg-foreground text-background hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {usingId === tmpl.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : null}
                  {usingId === tmpl.id ? "Copying…" : "Use Template"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
