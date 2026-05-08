import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { GripVertical, Trash2, Plus, Type, AlignLeft, CheckSquare, ListChecks, Star, Calendar, Mail, Phone, X, Image as ImageIcon, AlignCenter } from "lucide-react";
import { Item } from "@/hooks/api";

const FIELD_ICONS: Record<string, React.ElementType> = {
  short_text: Type,
  long_text: AlignLeft,
  single_choice: CheckSquare,
  multi_choice: ListChecks,
  rating: Star,
  date: Calendar,
  email: Mail,
  phone: Phone,
  image_upload: ImageIcon,
  paragraph: AlignLeft,
};

interface ItemListProps {
  items: Item[];
  onReorder: (newItems: Item[]) => void;
  onUpdateItem: (itemId: string, updates: Partial<Item>) => void;
  onDeleteItem: (itemId: string) => void;
}

export function ItemList({
  items,
  onReorder,
  onUpdateItem,
  onDeleteItem,
}: ItemListProps) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const orderedIds = items.map(i => i.itemId);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = orderedIds.indexOf(active.id as string);
    const newIndex = orderedIds.indexOf(over.id as string);
    onReorder(arrayMove(items, oldIndex, newIndex));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={orderedIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-4">
          {items.map(item => (
            <SortableItem
              key={item.itemId}
              item={item}
              onUpdate={onUpdateItem}
              onDelete={onDeleteItem}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableItem({ item, onUpdate, onDelete }: { item: Item, onUpdate: any, onDelete: any }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.itemId });
  
  const question = item.questionItem?.question;
  const choice = question?.choiceQuestion;
  const text = question?.textQuestion;
  const rating = question?.ratingQuestion;
  const file = question?.fileQuestion;

  let fieldType = "paragraph";
  if (question) {
    if (choice) {
      fieldType = choice.type === 'RADIO' ? 'single_choice' : choice.type === 'CHECKBOX' ? 'multi_choice' : 'single_choice';
    } else if (text) {
      fieldType = text.paragraph ? 'long_text' : 'short_text';
    } else if (rating) {
      fieldType = 'rating';
    } else if (file) {
      fieldType = 'image_upload';
    }
  }

  const Icon = FIELD_ICONS[fieldType] || Type;
  const opts = choice?.options ?? [];

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    position: "relative" as const,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="border-border shadow-sm group transition-colors">
        <CardContent className="p-4 sm:p-6 flex gap-4">
          <div className="mt-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none" {...listeners} {...attributes}>
            <GripVertical className="w-5 h-5" />
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <Input
                value={item.title}
                onChange={(e) => onUpdate(item.itemId, { title: e.target.value })}
                className="font-medium text-lg border-transparent hover:border-input focus:bg-background px-2 -ml-2"
                placeholder={question ? "Question" : "Header"}
              />
              <div className="flex items-center gap-2">
                <Badge variant={question ? "outline" : "secondary"} className="capitalize flex items-center gap-1">
                  <Icon className="w-3 h-3" />
                  {fieldType.replace(/_/g, ' ')}
                </Badge>
                <Button variant="ghost" size="icon" className="text-destructive opacity-0 group-hover:opacity-100" onClick={() => onDelete(item.itemId)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-1">
               <Label className="text-xs text-muted-foreground uppercase tracking-wide mb-1 block">
                 {question ? "Description / Placeholder" : "Paragraph Content"}
               </Label>
               {question ? (
                 <Input
                   value={item.description || ""}
                   onChange={(e) => onUpdate(item.itemId, { description: e.target.value || null })}
                   className="text-sm bg-muted/50"
                   placeholder="Help text"
                 />
               ) : (
                 <Textarea
                   value={item.description || ""}
                   onChange={(e) => onUpdate(item.itemId, { description: e.target.value || null })}
                   className="text-sm bg-muted/50 min-h-[80px]"
                   placeholder="Write your informational text here..."
                 />
               )}
            </div>

            {choice && question && (
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
                          onUpdate(item.itemId, { 
                            questionItem: { 
                              question: { 
                                ...question, 
                                choiceQuestion: { ...choice, options: next } 
                              } 
                            } 
                          });
                        }}
                        className="h-8 text-sm"
                      />
                      <button onClick={() => {
                         const next = opts.filter((_: any, j: number) => j !== i);
                         onUpdate(item.itemId, { 
                            questionItem: { 
                              question: { 
                                ...question, 
                                choiceQuestion: { ...choice, options: next } 
                              } 
                            } 
                          });
                      }}>
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <Button variant="ghost" size="sm" onClick={() => {
                    const next = [...opts, `Option ${opts.length + 1}`];
                    onUpdate(item.itemId, { 
                       questionItem: { 
                         question: { 
                           ...question, 
                           choiceQuestion: { ...choice, options: next } 
                         } 
                       } 
                     });
                  }}>
                    <Plus className="w-3 h-3 mr-1" /> Add option
                  </Button>
                </div>
              </div>
            )}

            {question && (
              <div className="flex items-center justify-between pt-1 border-t border-border/50">
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={question?.required} 
                    onCheckedChange={(checked) => onUpdate(item.itemId, { 
                      questionItem: { 
                        question: { ...question, required: checked } 
                      } 
                    })} 
                  />
                  <Label className="text-sm">Required</Label>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
