import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Image as ImageIcon } from "lucide-react";

interface BrandingSettingsProps {
  featureImageUrl: string;
  onUpdate: (updates: any) => void;
}

export function BrandingSettings({ featureImageUrl, onUpdate }: BrandingSettingsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-foreground">Visual Branding</h3>
        <p className="text-xs text-muted-foreground">Customize the look of your form with a hero image.</p>
      </div>

      <div className="space-y-4 p-4 rounded-lg border border-border bg-card shadow-sm">
        <div className="space-y-2">
          <Label htmlFor="image-url" className="text-xs font-medium uppercase tracking-wider text-muted-foreground text-foreground/70">Feature Image URL</Label>
          <div className="flex gap-2">
            <Input 
              id="image-url"
              value={featureImageUrl} 
              onChange={(e) => onUpdate({ featureImageUrl: e.target.value })} 
              placeholder="https://images.unsplash.com/..."
              className="flex-1 focus-visible:ring-1 focus-visible:ring-indigo-500/50"
            />
            {featureImageUrl && (
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => onUpdate({ featureImageUrl: "" })}
                className="shrink-0 hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="relative aspect-[21/9] rounded-md overflow-hidden border border-border bg-muted/20 group transition-all hover:border-border/80">
          {featureImageUrl ? (
            <img src={featureImageUrl} alt="Preview" className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/30 space-y-2">
              <ImageIcon className="w-8 h-8 opacity-20" />
              <span className="text-xs font-medium">No cover image set</span>
            </div>
          )}
          <div className="absolute inset-0 ring-1 ring-inset ring-black/5 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
