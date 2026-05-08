import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";

interface LanguageSettingsProps {
  supportedLanguages: string[];
  preferredLanguage: string;
  originalLanguage: string;
  onUpdate: (updates: any) => void;
}

export function LanguageSettings({ 
  supportedLanguages, 
  preferredLanguage, 
  originalLanguage, 
  onUpdate 
}: LanguageSettingsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-foreground">Language & Localization</h3>
        <p className="text-xs text-muted-foreground">Manage how you and your respondents interact with the form.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-lg border border-border bg-card shadow-sm">
        {/* Admin Preference */}
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground text-foreground/70">Your Working Language</Label>
            <p className="text-[10px] text-muted-foreground">The language used in this editor.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {SUPPORTED_LANGUAGES.filter(l => supportedLanguages.includes(l.code) || l.code === originalLanguage).map((lang) => (
              <button
                key={lang.code}
                onClick={() => onUpdate({ preferredLanguage: lang.code })}
                className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-all ${
                  (preferredLanguage || originalLanguage) === lang.code 
                    ? "bg-foreground text-background border-foreground shadow-sm" 
                    : "border-border hover:bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>

        {/* Respondent Languages */}
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground text-foreground/70">Respondent Languages</Label>
            <p className="text-[10px] text-muted-foreground">Select languages for automatic AI translation.</p>
          </div>
          <div className="grid grid-cols-2 gap-y-2.5 gap-x-4">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <div key={lang.code} className="flex items-center space-x-2 group">
                <Checkbox
                  id={`lang-${lang.code}`}
                  checked={supportedLanguages.includes(lang.code)}
                  disabled={lang.code === originalLanguage}
                  onCheckedChange={(checked) => {
                    if (checked) onUpdate({ supportedLanguages: [...supportedLanguages, lang.code] });
                    else onUpdate({ supportedLanguages: supportedLanguages.filter(c => c !== lang.code) });
                  }}
                  className="w-3.5 h-3.5"
                />
                <Label 
                  htmlFor={`lang-${lang.code}`} 
                  className={`text-xs cursor-pointer transition-colors ${supportedLanguages.includes(lang.code) ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {lang.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
