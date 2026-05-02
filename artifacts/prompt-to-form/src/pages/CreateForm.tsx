import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useGenerateForm, useCreateForm } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { Sparkles, Wand2, ArrowRight, Languages, Loader2 } from "lucide-react";
import type { GenerateFormResult, CreateFieldBody } from "@workspace/api-client-react/src/generated/api.schemas";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";

const SUGGESTIONS = [
  "Customer feedback form for a coffee shop",
  "Job application form for a small business",
  "Event RSVP and dietary preferences",
  "Student course satisfaction survey",
  "Product bug report form",
  "Employee onboarding checklist"
];

export default function CreateForm() {
  const [, setLocation] = useLocation();
  const [prompt, setPrompt] = useState("");
  const [generatedForm, setGeneratedForm] = useState<GenerateFormResult | null>(null);
  
  const generateForm = useGenerateForm();
  const createForm = useCreateForm();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    try {
      const result = await generateForm.mutateAsync({ data: { prompt } });
      setGeneratedForm(result);
      toast.success("Form generated successfully!");
    } catch (err) {
      toast.error("Failed to generate form. Please try again.");
    }
  };

  const handleSaveDraft = async () => {
    if (!generatedForm) return;
    
    try {
      const result = await createForm.mutateAsync({
        data: {
          title: generatedForm.form.title,
          description: generatedForm.form.description,
          originalLanguage: generatedForm.detectedLanguage || 'en',
          fields: generatedForm.form.fields
        }
      });
      toast.success("Draft saved!");
      setLocation(`/forms/${result.id}`);
    } catch (err) {
      toast.error("Failed to save draft.");
    }
  };

  const updateField = (index: number, updates: Partial<CreateFieldBody>) => {
    if (!generatedForm) return;
    const newFields = [...generatedForm.form.fields];
    newFields[index] = { ...newFields[index], ...updates };
    setGeneratedForm({
      ...generatedForm,
      form: { ...generatedForm.form, fields: newFields }
    });
  };

  const getLanguageName = (code: string) => {
    return SUPPORTED_LANGUAGES.find(l => l.code === code)?.name || code;
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-primary" />
            Create with AI
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">Describe what you need, and we'll build a multilingual form for you.</p>
        </div>

        {!generatedForm && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative shadow-lg shadow-primary/5 rounded-xl">
              <Textarea 
                placeholder="E.g., A feedback form for our new SaaS product, asking about ease of use, missing features, and overall rating..."
                className="min-h-[160px] text-lg p-6 resize-none bg-card border-primary/20 focus-visible:ring-primary/30"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <div className="absolute bottom-4 right-4">
                <Button 
                  onClick={handleGenerate} 
                  disabled={!prompt.trim() || generateForm.isPending}
                  className="h-12 px-6 shadow-md"
                >
                  {generateForm.isPending ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Wand2 className="w-5 h-5 mr-2" />
                  )}
                  Generate Form
                </Button>
              </div>
            </div>

            {generateForm.isPending && (
              <div className="space-y-4 pt-8">
                <div className="h-8 w-48 bg-muted rounded-md animate-pulse"></div>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-20 bg-muted/50 rounded-xl animate-pulse" style={{ animationDelay: `${i * 150}ms`}}></div>
                  ))}
                </div>
              </div>
            )}

            {!generateForm.isPending && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground mb-3 block">Try a prompt:</Label>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((suggestion, i) => (
                    <Badge 
                      key={i} 
                      variant="secondary" 
                      className="cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors px-3 py-1.5 text-sm font-normal"
                      onClick={() => setPrompt(suggestion)}
                    >
                      {suggestion}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {generatedForm && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="bg-card border border-border shadow-sm rounded-xl p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="space-y-2 flex-1">
                  <Input 
                    value={generatedForm.form.title}
                    onChange={(e) => setGeneratedForm({ ...generatedForm, form: { ...generatedForm.form, title: e.target.value }})}
                    className="text-2xl font-bold border-transparent hover:border-input focus:border-input px-0 h-auto py-1 shadow-none"
                  />
                  <Input 
                    value={generatedForm.form.description || ""}
                    onChange={(e) => setGeneratedForm({ ...generatedForm, form: { ...generatedForm.form, description: e.target.value }})}
                    className="text-muted-foreground border-transparent hover:border-input focus:border-input px-0 h-auto py-1 shadow-none"
                    placeholder="Add a description..."
                  />
                </div>
                <Badge variant="outline" className="ml-4 flex items-center gap-1.5 bg-primary/5 text-primary border-primary/20 shrink-0">
                  <Languages className="w-3.5 h-3.5" />
                  Detected: {getLanguageName(generatedForm.detectedLanguage)}
                </Badge>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-foreground mb-4">Generated Fields</h3>
                {generatedForm.form.fields.map((field, index) => (
                  <Card key={index} className="border-border/50 bg-background/50 shadow-sm">
                    <CardContent className="p-4 flex gap-4 items-start">
                      <div className="w-8 h-8 rounded bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground shrink-0 mt-1">
                        {index + 1}
                      </div>
                      <div className="flex-1 space-y-2">
                        <Input 
                          value={field.label}
                          onChange={(e) => updateField(index, { label: e.target.value })}
                          className="font-medium bg-transparent border-transparent hover:border-input focus:bg-background"
                        />
                        <div className="flex gap-2 items-center">
                          <Badge variant="secondary" className="text-xs font-normal capitalize">
                            {field.fieldType.replace('_', ' ')}
                          </Badge>
                          {field.isRequired && (
                            <Badge variant="outline" className="text-xs font-normal text-destructive border-destructive/30 bg-destructive/5">Required</Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 sticky bottom-4 bg-background/80 backdrop-blur-md p-4 rounded-xl border border-border shadow-lg">
              <Button variant="outline" onClick={() => setGeneratedForm(null)}>
                Start Over
              </Button>
              <Button onClick={handleSaveDraft} disabled={createForm.isPending}>
                {createForm.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save and Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
