import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customFetch } from "@/lib/api";

export type FormStatus = 'draft' | 'published' | 'closed';

export interface Form {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  featureImageUrl?: string | null;
  slug: string;
  originalLanguage: string;
  preferredLanguage?: string | null;
  status: FormStatus;
  supportedLanguages: string[];
  documentJson: any;
  responseLimit?: number | null;
  closesAt?: string | null;
  createdAt: string;
}

export interface Item {
  itemId: string;
  title: string;
  description?: string;
  questionItem?: {
    question: {
      questionId: string;
      required: boolean;
      choiceQuestion?: {
        type: 'RADIO' | 'CHECKBOX' | 'DROP_DOWN';
        options: string[];
      };
      ratingQuestion?: {
        maxRating: number;
      };
      textQuestion?: {
        paragraph: boolean;
      };
      fileQuestion?: {
        maxFiles: number;
        acceptedTypes: string[];
      };
    };
  };
}

export interface Submission {
  id: string;
  formId: string;
  respondentLanguage: string;
  rawResponsesJson: Record<string, any>;
  translatedResponsesJson: Record<string, any> | null;
  translationStatus: "pending" | "done" | "skipped" | "failed";
  submittedAt: string;
}

const DEFAULT_STALE_TIME = 30 * 1000; // 30 seconds

export function useGetDashboardSummary() {
  return useQuery({
    queryKey: ["/api/dashboard/summary"],
    queryFn: () => customFetch<any>("/api/dashboard/summary"),
    staleTime: DEFAULT_STALE_TIME,
  });
}

export function useListForms() {
  return useQuery({
    queryKey: ["/api/forms"],
    queryFn: () => customFetch<Form[]>("/api/forms"),
    staleTime: DEFAULT_STALE_TIME,
  });
}

export function useGetForm(id: string) {
  return useQuery({
    queryKey: ["/api/forms", id],
    queryFn: () => customFetch<Form>(`/api/forms/${id}`),
    enabled: !!id,
    staleTime: DEFAULT_STALE_TIME,
  });
}

export function useCreateForm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: any) =>
      customFetch<Form>("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forms"] });
    },
  });
}

export function useUpdateForm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string; [key: string]: any }) =>
      customFetch<Form>(`/api/forms/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/forms"] });
      queryClient.invalidateQueries({ queryKey: ["/api/forms", variables.id] });
    },
  });
}

export function useDeleteForm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string }) =>
      customFetch<void>(`/api/forms/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forms"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/summary"] });
    },
  });
}

export function useDuplicateForm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string }) =>
      customFetch<Form>(`/api/forms/${id}/duplicate`, { method: "POST" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forms"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/summary"] });
    },
  });
}

export function useGenerateForm() {
  return useMutation({
    mutationFn: (body: { prompt: string; language?: string }) =>
      customFetch<any>("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }),
  });
}

export function useGetPublicForm(slug: string, refetchInterval?: number | false) {
  return useQuery({
    queryKey: ["/api/public/forms", slug],
    queryFn: () => customFetch<Form>(`/api/public/forms/${slug}`),
    enabled: !!slug,
    staleTime: DEFAULT_STALE_TIME,
    refetchInterval,
  });
}

export function useSubmitForm(slug: string) {
  return useMutation({
    mutationFn: (body: any) =>
      customFetch<any>(`/api/public/forms/${slug}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }),
  });
}

export function useListSubmissions(formId: string) {
  return useQuery({
    queryKey: ["/api/forms", formId, "submissions"],
    queryFn: () => customFetch<Submission[]>(`/api/forms/${formId}/submissions`),
    enabled: !!formId,
    staleTime: 10 * 1000, // 10 seconds for submissions
  });
}

export function useGenerateFormSentimentSummary() {
  return useMutation({
    mutationFn: ({ id }: { id: string }) =>
      customFetch<{ summary: string }>(`/api/forms/${id}/sentiment-summary`, {
        method: "POST",
      }),
  });
}

export function usePublishForm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, languages }: { id: string; languages: string[] }) =>
      customFetch<Form>(`/api/forms/${id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ languages }),
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/forms", variables.id] });
    },
  });
}

export function useListTemplates(category?: string) {
  return useQuery({
    queryKey: ["/api/templates", category],
    queryFn: () => customFetch<any[]>(`/api/templates${category ? `?category=${category}` : ""}`),
    staleTime: 5 * 60 * 1000, // 5 minutes for templates
  });
}

export function useUseTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string }) =>
      customFetch<Form>(`/api/templates/${id}/use`, { method: "POST" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forms"] });
    },
  });
}

export function useGetMe() {
  return useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: () => customFetch<{ id: string; email: string }>("/api/auth/me"),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}

export function useUpdateMe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { password?: string }) =>
      customFetch<{ success: boolean }>("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    },
  });
}
