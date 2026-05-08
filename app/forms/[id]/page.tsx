"use client";

import { useState, useEffect, use } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Plus, List, Settings, FileSpreadsheet, BarChart2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import { EditorHeader } from "@/components/editor/EditorHeader";
import { ItemList } from "@/components/editor/ItemList";
import { FormSettings } from "@/components/editor/FormSettings";
import { AnalyticsDashboard } from "@/components/editor/AnalyticsDashboard";
import { ResponsesTab } from "@/components/editor/ResponsesTab";
import { ResponseDrawer } from "@/components/editor/ResponseDrawer";

import { 
  useGetForm, 
  useListSubmissions,
  useUpdateForm,
  usePublishForm,
} from "@/hooks/api";

import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export default function FormEditorPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState(() => {
    return searchParams.get("tab") || "responses";
  });
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);

  // Queries
  const { data: form, isLoading: isFormLoading } = useGetForm(id);
  const { data: submissions, isLoading: isSubmissionsLoading, dataUpdatedAt } = useListSubmissions(id);

  // Mutations
  const updateForm = useUpdateForm();
  const publishForm = usePublishForm();

  // State Management
  const [documentDraft, setDocumentDraft] = useState<any | null>(null);
  const [metadataDraft, setMetadataDraft] = useState<any>({});
  const [isUpdatingForm, setIsUpdatingForm] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Sync draft from loaded data
  useEffect(() => {
    if (form && !documentDraft) {
      setDocumentDraft(form.documentJson);
    }
  }, [form, documentDraft]);

  const handleUpdateDocument = (updates: any) => {
    setDocumentDraft((prev: any) => prev ? { ...prev, ...updates } : null);
  };

  const handleUpdateMetadata = (updates: any) => {
    setMetadataDraft((prev: any) => ({ ...prev, ...updates }));
  };

  const isDirty = () => {
    if (!form || !documentDraft) return false;
    const documentChanged = JSON.stringify(documentDraft) !== JSON.stringify(form.documentJson);
    const metadataChanged = Object.keys(metadataDraft).some(key => {
      const draftVal = (metadataDraft as any)[key];
      const originalVal = (form as any)[key];
      return draftVal !== originalVal;
    });
    return documentChanged || metadataChanged;
  };

  const handleSave = async () => {
    if (!documentDraft) return;

    setIsUpdatingForm(true);
    try {
      const title = metadataDraft.title || documentDraft.info?.title || (documentDraft as any).title || "Untitled Form";
      const description = metadataDraft.description !== undefined ? metadataDraft.description : (documentDraft.info?.description || (documentDraft as any).description || null);

      const updatedDocument = {
        ...documentDraft,
        info: {
          ...documentDraft.info,
          title,
          description
        }
      };

      await updateForm.mutateAsync({ 
        id: id!, 
        ...metadataDraft,
        title,
        description,
        documentJson: updatedDocument 
      });
      setMetadataDraft({});
      setDocumentDraft(updatedDocument);
      toast.success("Form saved");
    } catch {
      toast.error("Failed to save form");
    } finally {
      setIsUpdatingForm(false);
    }
  };

  const handleAddItem = (type: string) => {
    if (!documentDraft) return;

    let newItem: any;
    
    if (type === 'INFO_PARAGRAPH') {
      newItem = {
        itemId: crypto.randomUUID(),
        title: "Info Section",
        description: "Your informational text here.",
      };
    } else {
      newItem = {
        itemId: crypto.randomUUID(),
        title: type === 'FILE' ? "Upload Image" : "New Question",
        description: "",
        questionItem: {
          question: {
            questionId: crypto.randomUUID(),
            required: false,
            ...(type === 'RADIO' || type === 'CHECKBOX' || type === 'DROP_DOWN' ? {
              choiceQuestion: { type: type as any, options: ["Option 1"] }
            } : type === 'RATING' ? {
              ratingQuestion: { maxRating: 5 }
            } : type === 'FILE' ? {
              fileQuestion: { maxFiles: 1, acceptedTypes: ["image/*"] }
            } : {
              textQuestion: { paragraph: type === 'LONG_TEXT' }
            })
          }
        }
      };
    }

    handleUpdateDocument({
      items: [...(documentDraft.items || []), newItem]
    });
  };

  const handleReorderItems = (newItems: any[]) => {
    handleUpdateDocument({ items: newItems });
  };

  const handleUpdateItem = (itemId: string, updates: any) => {
    if (!documentDraft) return;
    const newItems = documentDraft.items.map((item: any) => 
      item.itemId === itemId ? { ...item, ...updates } : item
    );
    handleUpdateDocument({ items: newItems });
  };

  const handleDeleteItem = (itemId: string) => {
    if (!documentDraft) return;
    const newItems = documentDraft.items.filter((item: any) => item.itemId !== itemId);
    handleUpdateDocument({ items: newItems });
  };

  const handlePublishForm = async () => {
    setIsPublishing(true);
    const toastId = toast.loading("Publishing form and generating AI translations...");
    try {
      await publishForm.mutateAsync({
        id: id!,
        languages: currentForm.supportedLanguages || []
      });
      toast.success("Form published and translations generated!", { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "Failed to publish form", { id: toastId });
    } finally {
      setIsPublishing(false);
    }
  };

  if (isFormLoading) {
    return <DashboardLayout><div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div></DashboardLayout>;
  }

  if (!form || !documentDraft) return <DashboardLayout>Form not found</DashboardLayout>;

  const currentForm = { ...form, ...metadataDraft, documentJson: documentDraft };
  const fields = (documentDraft.items || []).map((item: any) => {
    const q = item.questionItem?.question;
    let type = 'paragraph';
    if (q) {
      if (q.choiceQuestion) {
        type = q.choiceQuestion.type === 'CHECKBOX' ? 'multi_choice' : 'single_choice';
      } else if (q.ratingQuestion) {
        type = 'rating';
      } else if (q.textQuestion?.paragraph) {
        type = 'long_text';
      } else if (q.fileQuestion) {
        type = 'image_upload';
      } else {
        type = 'short_text';
      }
    }
    
    return {
      id: item.itemId,
      label: item.title,
      fieldType: type,
    };
  });

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <EditorHeader 
          title={currentForm.title}
          status={currentForm.status}
          originalLanguage={currentForm.originalLanguage}
          id={id!}
          isPublishing={isPublishing}
          onShare={() => router.push(`/forms/${id}/share`)}
          onPublish={handlePublishForm}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 max-w-[500px] relative p-1 bg-muted rounded-lg h-10">
            {[
              { id: "responses", label: "Responses", icon: FileSpreadsheet },
              { id: "analytics", label: "Analytics", icon: BarChart2 },
              { id: "fields", label: "Fields", icon: List },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((tab) => (
              <TabsTrigger 
                key={tab.id}
                value={tab.id} 
                className="relative z-10 h-8 data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-colors px-4"
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-background rounded-md shadow-sm"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                  />
                )}
                <span className="relative z-20 flex items-center justify-center font-medium text-xs sm:text-sm">
                  <tab.icon className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.charAt(0)}</span>
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="relative pt-6 px-1 pb-4 min-h-[400px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
              >
                <TabsContent value="fields" className="mt-0 space-y-4 outline-none">
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSave} 
                      disabled={!isDirty() || isUpdatingForm}
                      className="shadow-sm"
                    >
                      {isUpdatingForm ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Save Changes"}
                    </Button>
                  </div>

                  <ItemList 
                    items={documentDraft.items || []}
                    onReorder={handleReorderItems}
                    onUpdateItem={handleUpdateItem}
                    onDeleteItem={handleDeleteItem}
                  />
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full border-dashed py-6 text-muted-foreground hover:text-foreground">
                        <Plus className="w-4 h-4 mr-2" />Add Field
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem onClick={() => handleAddItem('SHORT_TEXT')}>Short Answer</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAddItem('LONG_TEXT')}>Paragraph Answer</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAddItem('RADIO')}>Multiple Choice</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAddItem('CHECKBOX')}>Checkboxes</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAddItem('DROP_DOWN')}>Dropdown</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAddItem('RATING')}>Rating</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAddItem('FILE')}>Image Upload</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAddItem('INFO_PARAGRAPH')}>Info Paragraph</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TabsContent>

                <TabsContent value="settings" className="mt-0 outline-none">
                  <FormSettings 
                    title={currentForm.title}
                    description={currentForm.description || ""}
                    featureImageUrl={currentForm.featureImageUrl || ""}
                    supportedLanguages={currentForm.supportedLanguages || []}
                    preferredLanguage={currentForm.preferredLanguage || ""}
                    originalLanguage={form.originalLanguage}
                    isSaving={isUpdatingForm}
                    isDirty={isDirty()}
                    onUpdate={handleUpdateMetadata}
                    onSave={handleSave}
                  />
                </TabsContent>

                <TabsContent value="responses" className="mt-0 outline-none">
                  <ResponsesTab 
                    formTitle={form.title}
                    submissions={submissions || []}
                    fields={fields || []}
                    isLoading={isSubmissionsLoading}
                    onViewSubmission={setSelectedSubmission}
                    selectedSubmissionId={selectedSubmission?.id}
                  />
                </TabsContent>

                <TabsContent value="analytics" className="mt-0 outline-none">
                  <AnalyticsDashboard 
                    formTitle={form.title}
                    submissions={submissions || []}
                    fields={fields || []}
                    isLoading={isSubmissionsLoading}
                    lastUpdatedAt={dataUpdatedAt ? new Date(dataUpdatedAt) : null}
                    newResponseCount={0}
                  />
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </div>
        </Tabs>
      </div>

      <ResponseDrawer 
        submission={selectedSubmission}
        fields={fields || []}
        onClose={() => setSelectedSubmission(null)}
      />
    </DashboardLayout>
  );
}
