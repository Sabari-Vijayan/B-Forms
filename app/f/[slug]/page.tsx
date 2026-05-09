"use client";

import { useState, useEffect, use } from "react";
import { useSearchParams } from "next/navigation";
import { useGetPublicForm, useSubmitForm } from "@/hooks/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Globe, Star, Download, Image as ImageIcon, Upload, X, Info } from "lucide-react";
import { toast } from "sonner";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import confetti from "canvas-confetti";

function StarRating({ value, onChange, required }: { value: number; onChange: (v: number) => void; required?: boolean }) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;
  return (
    <div className="flex items-center gap-1" role="group" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star === value ? 0 : star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="p-0.5 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          aria-label={`${star} star${star !== 1 ? "s" : ""}`}
        >
          <Star
            className={`w-8 h-8 transition-colors ${
              star <= display
                ? "fill-foreground stroke-foreground"
                : "fill-transparent stroke-muted-foreground/40"
            }`}
          />
        </button>
      ))}
      {required && value === 0 && (
        <input type="number" required className="sr-only" value="" onChange={() => {}} aria-hidden="true" tabIndex={-1} />
      )}
      {value > 0 && (
        <span className="ml-2 text-sm text-muted-foreground">{value} / 5</span>
      )}
    </div>
  );
}

export default function PublicFormPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  
  const [selectedLang, setSelectedLang] = useState<string>("");
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSwitchingLanguage, setIsSwitchingLanguage] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [refetchInterval, setRefetchInterval] = useState<number | false>(false);

  const { data: form, isLoading, error } = useGetPublicForm(slug, refetchInterval);
  const submitForm = useSubmitForm(slug);

  const searchParams = useSearchParams();

  const normalizeLang = (lang: string) => lang.toLowerCase().split("-")[0];

  useEffect(() => {
    if (form && selectedLang) {
      const isMissing = selectedLang !== form.originalLanguage && 
                        form.supportedLanguages.includes(selectedLang) &&
                        !form.translations?.some((tr: any) => normalizeLang(tr.language) === normalizeLang(selectedLang));
      setRefetchInterval(isMissing ? 3000 : false);
    }
  }, [form, selectedLang]);

  useEffect(() => {
    if (searchParams.get("print") === "1" && form && !isLoading) {
      const timer = setTimeout(() => {
        window.print();
      }, 800);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [searchParams, form, isLoading]);

  useEffect(() => {
    if (form && !selectedLang) {
      const available = Array.from(new Set([
        form.originalLanguage,
        ...form.supportedLanguages,
        ...(form.translations?.map((tr: any) => tr.language) || []),
      ]));
      const browserLang = normalizeLang(navigator.language);
      if (available.includes(browserLang)) {
        setSelectedLang(browserLang);
      } else if (available.includes("en")) {
        setSelectedLang("en");
      } else {
        setSelectedLang(form.originalLanguage);
      }
    }
  }, [form, selectedLang]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Form not found</CardTitle>
            <CardDescription>This form might have been closed or doesn't exist.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const availableLanguages = Array.from(new Set([
    form.originalLanguage,
    ...form.supportedLanguages,
    ...(form.translations?.map((tr: any) => tr.language) || []),
  ]));

  const currentTranslation = form.translations?.find((tr: any) => normalizeLang(tr.language) === normalizeLang(selectedLang));
  const translationMap = (currentTranslation?.translationsJson as Record<string, string>) || {};
  const isTranslated = !!currentTranslation && normalizeLang(currentTranslation.language) !== normalizeLang(form.originalLanguage);
  const t = isTranslated ? translationMap : {};

  const title = t.title || form.title;
  const description = t.description || form.description;
  const isTranslating = !!refetchInterval;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitForm.mutateAsync({
        respondentLanguage: selectedLang,
        responses: formData,
      });
      setIsSubmitted(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"],
      });
    } catch {
      toast.error("Failed to submit form. Please try again.");
    }
  };

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleFileUpload = async (fieldId: string, file: File) => {
    if (!file) return;
    setUploadingField(fieldId);
    try {
      const data = new FormData();
      data.append("file", file);

      const response = await fetch("/api/public/upload", {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Upload failed");
      }

      const result = await response.json();
      handleInputChange(fieldId, result.url);
      toast.success("Image uploaded successfully");
    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error(err.message || "Failed to upload image");
    } finally {
      setUploadingField(null);
    }
  };

  const handleLanguageChange = (lang: string) => {
    if (lang === selectedLang) return;
    setIsSwitchingLanguage(true);
    window.setTimeout(() => {
      setSelectedLang(lang);
      window.setTimeout(() => setIsSwitchingLanguage(false), 180);
    }, 120);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/10 p-4">
        <Card className="max-w-md w-full text-center py-12 animate-in fade-in zoom-in duration-500">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <CardTitle className="text-2xl mb-2">{t.thankYouTitle || "Thank you!"}</CardTitle>
          <CardDescription className="text-base">{t.thankYouMessage || "Your response has been recorded."}</CardDescription>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/10 py-12 px-4 print:bg-white print:py-0 print:px-0" lang={selectedLang}>
      <div className="max-w-2xl mx-auto print:max-w-none print:m-0 print:p-[0.75in]">
        {isTranslating && (
          <Alert className="mb-6 bg-blue-50/50 border-blue-200/50 text-blue-800 animate-in fade-in slide-in-from-top-4">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-900 font-semibold">Translation in progress</AlertTitle>
            <AlertDescription className="text-blue-700/80">
              The AI is currently translating this form to <strong>{SUPPORTED_LANGUAGES.find(l => l.code === selectedLang)?.name || selectedLang}</strong>. 
              The form is currently falling back to its original language and will update automatically once the translation is ready.
            </AlertDescription>
          </Alert>
        )}
        <div className="flex justify-end mb-4 print:hidden">
          <div className="flex items-center gap-2 bg-background/95 border border-border/70 rounded-md px-3 py-1.5 shadow-sm">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <select
              className="bg-transparent border-none text-sm outline-none cursor-pointer"
              value={selectedLang}
              onChange={(e) => handleLanguageChange(e.target.value)}
            >
              {availableLanguages.map((code) => (
                <option key={code} value={code}>
                  {SUPPORTED_LANGUAGES.find((l) => l.code === code)?.name || code}
                  {code === form.originalLanguage ? " (Original)" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Card className={`shadow-xl border-t-4 border-t-primary print:shadow-none print:border-0 print:bg-white print:p-0 transition-all duration-200 overflow-hidden ${isSwitchingLanguage ? "opacity-70 saturate-75" : "opacity-100"}`}>
          {form.featureImageUrl && (
            <div className="aspect-[21/9] w-full overflow-hidden border-b print:hidden relative">
              <img 
                src={form.featureImageUrl} 
                alt={title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/10 to-transparent" />
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <CardHeader className="border-b pb-6 print:border-b-2 print:border-black print:pb-4 print:mb-8 print:pt-0 print:px-0">
              <CardTitle className="text-3xl font-bold print:text-3xl">{title}</CardTitle>
              {description && (
                <CardDescription className="text-base mt-2 text-foreground/80 print:text-sm print:text-black print:mt-4 print:italic">{description}</CardDescription>
              )}
            </CardHeader>

            <CardContent className={`space-y-8 pt-6 print:space-y-12 print:px-0 transition-opacity duration-200 ${isSwitchingLanguage ? "opacity-50" : "opacity-100"}`}>
              {(form.documentJson.items || [])
                .map((item: any) => {
                  const label = t[`item_${item.itemId}_title`] || item.title;
                  const placeholder = t[`item_${item.itemId}_description`] || item.description;

                  if (!item.questionItem) {
                    return (
                      <div key={item.itemId} className="space-y-2 print:space-y-4 print:break-inside-avoid border-l-4 border-primary/20 pl-4 py-1">
                        <h3 className="text-lg font-bold text-foreground">{label}</h3>
                        {placeholder && (
                          <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{placeholder}</p>
                        )}
                      </div>
                    );
                  }

                  const question = item.questionItem.question;
                  const choice = question.choiceQuestion;
                  const text = question.textQuestion;
                  const rating = question.ratingQuestion;
                  const file = question.fileQuestion;

                  const originalOptions: string[] = choice?.options || [];
                  const displayOptions = originalOptions.map(
                    (orig, i) => t[`item_${item.itemId}_option_${i}`] || orig
                  );

                  return (
                    <div key={item.itemId} className="space-y-3 print:space-y-4 print:break-inside-avoid">
                      <Label className="text-base font-medium flex gap-1 print:text-lg print:text-black">
                        {label}
                        {question.required && <span className="text-destructive print:text-black">*</span>}
                      </Label>

                      {text && (
                        <>
                          {text.paragraph ? (
                            <Textarea
                              required={question.required}
                              placeholder={placeholder || ""}
                              value={formData[item.itemId] || ""}
                              onChange={(e) => handleInputChange(item.itemId, e.target.value)}
                              className="bg-muted/30 focus:bg-background min-h-[100px] print:hidden"
                            />
                          ) : (
                            <Input
                              required={question.required}
                              placeholder={placeholder || ""}
                              value={formData[item.itemId] || ""}
                              onChange={(e) => handleInputChange(item.itemId, e.target.value)}
                              className="bg-muted/30 focus:bg-background print:hidden"
                            />
                          )}
                          <div className="hidden print:block border-b border-black/30 min-h-[2.5rem] w-full" />
                        </>
                      )}

                      {choice && (
                        <>
                          {choice.type === 'CHECKBOX' ? (
                            <div className="space-y-2 print:hidden">
                              {originalOptions.map((orig, i) => {
                                const currentVals = (formData[item.itemId] as string[]) || [];
                                const isChecked = currentVals.includes(orig);
                                return (
                                  <div
                                    key={i}
                                    className="flex items-center space-x-3 bg-muted/20 p-3 rounded-lg border border-transparent hover:border-border transition-colors"
                                  >
                                    <Checkbox
                                      id={`${item.itemId}-${i}`}
                                      checked={isChecked}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          handleInputChange(item.itemId, [...currentVals, orig]);
                                        } else {
                                          handleInputChange(item.itemId, currentVals.filter((v) => v !== orig));
                                        }
                                      }}
                                    />
                                    <Label htmlFor={`${item.itemId}-${i}`} className="font-normal cursor-pointer flex-1">
                                      {displayOptions[i]}
                                    </Label>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <RadioGroup
                              required={question.required}
                              value={formData[item.itemId] || ""}
                              onValueChange={(val) => handleInputChange(item.itemId, val)}
                              className="space-y-2 print:hidden"
                            >
                              {originalOptions.map((orig, i) => (
                                <div
                                  key={i}
                                  className="flex items-center space-x-3 bg-muted/20 p-3 rounded-lg border border-transparent hover:border-border transition-colors"
                                >
                                  <RadioGroupItem value={orig} id={`${item.itemId}-${i}`} />
                                  <Label htmlFor={`${item.itemId}-${i}`} className="font-normal cursor-pointer flex-1">
                                    {displayOptions[i]}
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          )}
                          <div className="hidden print:grid print:grid-cols-1 print:gap-y-4 print:pt-1">
                            {displayOptions.map((option, i) => (
                              <div key={i} className="flex items-center gap-4">
                                <span className={`inline-block w-5 h-5 border-2 border-black/40 ${choice.type === 'RADIO' ? 'rounded-full' : 'rounded-sm'}`} />
                                <span className="text-base text-black">{option}</span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}

                      {rating && (
                        <>
                          <div className="print:hidden">
                            <StarRating
                              value={Number(formData[item.itemId]) || 0}
                              onChange={(val) => handleInputChange(item.itemId, val)}
                              required={question.required}
                            />
                          </div>
                          <div className="hidden print:flex items-center gap-8 pt-4">
                            {[...Array(rating.maxRating || 5)].map((_, i) => {
                              const num = i + 1;
                              return (
                                <div key={num} className="flex flex-col items-center gap-2">
                                  <span className="inline-block w-12 h-12 border-2 border-black/40 rounded-full text-xl font-bold flex items-center justify-center">
                                    {num}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      )}

                      {file && (
                        <div className="space-y-4">
                          <div className="print:hidden">
                            {formData[item.itemId] ? (
                              <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-lg border bg-muted/20 group">
                                <img 
                                  src={formData[item.itemId]} 
                                  alt="Uploaded" 
                                  className="h-full w-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleInputChange(item.itemId, null)}
                                  className="absolute top-2 right-2 p-1 bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-xl p-8 bg-muted/5 hover:bg-muted/10 transition-colors relative">
                                <Input
                                  type="file"
                                  accept="image/*"
                                  className="absolute inset-0 opacity-0 cursor-pointer"
                                  disabled={uploadingField === item.itemId}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleFileUpload(item.itemId, file);
                                  }}
                                />
                                {uploadingField === item.itemId ? (
                                  <>
                                    <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                                    <p className="text-sm font-medium">Uploading...</p>
                                  </>
                                ) : (
                                  <>
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                      <Upload className="w-6 h-6 text-primary" />
                                    </div>
                                    <p className="text-sm font-medium">Click or drag to upload image</p>
                                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="hidden print:block border-2 border-dashed border-black/20 rounded-lg p-12 text-center text-black/40 italic">
                             [Image Upload Field]
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
            </CardContent>

            <CardFooter className="bg-muted/10 p-6 border-t mt-6 print:hidden">
              <Button type="submit" size="lg" className="w-full md:w-auto" disabled={submitForm.isPending}>
                {submitForm.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {t.submitButton || "Submit"}
              </Button>
            </CardFooter>

            <div className="hidden print:block border-t border-black/10 pt-8 mt-12 text-[10px] text-black/40 text-center">
              Form Reference: {slug} — Generated by Prompt-to-Form
            </div>
          </form>

          {isSwitchingLanguage && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-[inherit] bg-background/35 backdrop-blur-[1px]">
              <div className="flex items-center gap-2 rounded-full border border-border/70 bg-background/90 px-3 py-1.5 text-xs text-muted-foreground shadow-sm">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Switching language
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
