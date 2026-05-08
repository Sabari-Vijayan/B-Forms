import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Share2, Loader2, Send } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";

interface EditorHeaderProps {
  title: string;
  status: string;
  originalLanguage: string;
  id: string;
  isPublishing?: boolean;
  onShare: () => void;
  onPublish: () => void;
}

export function EditorHeader({
  title,
  status,
  originalLanguage,
  id,
  isPublishing,
  onShare,
  onPublish
}: EditorHeaderProps) {
  const langName = SUPPORTED_LANGUAGES.find(l => l.code === originalLanguage)?.name || originalLanguage;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-foreground truncate font-bold text-2xl tracking-tight">{title}</h1>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <Badge 
            variant={status === 'published' ? 'default' : 'secondary'} 
            className={`shrink-0 ${status === 'published' ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}`}
          >
            {status}
          </Badge>
          <span className="text-sm text-muted-foreground flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
            Original language: <span className="text-foreground font-medium">{langName}</span>
          </span>
        </div>
      </div>
      <div className="flex gap-2 shrink-0">
        <Button 
          variant="outline" 
          onClick={onShare} 
          disabled={status !== 'published'}
          className="shadow-sm active:scale-[0.98] transition-all"
        >
          <Share2 className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">Share</span>
        </Button>
        {status !== 'published' && (
          <Button 
            onClick={onPublish}
            disabled={isPublishing}
            className="shadow-md bg-primary hover:bg-primary/90 active:scale-[0.98] transition-all relative overflow-hidden group"
          >
            {isPublishing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                <span className="hidden sm:inline">Publish Form</span>
                <span className="sm:hidden">Publish</span>
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
