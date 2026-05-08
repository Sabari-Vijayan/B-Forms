import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Form } from "@/hooks/api";

import { BasicInfoSettings } from "./settings/BasicInfoSettings";
import { BrandingSettings } from "./settings/BrandingSettings";
import { LanguageSettings } from "./settings/LanguageSettings";

interface FormSettingsProps {
  title: string;
  description: string;
  featureImageUrl: string;
  supportedLanguages: string[];
  preferredLanguage: string;
  originalLanguage: string;
  isSaving?: boolean;
  isDirty?: boolean;
  onUpdate: (updates: Partial<Form>) => void;
  onSave: () => void;
}

export function FormSettings({
  title,
  description,
  featureImageUrl,
  supportedLanguages,
  preferredLanguage,
  originalLanguage,
  isSaving,
  isDirty,
  onUpdate,
  onSave
}: FormSettingsProps) {
  return (
    <Card className="border-border shadow-md overflow-hidden">
      <CardHeader className="bg-muted/30 border-b border-border/50">
        <CardTitle className="text-xl font-bold tracking-tight">Form Settings</CardTitle>
        <CardDescription>Configure your form's identity, appearance, and localization.</CardDescription>
      </CardHeader>
      
      <CardContent className="p-6 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10">
          <BasicInfoSettings 
            title={title}
            description={description}
            onUpdate={onUpdate}
          />
          
          <BrandingSettings 
            featureImageUrl={featureImageUrl}
            onUpdate={onUpdate}
          />
        </div>

        <div className="pt-2">
          <LanguageSettings 
            supportedLanguages={supportedLanguages}
            preferredLanguage={preferredLanguage}
            originalLanguage={originalLanguage}
            onUpdate={onUpdate}
          />
        </div>
      </CardContent>

      <CardFooter className="bg-muted/30 border-t border-border/50 p-6 flex justify-end">
        <Button 
          onClick={onSave} 
          disabled={isSaving || !isDirty}
          size="lg"
          className="px-8 font-semibold shadow-sm active:scale-[0.98] transition-all"
        >
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isDirty ? "Save All Settings" : "No Changes"}
        </Button>
      </CardFooter>
    </Card>
  );
}
