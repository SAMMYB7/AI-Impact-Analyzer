# 🧠 What Phase-5 will do

Right now:

```
Frontend → /webhook/github → backend
```

After Phase-5:

```
GitHub PR → webhook → backend → analyzer
```

But simulation will still work too.

So your backend will support:

* simulated PRs
* real GitHub PRs

Best of both worlds.

---

# 🧱 Phase-5 Implementation Plan

We’ll do this in this order:

### Step 1 — Update webhook controller to accept GitHub payload

### Step 2 — Add GitHub service (fetch changed files)

### Step 3 — Add environment variables

### Step 4 — Setup ngrok

### Step 5 — Configure GitHub webhook

We start with backend changes first.

---

# 🟣 STEP 1 — Update webhook controller for GitHub payload

Your controller currently expects:

```
repo, author, branch, filesChanged
```

GitHub sends:

```
repository.name
pull_request.user.login
pull_request.head.ref
```

We need to support both.

---

## Copilot prompt to paste

```
Refactor webhookController to support both simulated payloads and real GitHub pull request webhook payloads.

If request body contains "pull_request":
- repo = repository.name
- author = pull_request.user.login
- branch = pull_request.head.ref
- prId = "GH-" + pull_request.id
- filesChanged should be fetched later from GitHub API
- for now use placeholder array ["placeholder.js"]

If request body contains simulated fields:
- keep existing logic

Both flows must:
- create PullRequest document
- create PipelineRun
- log event
- return prId
```

Let Copilot update your controller.

Do not remove simulation logic.

---

# 🟣 STEP 2 — Create GitHub service (for later file fetching)

GitHub webhook does NOT include changed files.

We must fetch them using GitHub API.

Create file:

```
src/services/githubService.js
```

---

## Copilot prompt

```
Create githubService.

Function:
getChangedFiles(owner, repo, prNumber)

Use GitHub REST API:
GET /repos/{owner}/{repo}/pulls/{prNumber}/files

Return array of file paths.

If no token provided:
return mock files.

Use axios.
Read token from process.env.GITHUB_TOKEN.
```

We won’t call it yet — just prepare it.

---

# 🟣 STEP 3 — ENV variables

Add to `.env`:

```
GITHUB_TOKEN=your_token_here
GITHUB_OWNER=your_username
```

Token permissions:

```
repo
```

You generate it from GitHub → Developer Settings → PAT.

We’ll use this in Phase-6.

---

# 🟣 STEP 4 — Add auto-analysis toggle (optional)

Inside webhook controller, after PR created:

```
if process.env.AUTO_ANALYZE === "true":
   call analyzerService.analyzePullRequest(prId)
```

Keep default false.

---

# 🟣 STEP 5 — Test locally with simulated payload first

Make sure:

```
POST /api/webhook/github
```

still works with manual payload.

Then we connect GitHub.

---