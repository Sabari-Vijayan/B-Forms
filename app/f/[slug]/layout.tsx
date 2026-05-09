import { Metadata, ResolvingMetadata } from "next";
import { FormsService } from "@/lib/server/modules/forms/forms.service";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const { data: form } = await FormsService.getFormBySlug(slug);
    
    if (!form || form.status !== 'published') {
      return {
        title: "Form Not Found",
      };
    }

    return {
      title: form.title,
      description: form.description || "Fill out this form powered by B-Forms.",
      openGraph: {
        title: form.title,
        description: form.description || "Fill out this form powered by B-Forms.",
        images: form.featureImageUrl ? [form.featureImageUrl] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: form.title,
        description: form.description || "Fill out this form powered by B-Forms.",
        images: form.featureImageUrl ? [form.featureImageUrl] : [],
      },
    };
  } catch (err) {
    return {
      title: "Fill out Form",
    };
  }
}

export default function PublicFormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
