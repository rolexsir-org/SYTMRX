# Pushing this repository to GitHub

**Repository:** https://github.com/rolexsir-org/SYTMRX

Everything is already prepared:

- git initialised, 2 commits on `main`, clean working tree
- remote `origin` already points at `rolexsir-org/SYTMRX`
- local branch `main` matches the repo's default branch
- no secrets and no build artifacts are tracked

Only the push itself remains — it needs your GitHub credentials.

---

## Push

From `saqibtantray-web/`:

```bash
git push -u origin main
```

That is the whole command. The remote is already configured; verify with
`git remote -v` if you want to check first.

### Authentication

GitHub rejects account passwords over HTTPS. Use one of:

**GitHub CLI (simplest)**
```bash
gh auth login          # once, interactive
git push -u origin main
```

You must have write access to the `rolexsir-org` organisation for the push to
be accepted.

**Personal access token** — create at
https://github.com/settings/tokens with the **`repo`** scope, then use the
token as the password when git prompts. To avoid re-entering it:
```bash
git config --global credential.helper store
```

**SSH** — if you already have keys registered:
```bash
git remote set-url origin git@github.com:rolexsir-org/SYTMRX.git
git push -u origin main
```

---

## Verify

```bash
git remote -v          # points at your repo
git log --oneline -1   # the commit that was pushed
git status             # "working tree clean"
```

On GitHub, the **Actions** tab should show the CI workflow
(`Data · Lint · Types · Build`) running automatically on the push. It runs
without any secrets, which is deliberate — it proves the unconfigured
fallback path stays green.

---

## Deploy to Vercel

1. https://vercel.com/new → **Import** `rolexsir-org/SYTMRX`.
2. Keep every build setting at its default (Next.js is auto-detected).
3. **Deploy.**

No environment variables are required for the first deploy. Everything is
optional and documented in `.env.example` and README section 3.

---

## Notes

- `.env.example` **is** committed (it documents configuration, contains no
  secrets). Real env files — `.env`, `.env.local`, `.env.*.local` — are ignored.
- `node_modules/`, `.next/` and `*.tsbuildinfo` are ignored; the repo is ~555 KB.
- The git identity is set locally to `SYTMRX <sytmrx.dev@gmail.com>`. Change it
  before pushing if you want your own name on the commit:
  ```bash
  git commit --amend --author="Your Name <you@example.com>" --no-edit
  ```
