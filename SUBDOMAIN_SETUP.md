# Dynamic Domain Portfolio Setup

This portfolio now supports dynamic domains to serve different users' portfolios using a simple Map-based approach.

## How it works

The portfolio uses a domain mapping to determine the username and display name for each domain.

### URL Structure

- **Main Domain**: `portfolio.jatinbuilds.com` → username: "jatin", display: "Jatin Prakash"
- **Subdomains**: `{username}.portfolio.jatinbuilds.com`

  - Example: `jatin.portfolio.jatinbuilds.com` → username: "jatin", display: "Jatin Prakash"
  - Example: `himanshu.portfolio.jatinbuilds.com` → username: "himanshu", display: "Himanshu"

- **Development**: `{username}.localhost:3000`
  - Example: `jatin.localhost:3000` → username: "jatin", display: "jatin"

## Setup Instructions

### 1. Domain Mapping

Edit `src/lib/domainMapping.ts` to add new users:

```typescript
const DOMAIN_MAP = new Map([
  [
    "portfolio.jatinbuilds.com",
    { username: "jatin", displayName: "Jatin Prakash" },
  ],
  [
    "himanshu.portfolio.jatinbuilds.com",
    { username: "himanshu", displayName: "Himanshu" },
  ],
  [
    "jatin.portfolio.jatinbuilds.com",
    { username: "jatin", displayName: "Jatin Prakash" },
  ],
  // Add more mappings as needed
])
```

### 2. DNS Configuration

For each user, create a CNAME record pointing to your main domain:

```
jatin.portfolio.jatinbuilds.com    CNAME    portfolio.jatinbuilds.com
himanshu.portfolio.jatinbuilds.com CNAME    portfolio.jatinbuilds.com
```

### 3. Vercel Configuration

In your `vercel.json` or Vercel dashboard, add the domains:

```json
{
  "domains": [
    "portfolio.jatinbuilds.com",
    "jatin.portfolio.jatinbuilds.com",
    "himanshu.portfolio.jatinbuilds.com"
  ]
}
```

## Adding New Users

To add a new user (e.g., "alice"):

1. **Domain Mapping**: Add entry to `DOMAIN_MAP` in `src/lib/domainMapping.ts`
2. **Database**: Ensure the user exists in your database with username "alice"
3. **DNS**: Add CNAME record: `alice.portfolio.jatinbuilds.com → portfolio.jatinbuilds.com`
4. **Vercel**: Add the subdomain to your Vercel configuration
5. **Deploy**: The portfolio will automatically work for `alice.portfolio.jatinbuilds.com`

## Technical Implementation

### Domain Mapping

- `src/lib/domainMapping.ts` contains the domain-to-user mapping
- Simple Map-based approach for easy maintenance
- Supports both main domain and subdomains

### Context

- `UserDataContext` stores the current username
- All API calls use the dynamic username

### API Routes

- `/api/users/[username]` - fetches user data
- `/api/projects/[username]` - fetches user projects

## Testing

The portfolio includes a development-only test component that shows:

- Username from context
- Display name from domain mapping
- Current hostname

This appears in the top-right corner during development.

## Fallback Behavior

If no domain mapping is found, the portfolio defaults to username "jatin" and display name "Jatin Prakash".
