# Contact Response Model

This file contains the Zod schema and TypeScript types for contact form responses.

## Schema Fields

- **id**: Unique identifier (auto-generated)
- **name**: Person's name (2-100 characters)
- **email**: Valid email address
- **message**: Message content (10-2000 characters)
- **dateOfResponse**: Date in YYYY-MM-DD format
- **timeOfResponse**: Time in HH:MM:SS format
- **userId**: Portfolio owner identifier (e.g., "jatin", "himanshu")
- **createdAt**: Record creation timestamp
- **updatedAt**: Record last update timestamp

## Usage Examples

### Creating a Contact Response

```typescript
import { createContactResponse } from "@/models/ContactResponse"

const contactData = createContactResponse({
  name: "John Doe",
  email: "john@example.com",
  message: "Hello, I'd like to discuss a project...",
  userId: "jatin",
})
```

### Validating Contact Form Data

```typescript
import { validateContactForm } from "@/models/ContactResponse"

try {
  const validatedData = validateContactForm({
    name: "John Doe",
    email: "john@example.com",
    message: "Hello, I'd like to discuss a project...",
    userId: "jatin",
  })
} catch (error) {
  console.error("Validation failed:", error)
}
```

### Full Schema Validation

```typescript
import { ContactResponseSchema } from "@/models/ContactResponse"

const contactResponse = ContactResponseSchema.parse({
  name: "John Doe",
  email: "john@example.com",
  message: "Hello, I'd like to discuss a project...",
  dateOfResponse: "2024-01-15",
  timeOfResponse: "14:30:25",
  userId: "jatin",
})
```

## API Integration

### Submit Contact Form

```typescript
const response = await fetch("/api/contact", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "John Doe",
    email: "john@example.com",
    message: "Hello, I'd like to discuss a project...",
    userId: "jatin",
    adminEmail: "admin@yourdomain.com", // optional
  }),
})
```

### Fetch Contact Responses

```typescript
// Get responses for specific user
const userResponses = await fetch("/api/contact/responses?userId=jatin")

// Get all responses (admin only)
const allResponses = await fetch("/api/contact/responses?admin=true")
```
