import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { GripVertical, Trash2, Plus, Type, AlignLeft, CheckSquare, ListChecks, Star, Calendar, Mail, Phone, X, Loader2 } from "lucide-react";

const FIELD_ICONS: Record<string, React.ElementType> = {
  short_text: Type,
  long_text: AlignLeft,
  single_choice: CheckSquare,
  multi_choice: ListChecks,
  rating: Star,
  date: Calendar,
  email: Mail,
  phone: Phone,
};

interface Field {
  id: string;
  fieldType: string;
  label: string;
  placeholder?: string | null;
  isRequired: boolean;
  optionsJson?: string[] | null;
  orderIndex: number;
}

interface FieldListProps {
  fields: Field[];
  orderedIds: string[];
  fieldDrafts: Record<string, any>;
  savingFieldId: string | null;
  onReorder: (newIds: string[]) => void;
  onPatchDraft: (id: string, updates: any) => void;
  onSaveField: (id: string) => void;
  onDeleteField: (id: string) => void;
  isDirty: (f: Field) => boolean;
}

export function FieldList({
  fields,
  orderedIds,
  fieldDrafts,
  savingFieldId,
  onReorder,
  onPatchDraft,
  onSaveField,
  onDeleteField,
  isDirty
}: FieldListProps) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = orderedIds.indexOf(active.id as string);
    const newIndex = orderedIds.indexOf(over.id as string);
    onReorder(arrayMove(orderedIds, oldIndex, newIndex));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={orderedIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-4">
          {orderedIds.map(id => {
            const field = fields.find(f => f.id === id);
            if (!field) return null;
            return (
              <SortableFieldItem
                key={field.id}
                field={field}
                draft={fieldDrafts[field.id]}
                isSaving={savingFieldId === field.id}
                isDirty={isDirty(field)}
                onPatchDraft={onPatchDraft}
                onSave={onSaveField}
                onDelete={onDeleteField}
              />
            );
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableFieldItem({ field, draft, isSaving, isDirty, onPatchDraft, onSave, onDelete }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: field.id });
  const Icon = FIELD_ICONS[field.fieldType] || Type;
  const opts = draft?.optionsJson ?? field.optionsJson ?? [];

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    position: "relative" as const,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className={`border-border shadow-sm group transition-colors ${isDirty ? "border-foreground/40" : ""}`}>
        <CardContent className="p-4 sm:p-6 flex gap-4">
          <div className="mt-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none" {...listeners} {...attributes}>
            <GripVertical className="w-5 h-5" />
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <Input
                value={draft?.label ?? field.label}
                onChange={(e) => onPatchDraft(field.id, { label: e.target.value })}
                className="font-medium text-lg border-transparent hover:border-input focus:bg-background px-2 -ml-2"
              />
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize flex items-center gap-1">
                  <Icon className="w-3 h-3" />
                  {field.fieldType.replace(/_/g, ' ')}
                </Badge>
                <Button variant="ghost" size="icon" className="text-destructive opacity-0 group-hover:opacity-100" onClick={() => onDelete(field.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {(field.fieldType === 'short_text' || field.fieldType === 'long_text' || field.fieldType === 'email' || field.fieldType === 'phone') && (
              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-wide mb-1 block">Placeholder</Label>
                <Input
                  value={draft?.placeholder ?? field.placeholder ?? ""}
                  onChange={(e) => onPatchDraft(field.id, { placeholder: e.target.value || null })}
                  className="text-sm bg-muted/50"
                />
              </div>
            )}

            {(field.fieldType === 'single_choice' || field.fieldType === 'multi_choice') && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide block">Options</Label>
                <div className="space-y-2 pl-2 border-l-2 border-border">
                  {opts.map((opt: string, i: number) => (
                    <div key={i} className="flex items-center gap-2">
                      <Input
                        value={opt}
                        onChange={(e) => {
                          const next = [...opts];
                          next[i] = e.target.value;
                          onPatchDraft(field.id, { optionsJson: next });
                        }}
                        className="h-8 text-sm"
                      />
                      <button onClick={() => onPatchDraft(field.id, { optionsJson: opts.filter((_: any, j: number) => j !== i) })}>
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <Button variant="ghost" size="sm" onClick={() => onPatchDraft(field.id, { optionsJson: [...opts, `Option ${opts.length + 1}`] })}>
                    <Plus className="w-3 h-3 mr-1" /> Add option
                  </Button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-1 border-t border-border/50">
              <div className="flex items-center gap-2">
                <Switch checked={draft?.isRequired ?? field.isRequired} onCheckedChange={(checked) => onPatchDraft(field.id, { isRequired: checked })} />
                <Label className="text-sm">Required</Label>
              </div>
              <Button size="sm" disabled={!isDirty || isSaving} onClick={() => onSave(field.id)}>
                {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Save"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
