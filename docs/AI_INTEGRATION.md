# AI Integration

The core "magic" of Prompt-to-Form is powered by Google Gemini 1.5 Flash.

## 🤖 Model Choice
We use `gemini-1.5-flash-latest` because of its high speed, low cost, and excellent support for JSON mode and long-context understanding.

## 📝 Form Generation
When a user provides a prompt, the system:
1. Detects the language of the prompt using `franc-min`.
2. Sends the prompt to Gemini with a system instruction that defines the expected JSON schema.
3. Gemini returns a structured JSON object containing a title, description, and an array of fields with types and options.
4. The backend validates the AI output with Zod before returning it to the frontend.

## 🌍 Translation Logic

### Pre-translation (Form Publish)
When a creator publishes a form with multiple supported languages:
1. The backend sends the form's fields to Gemini.
2. Gemini translates all labels, placeholders, and options into the target languages.
3. The results are stored in `form_translations`. This ensures that respondents see translations instantly without waiting for an AI call.

### Response Translation (Post-Submission)
When a respondent submits a form in a language different from the creator's:
1. A background process (triggered by a database webhook or direct API call) sends the responses to Gemini.
2. Gemini translates the answers back into the form's `original_language`.
3. The creator sees all responses in their own language on the dashboard.
