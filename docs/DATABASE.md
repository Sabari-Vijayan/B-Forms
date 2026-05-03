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
