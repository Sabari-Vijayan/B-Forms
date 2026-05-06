import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";

interface EditorHeaderProps {
  title: string;
  status: string;
  originalLanguage: string;
  id: string;
  onShare: () => void;
  onPublish: () => void;
}

export function EditorHeader({
  title,
  status,
  originalLanguage,
  id,
  onShare,
  onPublish
}: EditorHeaderProps) {
  const langName = SUPPORTED_LANGUAGES.find(l => l.code === originalLanguage)?.name || originalLanguage;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-foreground truncate">{title}</h1>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <Badge variant={status === 'published' ? 'default' : 'secondary'} className="shrink-0">
            {status}
          </Badge>
          <span className="text-sm text-muted-foreground">
            Original language: {langName}
          </span>
        </div>
      </div>
      <div className="flex gap-2 shrink-0">
        <Button variant="outline" onClick={onShare} disabled={status !== 'published'}>
          <Share2 className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">Share</span>
        </Button>
        {status !== 'published' && (
          <Button onClick={onPublish}>
            <span className="hidden sm:inline">Publish Form</span>
            <span className="sm:hidden">Publish</span>
          </Button>
        )}
      </div>
    </div>
  );
}
