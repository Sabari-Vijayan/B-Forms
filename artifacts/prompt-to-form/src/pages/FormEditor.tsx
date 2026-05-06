import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, List, Settings, FileSpreadsheet, BarChart2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import { EditorHeader } from "@/components/editor/EditorHeader";
import { FieldList } from "@/components/editor/FieldList";
import { FormSettings } from "@/components/editor/FormSettings";
import { AnalyticsDashboard } from "@/components/editor/AnalyticsDashboard";
import { ResponsesTab } from "@/components/editor/ResponsesTab";
import { ResponseDrawer } from "@/components/editor/ResponseDrawer";

import { 
  useGetForm, 
  useListFormFields, 
  useListSubmissions,
  useUpdateForm,
  useCreateFormField,
  useUpdateFormField,
  useDeleteFormField,
  useReorderFields,
  useDeleteForm,
  usePublishForm,
  Form
} from "@workspace/api-client-react";

import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export default function FormEditor() {
  const { id } = useParams();
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("tab") || "responses";
  });
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const { toast } = useToast();

  // Queries
  const { data: form, isLoading: isFormLoading } = useGetForm(id!, { query: { enabled: !!id, queryKey: [`/api/forms/${id}`] } });
  const { data: fields, isLoading: isFieldsLoading } = useListFormFields(id!, { query: { enabled: !!id, queryKey: [`/api/forms/${id}/fields`] } });
  const { data: submissions, isLoading: isSubmissionsLoading, dataUpdatedAt } = useListSubmissions(id!, {
    query: { 
      enabled: !!id, 
      refetchInterval: activeTab === "responses" ? 20000 : false,
      queryKey: [`/api/forms/${id}/submissions`]
    },
  });

  // Mutations
  const updateForm = useUpdateForm();
  const createField = useCreateFormField();
  const updateField = useUpdateFormField();
  const deleteField = useDeleteFormField();
  const reorderFields = useReorderFields();
  const deleteFormMutation = useDeleteForm();
  const publishForm = usePublishForm();

  // State Management
  const [orderedIds, setOrderedIds] = useState<string[]>([]);
  const [fieldDrafts, setFieldDrafts] = useState<Record<string, any>>({});
  const [formDraft, setFormDraft] = useState<Partial<Form>>({});
  const [savingFieldId, setSavingFieldId] = useState<string | null>(null);
  const [isUpdatingForm, setIsUpdatingForm] = useState(false);

  // Sync orderedIds
  useEffect(() => {
    if (fields) {
      setOrderedIds(fields.slice().sort((a, b) => a.orderIndex - b.orderIndex).map(f => f.id));
    }
  }, [fields]);

  const handlePatchDraft = (fieldId: string, updates: any) => {
    setFieldDrafts(prev => ({ ...prev, [fieldId]: { ...(prev[fieldId] || {}), ...updates } }));
  };

  const handleUpdateFormDraft = (updates: Partial<Form>) => {
    setFormDraft(prev => ({ ...prev, ...updates }));
  };

  const isFormDirty = () => {
    if (!form) return false;
    return Object.keys(formDraft).some(key => {
      const draftVal = (formDraft as any)[key];
      const originalVal = (form as any)[key];
      if (Array.isArray(draftVal)) return JSON.stringify(draftVal) !== JSON.stringify(originalVal);
      return draftVal !== originalVal;
    });
  };

  const isFieldDirty = (field: any) => {
    const draft = fieldDrafts[field.id];
    if (!draft) return false;
    return Object.keys(draft).some(key => {
        const val = draft[key];
        const original = (field as any)[key];
        if (Array.isArray(val)) return JSON.stringify(val) !== JSON.stringify(original);
        return val !== original;
    });
  };

  const handleSaveField = async (fieldId: string) => {
    const draft = fieldDrafts[fieldId];
    setSavingFieldId(fieldId);
    try {
      await updateField.mutateAsync({ id: id!, fieldId, data: draft });
      queryClient.invalidateQueries({ queryKey: [`/api/forms/${id}/fields`] });
      toast({ title: "Success", description: "Field saved" });
      // Remove draft for this field
      setFieldDrafts(prev => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    } catch {
      toast({ title: "Error", description: "Failed to save field", variant: "destructive" });
    } finally {
      setSavingFieldId(null);
    }
  };

  const handleAddField = async (type: string) => {
    try {
      await createField.mutateAsync({
        id: id!,
        data: {
          fieldType: type as any,
          label: "New Field",
          isRequired: false,
          orderIndex: orderedIds.length,
          placeholder: "",
          optionsJson: (type === 'single_choice' || type === 'multi_choice') ? ["Option 1"] : null
        }
      });
      queryClient.invalidateQueries({ queryKey: [`/api/forms/${id}/fields`] });
      toast({ title: "Success", description: "Field added" });
    } catch {
      toast({ title: "Error", description: "Failed to add field", variant: "destructive" });
    }
  };

  const handleUpdateForm = async (updates: any) => {
    if (Object.keys(updates).length === 0) {
      toast({ title: "No changes", description: "There are no changes to save." });
      return;
    }

    setIsUpdatingForm(true);
    try {
      await updateForm.mutateAsync({ id: id!, data: updates });
      queryClient.invalidateQueries({ queryKey: [`/api/forms/${id}`] });
      setFormDraft({});
      toast({ title: "Success", description: "Form updated" });
    } catch {
      toast({ title: "Error", description: "Failed to update form", variant: "destructive" });
    } finally {
      setIsUpdatingForm(false);
    }
  };

  const handlePublishForm = async () => {
    try {
      await publishForm.mutateAsync({
        id: id!,
        data: { languages: currentForm.supportedLanguages || [] }
      });
      queryClient.invalidateQueries({ queryKey: [`/api/forms/${id}`] });
      toast({ title: "Success", description: "Form published and translations generated!" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to publish form", variant: "destructive" });
    }
  };

  if (isFormLoading || isFieldsLoading) {
    return <DashboardLayout><div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div></DashboardLayout>;
  }

  if (!form) return <DashboardLayout>Form not found</DashboardLayout>;

  const currentForm = { ...form, ...formDraft };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <EditorHeader 
          title={currentForm.title}
          status={currentForm.status}
          originalLanguage={currentForm.originalLanguage}
          id={id!}
          onShare={() => setLocation(`/forms/${id}/share`)}
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
                <span className="relative z-20 flex items-center justify-center font-medium">
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="relative pt-6 px-1 pb-4">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <TabsContent value="fields" className="mt-0 space-y-4 outline-none">
                  <FieldList 
                    fields={fields || []}
                    orderedIds={orderedIds}
                    fieldDrafts={fieldDrafts}
                    savingFieldId={savingFieldId}
                    onReorder={async (newIds) => {
                      setOrderedIds(newIds);
                      await reorderFields.mutateAsync({ id: id!, data: { fieldIds: newIds } });
                      queryClient.invalidateQueries({ queryKey: [`/api/forms/${id}/fields`] });
                    }}
                    onPatchDraft={handlePatchDraft}
                    onSaveField={handleSaveField}
                    onDeleteField={async (fid) => {
                      await deleteField.mutateAsync({ id: id!, fieldId: fid });
                      queryClient.invalidateQueries({ queryKey: [`/api/forms/${id}/fields`] });
                    }}
                    isDirty={isFieldDirty}
                  />
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full border-dashed">
                        <Plus className="w-4 h-4 mr-2" />Add Field
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem onClick={() => handleAddField('short_text')}>Short Text</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAddField('long_text')}>Long Text</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAddField('single_choice')}>Single Choice</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAddField('multi_choice')}>Multiple Choice</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAddField('rating')}>Rating</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAddField('date')}>Date</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAddField('email')}>Email</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAddField('phone')}>Phone</DropdownMenuItem>
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
                    isDirty={isFormDirty()}
                    onUpdate={handleUpdateFormDraft}
                    onSave={() => handleUpdateForm(formDraft)}
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
