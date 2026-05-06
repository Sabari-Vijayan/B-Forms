import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useParams } from "wouter";
import { useGetForm, usePublishForm } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Loader2, Copy, ExternalLink, QrCode, CheckCircle2, AlertCircle, Download } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";

export default function FormShare() {
  const params = useParams();
  const id = params.id as string;
  const { data: form, isLoading } = useGetForm(id, { query: { enabled: !!id, queryKey: [`/api/forms/${id}`] } });
  const publishForm = usePublishForm();
  
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStep, setPublishStep] = useState<"idle" | "validating" | "translating" | "saving" | "done" | "error">("idle");
  const [publishProgress, setPublishProgress] = useState(0);

  useEffect(() => {
    if (form && selectedLanguages.length === 0) {
      const langs = form.supportedLanguages.includes(form.originalLanguage)
        ? form.supportedLanguages
        : [form.originalLanguage, ...form.supportedLanguages];
      setSelectedLanguages(langs);
    }
  }, [form, selectedLanguages.length]);

  useEffect(() => {
    if (!isPublishing) return;
    const steps: Array<[typeof publishStep, number]> = [
      ["validating", 15],
      ["translating", 45],
      ["saving", 80],
    ];
    let i = 0;
    setPublishProgress(10);
    setPublishStep("validating");
    const timer = window.setInterval(() => {
      const [step, progress] = steps[Math.min(i, steps.length - 1)];
      setPublishStep(step);
      setPublishProgress(progress);
      i += 1;
    }, 1200);
    return () => window.clearInterval(timer);
  }, [isPublishing]);

  if (isLoading || !form) {
    return <DashboardLayout><div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></DashboardLayout>;
  }

  const publicUrl = `${window.location.origin}/f/${form.slug}`;
  const isPublished = form.status === 'published';

  const handlePublish = async () => {
    if (selectedLanguages.length === 0) {
      toast.error("Please select at least one language");
      return;
    }

    setIsPublishing(true);
    setPublishStep("validating");
    setPublishProgress(10);
    try {
      await publishForm.mutateAsync({
        id,
        data: { languages: selectedLanguages }
      });
      setPublishStep("done");
      setPublishProgress(100);
      toast.success("Form published and translations started!");
    } catch (e) {
      setPublishStep("error");
      setPublishProgress(100);
      toast.error("Failed to publish form");
    } finally {
      window.setTimeout(() => {
        setIsPublishing(false);
        setPublishStep("idle");
        setPublishProgress(0);
      }, 900);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const handleDownloadPdf = () => {
    const printableUrl = `${window.location.origin}/f/${form.slug}?print=1`;
    const printWindow = window.open(printableUrl, "_blank", "noopener,noreferrer");
    if (!printWindow) {
      toast.error("Allow popups to open the printable version.");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Share Form</h1>
          <p className="text-muted-foreground mt-2">Publish and share your form across languages.</p>
        </div>

        {!isPublished ? (
          <Card className="border-primary/20 shadow-md bg-card/95">
            <CardHeader>
              <CardTitle>Ready to publish?</CardTitle>
              <CardDescription>Select the languages you want to translate this form into.</CardDescription>
            </CardHeader>
            <CardContent>
              {isPublishing && (
                <div className="mb-4 space-y-2">
                  <div className="flex items-center justify-between text-xs uppercase tracking-wide text-muted-foreground">
                    <span>
                      {publishStep === "validating" && "Validating form"}
                      {publishStep === "translating" && "Translating fields"}
                      {publishStep === "saving" && "Saving translations"}
                      {publishStep === "done" && "Published"}
                      {publishStep === "error" && "Publish failed"}
                    </span>
                    <span>{publishProgress}%</span>
                  </div>
                  <div className="h-2 bg-muted overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        publishStep === "error" ? "bg-destructive" : "bg-foreground"
                      }`}
                      style={{ width: `${publishProgress}%` }}
                    />
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-muted/30 p-4 rounded-lg border border-border/60">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <div key={lang.code} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`lang-${lang.code}`} 
                      checked={selectedLanguages.includes(lang.code)}
                      disabled={lang.code === form.originalLanguage}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedLanguages([...selectedLanguages, lang.code]);
                        } else {
                          setSelectedLanguages(selectedLanguages.filter(c => c !== lang.code));
                        }
                      }}
                    />
                    <Label htmlFor={`lang-${lang.code}`} className="font-normal cursor-pointer">
                      {lang.name}
                      {lang.code === form.originalLanguage && " (Original)"}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handlePublish} disabled={isPublishing} className="w-full sm:w-auto">
                {isPublishing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {isPublishing ? "Publishing..." : "Publish & Translate"}
              </Button>
              <Button variant="outline" onClick={handleDownloadPdf} className="w-full sm:w-auto">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Card className="bg-card/95">
                <CardHeader>
                  <CardTitle className="text-lg">Public Link</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input readOnly value={publicUrl} />
                    <Button variant="secondary" onClick={() => copyToClipboard(publicUrl)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => window.open(publicUrl, '_blank')}>
                    <ExternalLink className="w-4 h-4 mr-2" /> Open in new tab
                  </Button>
                  <Button variant="secondary" className="w-full" onClick={handleDownloadPdf}>
                    <Download className="w-4 h-4 mr-2" /> Download PDF
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-card/95">
                <CardHeader>
                  <CardTitle className="text-lg">Embed Code</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <Textarea 
                      readOnly 
                      className="font-mono text-sm h-24 resize-none bg-muted/50"
                      value={`<iframe src="${publicUrl}" width="100%" height="800px" frameborder="0"></iframe>`}
                    />
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="absolute top-2 right-2 h-8 w-8"
                      onClick={() => copyToClipboard(`<iframe src="${publicUrl}" width="100%" height="800px" frameborder="0"></iframe>`)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="h-full flex flex-col items-center justify-center p-8 text-center bg-card/95">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <QrCode className="w-5 h-5" /> QR Code
                  </CardTitle>
                  <CardDescription>Scan to open the form on a mobile device</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-white p-4 rounded-xl border">
                    <QRCodeSVG value={publicUrl} size={200} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
