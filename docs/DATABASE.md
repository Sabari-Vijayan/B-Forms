# Database Schema

The project uses Supabase (PostgreSQL) as its primary data store.

## 📊 Tables

### `forms`
Stores the metadata for each form.
* `id`: uuid (PK)
* `user_id`: uuid (FK to auth.users)
* `title`: text
* `slug`: text (unique, used for public URLs)
* `original_language`: text (e.g., 'en', 'ml')
* `status`: enum ('draft', 'published', 'closed')
* `supported_languages`: text[]

### `form_fields`
Stores the individual questions/fields within a form.
* `id`: uuid (PK)
* `form_id`: uuid (FK to forms)
* `order_index`: integer
* `field_type`: enum ('short_text', 'rating', 'single_choice', etc.)
* `label`: text
* `is_required`: boolean
* `options_json`: text[] (for choice fields)

### `form_translations`
Stores pre-translated field content for multilingual support.
* `id`: uuid (PK)
* `form_id`: uuid (FK to forms)
* `language`: text (target language code)
* `translations_json`: jsonb (map of field_id to translated labels/placeholders)

### `submissions`
Stores the responses from form respondents.
* `id`: uuid (PK)
* `form_id`: uuid (FK to forms)
* `respondent_language`: text
* `raw_responses_json`: jsonb
* `translated_responses_json`: jsonb (responses translated back to creator's language)
* `translation_status`: enum ('pending', 'done', 'failed')

## 🔒 Security (RLS)
Row Level Security is enabled on all tables:
* **Creators** can only see and manage their own forms, fields, and submissions.
* **Respondents** can only read fields of *published* forms and insert new submissions.
* **Public** access is restricted to the bare minimum required to fill out a form.

---

## 📜 SQL Reference (Context Only)

> [!WARNING]
> This schema is for context only and is not meant to be run. Table order and constraints may not be valid for execution.

```sql
CREATE TABLE public.form_fields (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  form_id uuid NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  field_type text NOT NULL CHECK (field_type = ANY (ARRAY['short_text'::text, 'long_text'::text, 'single_choice'::text, 'multi_choice'::text, 'rating'::text, 'date'::text, 'email'::text, 'phone'::text])),
  label text NOT NULL,
  placeholder text,
  is_required boolean NOT NULL DEFAULT false,
  options_json ARRAY,
  CONSTRAINT form_fields_pkey PRIMARY KEY (id),
  CONSTRAINT form_fields_form_id_fkey FOREIGN KEY (form_id) REFERENCES public.forms(id)
);
CREATE TABLE public.form_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  form_id uuid NOT NULL UNIQUE,
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'general'::text,
  is_public boolean NOT NULL DEFAULT true,
  use_count integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT form_templates_pkey PRIMARY KEY (id),
  CONSTRAINT form_templates_form_id_fkey FOREIGN KEY (form_id) REFERENCES public.forms(id)
);
CREATE TABLE public.form_translations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  form_id uuid NOT NULL,
  language text NOT NULL,
  translations_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  generated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT form_translations_pkey PRIMARY KEY (id),
  CONSTRAINT form_translations_form_id_fkey FOREIGN KEY (form_id) REFERENCES public.forms(id)
);
CREATE TABLE public.forms (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  feature_image_url text,
  slug text NOT NULL UNIQUE,
  original_language text NOT NULL DEFAULT 'en'::text,
  status text NOT NULL DEFAULT 'draft'::text CHECK (status = ANY (ARRAY['draft'::text, 'published'::text, 'closed'::text])),
  supported_languages ARRAY NOT NULL DEFAULT '{}'::text[],
  response_limit integer,
  closes_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  preferred_language text,
  CONSTRAINT forms_pkey PRIMARY KEY (id),
  CONSTRAINT forms_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  form_id uuid NOT NULL,
  respondent_language text NOT NULL,
  raw_responses_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  translated_responses_json jsonb,
  translation_status text NOT NULL DEFAULT 'pending'::text CHECK (translation_status = ANY (ARRAY['pending'::text, 'done'::text, 'skipped'::text, 'failed'::text])),
  submitted_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT submissions_pkey PRIMARY KEY (id),
  CONSTRAINT submissions_form_id_fkey FOREIGN KEY (form_id) REFERENCES public.forms(id)
);
```

ublic.forms(id)
);
```

