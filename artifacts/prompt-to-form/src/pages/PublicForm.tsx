import { useState, useEffect } from "react";
import { useParams, useSearch } from "wouter";
import { useGetPublicForm, useSubmitForm } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Globe, Star, Download } from "lucide-react";
import { toast } from "sonner";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";
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

export default function PublicForm() {
  const { slug } = useParams();
  const { data: form, isLoading, error } = useGetPublicForm(slug as string, { 
    query: { 
      enabled: !!slug,
      staleTime: 300_000, // 5 minutes cache for public forms
      queryKey: [`/api/public/forms/${slug}`]
    } 
  });
  const submitForm = useSubmitForm();

  const [selectedLang, setSelectedLang] = useState<string>("");
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSwitchingLanguage, setIsSwitchingLanguage] = useState(false);

  const search = useSearch();

  useEffect(() => {
    const params = new URLSearchParams(search);
    if (params.get("print") === "1" && form && !isLoading) {
      // Small delay to ensure all dynamic content (like translations) is rendered
      const timer = setTimeout(() => {
        window.print();
      }, 800);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [search, form, isLoading]);

  const normalizeLang = (lang: string) => lang.toLowerCase().split("-")[0];

  useEffect(() => {
    if (form && !selectedLang) {
      const available = Array.from(new Set([
        form.originalLanguage,
        ...form.supportedLanguages,
        ...(form.translations?.map((tr) => tr.language) || []),
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

  // All languages the dropdown should offer — original is always present
  const availableLanguages = Array.from(new Set([
    form.originalLanguage,
    ...form.supportedLanguages,
    ...(form.translations?.map((tr) => tr.language) || []),
  ]));

  const currentTranslation = form.translations?.find((tr) => normalizeLang(tr.language) === normalizeLang(selectedLang));
  const translationMap = (currentTranslation?.translationsJson as Record<string, string>) || {};
  const isTranslated = !!currentTranslation && normalizeLang(currentTranslation.language) !== normalizeLang(form.originalLanguage);
  const t = isTranslated ? translationMap : {};

  const title = t.title || form.title;
  const description = t.description || form.description;


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitForm.mutateAsync({
        slug: slug as string,
        data: {
          respondentLanguage: selectedLang,
          responses: formData,
        },
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
        {/* Language selector — always shows original + all published languages */}
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
              {form.fields
                .slice()
                .sort((a, b) => a.orderIndex - b.orderIndex)
                .map((field) => {
                  const label = t[`field_${field.id}_label`] || field.label;
                  const placeholder = t[`field_${field.id}_placeholder`] || field.placeholder;

                  // Display labels for options come from translations; stored values use the
                  // original option text so language switches don't invalidate selections.
                  const originalOptions: string[] = field.optionsJson || [];
                  const displayOptions = originalOptions.map(
                    (orig, i) => t[`field_${field.id}_option_${i}`] || orig
                  );

                  return (
                    <div key={field.id} className="space-y-3 print:space-y-4 print:break-inside-avoid">
                      <Label className="text-base font-medium flex gap-1 print:text-lg print:text-black">
                        {label}
                        {field.isRequired && <span className="text-destructive print:text-black">*</span>}
                      </Label>

                      {field.fieldType === "short_text" && (
                        <>
                          <Input
                            required={field.isRequired}
                            placeholder={placeholder || ""}
                            value={formData[field.id] || ""}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            className="bg-muted/30 focus:bg-background print:hidden"
                          />
                          <div className="hidden print:block border-b border-black/30 min-h-[2.5rem] w-full" />
                        </>
                      )}

                      {field.fieldType === "long_text" && (
                        <>
                          <Textarea
                            required={field.isRequired}
                            placeholder={placeholder || ""}
                            value={formData[field.id] || ""}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            className="bg-muted/30 focus:bg-background min-h-[100px] print:hidden"
                          />
                          <div className="hidden print:block border border-black/20 rounded-sm min-h-[4in] w-full p-0 relative overflow-hidden">
                             {[...Array(12)].map((_, i) => (
                               <div key={i} className="border-b border-black/10 h-8 last:border-0" />
                             ))}
                          </div>
                        </>
                      )}

                      {field.fieldType === "single_choice" && (
                        <>
                          <RadioGroup
                            required={field.isRequired}
                            value={formData[field.id] || ""}
                            onValueChange={(val) => handleInputChange(field.id, val)}
                            className="space-y-2 print:hidden"
                          >
                            {originalOptions.map((orig, i) => (
                              <div
                                key={i}
                                className="flex items-center space-x-3 bg-muted/20 p-3 rounded-lg border border-transparent hover:border-border transition-colors"
                              >
                                <RadioGroupItem value={orig} id={`${field.id}-${i}`} />
                                <Label htmlFor={`${field.id}-${i}`} className="font-normal cursor-pointer flex-1">
                                  {displayOptions[i]}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                          <div className="hidden print:grid print:grid-cols-1 print:gap-y-4 print:pt-1">
                            {displayOptions.map((option, i) => (
                              <div key={i} className="flex items-center gap-4">
                                <span className="inline-block w-5 h-5 rounded-full border-2 border-black/40" />
                                <span className="text-base text-black">{option}</span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}

                      {field.fieldType === "multi_choice" && (
                        <>
                          <div className="space-y-2 print:hidden">
                            {originalOptions.map((orig, i) => {
                              const currentVals = (formData[field.id] as string[]) || [];
                              const isChecked = currentVals.includes(orig);
                              return (
                                <div
                                  key={i}
                                  className="flex items-center space-x-3 bg-muted/20 p-3 rounded-lg border border-transparent hover:border-border transition-colors"
                                >
                                  <Checkbox
                                    id={`${field.id}-${i}`}
                                    checked={isChecked}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        handleInputChange(field.id, [...currentVals, orig]);
                                      } else {
                                        handleInputChange(field.id, currentVals.filter((v) => v !== orig));
                                      }
                                    }}
                                  />
                                  <Label htmlFor={`${field.id}-${i}`} className="font-normal cursor-pointer flex-1">
                                    {displayOptions[i]}
                                  </Label>
                                </div>
                              );
                            })}
                          </div>
                          <div className="hidden print:grid print:grid-cols-1 print:gap-y-4 print:pt-1">
                            {displayOptions.map((option, i) => (
                              <div key={i} className="flex items-center gap-4">
                                <span className="inline-block w-5 h-5 border-2 border-black/40 rounded-sm" />
                                <span className="text-base text-black">{option}</span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}

                      {field.fieldType === "email" && (
                        <>
                          <Input
                            type="email"
                            required={field.isRequired}
                            placeholder={placeholder || "name@example.com"}
                            value={formData[field.id] || ""}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            className="bg-muted/30 focus:bg-background print:hidden"
                          />
                          <div className="hidden print:block border-b border-black/30 min-h-[2.5rem] w-full" />
                        </>
                      )}

                      {field.fieldType === "phone" && (
                        <>
                          <Input
                            type="tel"
                            required={field.isRequired}
                            placeholder={placeholder || ""}
                            value={formData[field.id] || ""}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            className="bg-muted/30 focus:bg-background print:hidden"
                          />
                          <div className="hidden print:block border-b border-black/30 min-h-[2.5rem] w-full" />
                        </>
                      )}

                      {field.fieldType === "date" && (
                        <>
                          <Input
                            type="date"
                            required={field.isRequired}
                            value={formData[field.id] || ""}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            className="bg-muted/30 focus:bg-background w-auto print:hidden"
                          />
                          <div className="hidden print:flex items-center gap-2">
                             <div className="border-b border-black/30 min-h-[2.5rem] w-12 text-center text-[10px] text-black/30 pt-6">DD</div>
                             <div className="text-black/30 pt-4">/</div>
                             <div className="border-b border-black/30 min-h-[2.5rem] w-12 text-center text-[10px] text-black/30 pt-6">MM</div>
                             <div className="text-black/30 pt-4">/</div>
                             <div className="border-b border-black/30 min-h-[2.5rem] w-24 text-center text-[10px] text-black/30 pt-6">YYYY</div>
                          </div>
                        </>
                      )}

                      {field.fieldType === "rating" && (
                        <>
                          <div className="print:hidden">
                            <StarRating
                              value={Number(formData[field.id]) || 0}
                              onChange={(val) => handleInputChange(field.id, val)}
                              required={field.isRequired}
                            />
                          </div>
                          <div className="hidden print:flex items-center gap-8 pt-4">
                            {[1, 2, 3, 4, 5].map((num) => (
                              <div key={num} className="flex flex-col items-center gap-2">
                                <span className="inline-block w-12 h-12 border-2 border-black/40 rounded-full text-xl font-bold flex items-center justify-center">
                                  {num}
                                </span>
                                <span className="text-[10px] font-semibold text-black/60 uppercase tracking-wider">
                                  {num === 1 ? "Poor" : num === 5 ? "Excellent" : ""}
                                </span>
                              </div>
                            ))}
                          </div>
                        </>
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
