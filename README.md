# Tuto - Chat with your Knowledge Base

Tuto is a modern web application to chat with your knowledge base, built with the HONC stack (Hono, OpenAI, Neon, Cloudflare).
I specifically created this project to help me learn quickly in exam season.

## [Demo](https://www.youtube.com/watch?v=rdfsIKXmznU)

Live demo is hosted on cloudflare free plan. better-auth is often exceeds the timeout limit of cloudflare workers free plan. To get better experience, you can run it locally or watch the demo video to get more info.

[https://tuto.mdhruvil.codes/](https://tuto.mdhruvil.codes/)
[https://www.youtube.com/watch?v=rdfsIKXmznU](https://www.youtube.com/watch?v=rdfsIKXmznU)

## Screenshots

## Features and TODOs

- [x] Auth
  - [x] Email
  - [ ] Migrate from better-auth (better-auth exceeds the timeout limit of cloudflare workers free plan)
  - [ ] Socials
- [x] Knowledge Base
- [x] Document Upload
- [x] Document Processing
- [x] Chat
  - [ ] Edit past chat
- [ ] AI
  - [x] Embeddings
  - [x] Vector Search
  - [ ] Multiple AI models
  - [ ] Add voice input voice output. (Maybe using Gemini 2 or OpenAI Real Time API)
- [ ] Improve PDF viewer
- [ ] Ability to create a quiz from the knowledge base (kinda like this [https://github.com/anis-marrouchi/vercel-ai-sdk-quiz/](https://github.com/anis-marrouchi/vercel-ai-sdk-quiz/))
- [ ] Ability to create a flashcard from the knowledge base
- [ ] Ability to save chat history
- [ ] Ability to have multiple chats in one knowledge base
- [ ] A separate document manager so users can resuse uploaded documents

## Prerequisites

- Node.js 18+ and pnpm
- Neon Database account. Enable pg_vector extension in your database. You can follow this guide: [https://neon.tech/docs/extensions/pgvector#enable-the-pgvector-extension](https://neon.tech/docs/extensions/pgvector#enable-the-pgvector-extension)
- Azure OpenAI account (for AI features)
- Cloudflare account (for deployment)

```
.
├── apps
│   ├── api # HONC app
│   └── web # React app with Vite
├── package.json
├── packages
│   └── shared
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── README.md
├── tsconfig.json
└── turbo.json
```

## Setup Environment

1. Create a `.dev.vars` file in the `apps/api` directory. Dont forget to replace the placeholders with your own values.

```bash
cp apps/api/.dev.vars.example apps/api/.dev.vars
```

2. Create a `.env` file in the `apps/web` directory. You dont need change anything.

```bash
cp apps/web/.env.example apps/web/.env
```

3. Install dependencies

```bash
pnpm install
```

4. Migrate the database

```bash
cd apps/api
pnpm db:migrate
```

5. Run the development server

```bash
# make sure to run from the root directory
pnpm dev
```
