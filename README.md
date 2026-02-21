# Marketing Hub

An internal marketing hub for team collaboration — private, authenticated, and packed with integrations.

## Features

- 🔐 **Authentication** — JWT-based login for up to 30 team members
- 📣 **Meta API** — View ad accounts, campaigns, and send Messenger messages
- 🤖 **AI Tools** — Generate marketing copy with OpenAI (GPT-4o-mini) or Anthropic (Claude)
- 🎙️ **Voice Generation** — Create voice-overs with ElevenLabs
- 👥 **Admin Panel** — Overview of all team seats (admin-only)

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in all API keys. **Never commit `.env.local`.**

| Variable | Description |
|---|---|
| `AUTH_SECRET` | Random secret for JWT signing (`openssl rand -base64 32`) |
| `META_ACCESS_TOKEN` | Long-lived Meta Page Access Token |
| `META_PAGE_ID` | Facebook Page ID (for Messenger) |
| `META_API_VERSION` | Meta Graph API version (default `v19.0`) |
| `OPENAI_API_KEY` | OpenAI API key |
| `ANTHROPIC_API_KEY` | Anthropic (Claude) API key |
| `ELEVENLABS_API_KEY` | ElevenLabs API key |

### 3. Add users

Edit `src/lib/users.ts`. The hub supports **up to 30 users**.

Generate a bcrypt hash for each user's password:

```bash
node -e "const b=require('bcryptjs');b.hash('yourpassword',12).then(console.log)"
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Build for production

```bash
npm run build
npm start
```

## Project Structure

```
src/
  app/
    (auth)/login/        # Login page
    (dashboard)/         # Protected pages (requires auth)
      page.tsx           # Overview dashboard
      meta/              # Meta API tools
      ai/                # AI copy generator
      voice/             # ElevenLabs voice generator
      admin/             # User admin (admin role only)
    api/
      auth/[...nextauth] # NextAuth route handler
      meta/              # Meta API proxy
      ai/                # AI API proxy
      voice/             # ElevenLabs proxy
  lib/
    auth.ts              # NextAuth configuration
    users.ts             # User store (edit to add users)
  components/
    Sidebar.tsx
    Providers.tsx
  proxy.ts               # Route protection (Next.js 16)
```

## Security Notes

- All API keys are stored in environment variables and **never exposed to the browser**.
- All `/api/*` routes require an active session.
- Passwords are hashed with bcrypt (cost factor 12).
- The `.env.local` file is git-ignored.
