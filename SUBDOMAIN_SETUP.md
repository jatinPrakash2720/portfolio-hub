# Dynamic Subdomain Portfolio Setup

This portfolio now supports dynamic subdomains to serve different users' portfolios.

## How it works

The portfolio extracts the username from the subdomain and uses it to fetch the appropriate user data.

### URL Structure

- **Production**: `{username}.portfolio.jatinbuilds.com`

  - Example: `jatin.portfolio.jatinbuilds.com` → username: "jatin"
  - Example: `himanshu.portfolio.jatinbuilds.com` → username: "himanshu"

- **Development**: `{username}.localhost:3000`

  - Example: `jatin.localhost:3000` → username: "jatin"
  - Example: `himanshu.localhost:3000` → username: "himanshu"

- **Fallback**: `portfolio.jatinbuilds.com` → defaults to "jatin"

## Setup Instructions

### 1. DNS Configuration

For each user, create a CNAME record pointing to your main domain:

```
jatin.portfolio.jatinbuilds.com    CNAME    portfolio.jatinbuilds.com
himanshu.portfolio.jatinbuilds.com CNAME    portfolio.jatinbuilds.com
```

### 2. Vercel Configuration

In your `vercel.json` or Vercel dashboard, add the subdomains:

```json
{
  "domains": [
    "portfolio.jatinbuilds.com",
    "jatin.portfolio.jatinbuilds.com",
    "himanshu.portfolio.jatinbuilds.com"
  ]
}
```

### 3. Local Development

For local development, you can test subdomains by:

1. Adding entries to your `/etc/hosts` file:

```
127.0.0.1 jatin.localhost
127.0.0.1 himanshu.localhost
```

2. Access via:

- `http://jatin.localhost:3000`
- `http://himanshu.localhost:3000`

## Adding New Users

To add a new user (e.g., "alice"):

1. **Database**: Ensure the user exists in your database with username "alice"
2. **DNS**: Add CNAME record: `alice.portfolio.jatinbuilds.com → portfolio.jatinbuilds.com`
3. **Vercel**: Add the subdomain to your Vercel configuration
4. **Deploy**: The portfolio will automatically work for `alice.portfolio.jatinbuilds.com`

## Technical Implementation

### Middleware

- `middleware.ts` extracts username from subdomain
- Adds username to request headers for use in components

### Hooks

- `useUsername()` hook extracts username on client side
- Used by components to get current username

### Context

- `UserDataContext` stores the current username
- All API calls use the dynamic username

### API Routes

- `/api/users/[username]` - fetches user data
- `/api/projects/[username]` - fetches user projects

## Testing

The portfolio includes a development-only test component that shows:

- Extracted username from subdomain
- Username stored in context
- Current hostname

This appears in the top-right corner during development.

## Fallback Behavior

If no subdomain is detected, the portfolio defaults to username "jatin" to maintain backward compatibility.
