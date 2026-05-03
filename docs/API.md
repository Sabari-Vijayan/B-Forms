# API Documentation

The Prompt-to-Form API is built with Express 5 and follows REST principles. It is strictly typed using OpenAPI.

## 📜 OpenAPI Specification
The full API definition can be found in `lib/api-spec/openapi.yaml`. You can use this file with tools like Swagger UI or Redoc to explore the endpoints.

## 🔄 Codegen Workflow
We use **Orval** to generate frontend hooks and Zod schemas from the OpenAPI spec.

To update the generated code after changing `openapi.yaml`:
```bash
pnpm --filter @workspace/api-spec run codegen
```

## 📍 Key Endpoints

### Authentication
* `GET /api/auth/me`: Get current authenticated user.

### Forms
* `GET /api/forms`: List all forms for the user.
* `POST /api/forms`: Create a new form.
* `POST /api/forms/{id}/publish`: Publish a form and trigger pre-translation.

### AI
* `POST /api/ai/generate`: Generate a form from a natural language prompt.

### Public
* `GET /api/public/forms/{slug}`: Fetch a published form for respondents.
* `POST /api/public/forms/{slug}/submit`: Submit a form response.

## 🛡️ Validation
Every request is validated against the generated Zod schemas in `lib/api-zod`. This ensures that invalid data never reaches the business logic or database.
