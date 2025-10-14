# Contact Form Setup Guide

This guide explains how to set up and use the contact form system with email functionality.

## Features

✅ **Contact Form with Validation**

- Name (2-100 characters)
- Email (valid email format)
- Message (10-2000 characters)
- Real-time validation and error handling

✅ **Email System**

- User confirmation email with social links
- Admin notification email with contact details
- Professional email templates

✅ **Data Storage**

- Zod schema validation
- Contact response tracking
- User ID tracking (jatin, himanshu, etc.)

✅ **Admin Dashboard**

- View all contact responses
- Filter by portfolio owner
- Quick reply actions

## Setup Instructions

### 1. Environment Variables

Add these to your `.env.local` file:

```env
# Resend API Key
RESEND_API_KEY=your_resend_api_key_here

# Admin Email (where notifications are sent)
ADMIN_EMAIL=jatin.prakash.2720@gmail.com
```

### 2. Update Email Templates

Edit the email templates to use your actual information:

**File: `src/emails/UserConfirmationEmail.tsx`**

- Update social media links (GitHub, LinkedIn, Twitter, Email)
- Replace "Your Name" with your actual name

**File: `src/emails/AdminNotificationEmail.tsx`**

- Update LinkedIn profile link
- Update any branding elements

### 3. Update Contact Page

**File: `src/components/pages/ContactPage.tsx`**

- The form automatically uses dynamic user data from context
- Update social media links in the contact info section
- Update phone number and email addresses

### 4. Test the System

1. **Test Contact Form**: Visit `/test-contact` to test the form
2. **View Responses**: Visit `/admin/contact-responses` to see submitted forms
3. **Check Emails**: Verify both user and admin emails are sent

## API Endpoints

### Submit Contact Form

```typescript
POST /api/contact
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, I'd like to discuss a project...",
  "userId": "jatin",
  "adminEmail": "jatin.prakash.2720@gmail.com" // optional
}
```

### Get Contact Responses

```typescript
// Get all responses (admin)
GET /api/contact/responses?admin=true

// Get responses for specific user
GET /api/contact/responses?userId=jatin
```

## Usage Examples

### Basic Form Submission

```typescript
const response = await fetch("/api/contact", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "John Doe",
    email: "john@example.com",
    message: "Hello, I'd like to discuss a project...",
    userId: "jatin",
  }),
})
```

### Using the Contact Form Component

```tsx
import ContactPage from "@/components/pages/ContactPage"
import { UserDataProvider } from "@/contexts/UserDataContext"

function MyPage() {
  return (
    <UserDataProvider>
      <ContactPage />
    </UserDataProvider>
  )
}
```

## Customization

### Adding New Portfolio Owners

1. Update the `userId` field in the contact form submission
2. The system will automatically track which portfolio received the message
3. Update admin dashboard to filter by new user IDs

### Styling the Form

The contact form uses Tailwind CSS classes. Key areas to customize:

- Form container: `.bg-[#0F0F0F]/80`
- Input fields: `.bg-black/50`
- Buttons: `.bg-purple-500/20`
- Status messages: `.bg-green-500/20` or `.bg-red-500/20`

### Email Templates

Both email templates use inline styles for maximum compatibility:

- Dark theme for user confirmation
- Light theme for admin notification
- Responsive design
- Professional branding

## Troubleshooting

### Common Issues

1. **Emails not sending**: Check Resend API key and domain verification
2. **Form validation errors**: Ensure all required fields are filled
3. **Context errors**: Make sure ContactPage is wrapped in UserDataProvider

### Debug Mode

Enable console logging by adding this to your contact form:

```typescript
console.log("Form submission:", { formData, userData })
```

## Production Deployment

1. Set up Resend account and verify domain
2. Update all placeholder URLs and emails
3. Configure proper error handling
4. Set up database storage (replace in-memory storage)
5. Add rate limiting for form submissions
6. Set up monitoring for email delivery

## Database Integration

To replace the in-memory storage with a real database:

1. Update `src/services/contactResponseServices.ts`
2. Replace the `contactResponses` array with database calls
3. Add proper error handling and connection management
4. Consider using MongoDB, PostgreSQL, or your preferred database

## Security Considerations

- Add rate limiting to prevent spam
- Implement CAPTCHA for additional protection
- Validate and sanitize all input data
- Use HTTPS for all form submissions
- Consider adding CSRF protection
