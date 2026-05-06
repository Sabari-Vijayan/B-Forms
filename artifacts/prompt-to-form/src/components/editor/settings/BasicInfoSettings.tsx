import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface BasicInfoSettingsProps {
  title: string;
  description: string;
  onUpdate: (updates: any) => void;
}

export function BasicInfoSettings({ title, description, onUpdate }: BasicInfoSettingsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-foreground">Basic Information</h3>
        <p className="text-xs text-muted-foreground">The title and description of your form seen by respondents.</p>
      </div>
      
      <div className="space-y-3 p-4 rounded-lg border border-border bg-card shadow-sm">
        <div className="space-y-2">
          <Label htmlFor="form-title" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Form Title</Label>
          <Input 
            id="form-title"
            value={title} 
            onChange={(e) => onUpdate({ title: e.target.value })} 
            placeholder="e.g. Customer Feedback Survey"
            className="focus-visible:ring-1 focus-visible:ring-indigo-500/50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="form-desc" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Description</Label>
          <Textarea 
            id="form-desc"
            value={description} 
            onChange={(e) => onUpdate({ description: e.target.value })} 
            placeholder="Tell your respondents what this form is about..."
            className="min-h-[100px] resize-none focus-visible:ring-1 focus-visible:ring-indigo-500/50"
          />
        </div>
      </div>
    </div>
  );
}
