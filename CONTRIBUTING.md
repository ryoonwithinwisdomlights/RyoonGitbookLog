# Contributing

Thanks for your interest in contributing to **RyoonGitbookLog**.

## Development

### Prerequisites

- Node.js 22+
- pnpm (use `corepack enable`)

### Setup

1. Fork and clone the repo
2. Install dependencies

```bash
corepack enable
pnpm install
```

3. Configure environment variables

Copy `env.example` to `.env.local` and fill required values.

```bash
cp env.example .env.local
```

### Useful commands

- `pnpm dev`
- `pnpm build`
- `pnpm lint`
- `pnpm prettier:check`

## Pull requests

- Keep PRs small and focused.
- Include a short summary and a test plan in the PR description.

