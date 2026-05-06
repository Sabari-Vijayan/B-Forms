-- ============================================================
-- Prompt-to-Form: Supabase Migration
-- Run this entire file in your Supabase SQL Editor:
--   https://supabase.com/dashboard → your project → SQL Editor
-- ============================================================

-- 1. FORMS
create table if not exists public.forms (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references auth.users(id) on delete cascade,
  title              text not null,
  description        text,
  feature_image_url  text,
  slug               text not null unique,
  original_language  text not null default 'en',
  status             text not null default 'draft' check (status in ('draft','published','closed')),
  supported_languages text[] not null default '{}',
  preferred_language text,
  response_limit     integer,
  closes_at          timestamptz,
  document_json      jsonb not null default '{"info": {}, "items": []}',
  created_at         timestamptz not null default now()
);

create index if not exists forms_user_id_idx   on public.forms(user_id);
create index if not exists forms_slug_idx      on public.forms(slug);
create index if not exists forms_status_idx    on public.forms(status);

-- 2. FORM TRANSLATIONS
create table if not exists public.form_translations (
  id               uuid primary key default gen_random_uuid(),
  form_id          uuid not null references public.forms(id) on delete cascade,
  language         text not null,
  translations_json jsonb not null default '{}',
  generated_at     timestamptz not null default now(),
  unique (form_id, language)
);

create index if not exists form_translations_form_id_idx on public.form_translations(form_id);

-- 3. SUBMISSIONS
create table if not exists public.submissions (
  id                       uuid primary key default gen_random_uuid(),
  form_id                  uuid not null references public.forms(id) on delete cascade,
  respondent_language      text not null,
  raw_responses_json       jsonb not null default '{}',
  translated_responses_json jsonb,
  sentiment_analysis_json   jsonb,
  translation_status       text not null default 'pending' check (translation_status in ('pending','done','skipped','failed')),
  submitted_at             timestamptz not null default now()
);

create index if not exists submissions_form_id_idx on public.submissions(form_id);

-- 4. FORM TEMPLATES
create table if not exists public.form_templates (
  id                 uuid primary key default gen_random_uuid(),
  form_id            uuid not null unique references public.forms(id) on delete cascade,
  user_id            uuid not null references auth.users(id) on delete cascade,
  title              text not null,
  description        text,
  feature_image_url  text,
  category           text not null default 'general',
  is_public          boolean not null default true,
  use_count          integer not null default 0,
  document_json      jsonb,
  created_at         timestamptz not null default now()
);

create index if not exists form_templates_user_id_idx on public.form_templates(user_id);
create index if not exists form_templates_category_idx on public.form_templates(category);

-- 5. FUNCTIONS
create or replace function public.increment_template_use_count(template_id uuid)
returns void as $$
begin
  update public.form_templates
  set use_count = use_count + 1
  where id = template_id;
end;
$$ language plpgsql security definer;

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

-- Forms: owners can do everything
alter table public.forms enable row level security;

create policy "owners can manage their forms"
  on public.forms for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "anyone can read published forms"
  on public.forms for select
  using (status = 'published');

-- Form translations: readable by anyone, writable only by service role
alter table public.form_translations enable row level security;

create policy "anyone can read translations of published forms"
  on public.form_translations for select
  using (exists (select 1 from public.forms where id = form_id and status = 'published'));

create policy "owners can read all their form translations"
  on public.form_translations for select
  using (exists (select 1 from public.forms where id = form_id and user_id = auth.uid()));

-- Submissions: owners can read, anyone can insert to published forms
alter table public.submissions enable row level security;

create policy "owners can read submissions to their forms"
  on public.submissions for select
  using (exists (select 1 from public.forms where id = form_id and user_id = auth.uid()));

create policy "anyone can submit to published forms"
  on public.submissions for insert
  with check (exists (select 1 from public.forms where id = form_id and status = 'published'));

-- Form templates: owners can manage, anyone can read public templates
alter table public.form_templates enable row level security;

create policy "owners can manage their templates"
  on public.form_templates for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "anyone can read public templates"
  on public.form_templates for select
  using (is_public = true);
