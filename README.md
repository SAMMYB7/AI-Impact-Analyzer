# 🧠 AI Impact Analyzer

An AI-powered DevOps intelligence platform that analyzes GitHub Pull Requests, predicts risk scores, intelligently selects the minimum tests needed to validate changes, and executes them in a cloud CI/CD pipeline — all powered by a local LLM (Ollama) and AWS infrastructure.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Tech Stack](#tech-stack)
4. [Features](#features)
5. [Project Structure](#project-structure)
6. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Frontend Setup](#frontend-setup)
   - [Backend Setup](#backend-setup)
7. [Environment Variables](#environment-variables)
8. [API Reference](#api-reference)
9. [Frontend Pages](#frontend-pages)
10. [AI & Pipeline Flow](#ai--pipeline-flow)
11. [Screenshots](#screenshots)

---

## Overview

**AI Impact Analyzer** is a full-stack SaaS DevOps platform that brings AI intelligence to your CI/CD workflow. When a Pull Request is opened on GitHub, the system:

1. **Receives the webhook event** from GitHub.
2. **Fetches and classifies the changed files** — mapping each file to the modules it belongs to.
3. **Runs AI-powered risk analysis** using a local LLM (Ollama with `qwen3-coder` or `llama3.1`) to score the PR from 0–100 and assign a risk level (low / medium / high / critical).
4. **Intelligently selects only the tests that matter** — rather than running the full test suite, the AI recommends the minimal set of tests that cover the actual changes.
5. **Triggers an AWS CodeBuild job** with only the selected tests.
6. **Uploads the test report to S3** and polls for completion.
7. **Streams real-time status updates** to the React frontend via Socket.io.
8. **Displays rich analytics** — risk trends, time saved, test reduction rates, pipeline health, and full log output.

The platform provides a production-grade dashboard experience (similar to Datadog, GitHub Actions, or Vercel) with glassmorphism UI, animated counters, live charts, dark/light themes, and detailed log viewers.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        GitHub                               │
│          Pull Request → Webhook POST /api/webhook/github    │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│              Backend  (Node.js / Express)                   │
│                                                             │
│  ┌──────────────┐   ┌─────────────────┐   ┌─────────────┐  │
│  │ Webhook       │   │  AI Service      │   │  Pipeline   │  │
│  │ Controller   │──▶│  (Ollama LLM)    │──▶│  Service    │  │
│  └──────────────┘   └─────────────────┘   └──────┬──────┘  │
│                                                   │         │
│  ┌──────────────┐   ┌─────────────────┐   ┌──────▼──────┐  │
│  │  MongoDB     │   │   AWS CodeBuild  │◀──│  CodeBuild  │  │
│  │  (Data store)│   │   (Test runner)  │   │  Service    │  │
│  └──────────────┘   └────────┬────────┘   └─────────────┘  │
│                              │                              │
│  ┌──────────────┐   ┌────────▼────────┐                     │
│  │  Socket.io   │   │   AWS S3        │                     │
│  │  (Real-time) │   │   (Reports)     │                     │
│  └──────┬───────┘   └─────────────────┘                     │
└─────────┼───────────────────────────────────────────────────┘
          │
┌─────────▼───────────────────────────────────────────────────┐
│              Frontend  (React + Vite)                       │
│                                                             │
│  Dashboard · Pull Requests · AI Analysis · Test Selection   │
│  Test Execution · Metrics · Logs · Settings                 │
└─────────────────────────────────────────────────────────────┘
```

### Pipeline Stages

| Stage | Name | Description |
|-------|------|-------------|
| 1 | Fetch Changes | Clone repo and list changed files |
| 2 | Dependency Mapping | Map files to modules and dependency chains |
| 3 | Risk Prediction | LLM scores the PR 0–100 with explanation |
| 4 | Test Selection | LLM selects the minimal set of relevant tests |
| 5 | Test Execution | AWS CodeBuild runs only the selected tests |
| 6 | Report Upload | Results uploaded to S3 and stored in MongoDB |

---

## Tech Stack

### Frontend (`impact-analyzer/`)

| Technology | Version | Purpose |
|---|---|---|
| **React** | 19.2.0 | Core UI framework |
| **Vite** | 7.3.1 | Build tool and dev server |
| **React Router DOM** | 7.13.0 | Client-side routing (8 routes) |
| **Chakra UI v3** | 3.33.0 | Component library (layout, typography, theming) |
| **Recharts** | 3.7.0 | Charts (Area, Bar, Pie, Line, Composed) |
| **Framer Motion** | 12.34.0 | Animation library |
| **react-icons** | 5.5.0 | Icon library (Lucide icon set) |
| **next-themes** | 0.4.6 | Dark/Light theme switching |
| **axios** | 1.13.5 | HTTP client for backend API calls |

### Backend (`impact-analyzer-backend/`)

| Technology | Version | Purpose |
|---|---|---|
| **Node.js / Express** | 5.x | REST API server |
| **MongoDB / Mongoose** | 9.x | Database and ODM |
| **Socket.io** | 4.x | Real-time bidirectional events |
| **Ollama (local LLM)** | — | AI risk analysis and test selection |
| **AWS CodeBuild** | SDK v3 | Cloud CI/CD test execution |
| **AWS S3** | SDK v3 | Test report storage |
| **AWS SageMaker** | SDK v3 | (Optional) Managed ML inference |
| **jsonwebtoken** | 9.x | JWT authentication |
| **bcryptjs** | 3.x | Password hashing |
| **nodemailer** | 8.x | Email notifications / OTP delivery |
| **dotenv** | 17.x | Environment variable management |

---

## Features

- 🤖 **AI Risk Analysis** — LLM evaluates PR risk (0–100 score), identifies critical files, and provides natural-language reasoning.
- 🧪 **Intelligent Test Selection** — AI selects the minimum viable test suite, skipping tests unrelated to the changes.
- ⚡ **AWS CodeBuild Integration** — Automatically triggers a scoped build job with only the selected test files.
- 📊 **Rich Analytics Dashboard** — 30-day trend charts for time saved, tests reduced, risk scores, pipeline duration, and PR volumes.
- 🔔 **Real-Time Updates** — Socket.io streams pipeline stage transitions and log output live to the frontend.
- 🔐 **JWT Authentication** — Register/login with email + OTP verification, or authenticate via GitHub OAuth.
- 🌐 **GitHub Webhook Integration** — Connects directly to GitHub repository webhooks for automatic PR analysis.
- 🌙 **Dark / Light Mode** — Full theme support with CSS custom properties and `next-themes`.
- 📝 **Live Log Viewer** — Terminal-style log viewer with type (Lambda / Model Inference / Test Runner) and severity (INFO / DEBUG / WARN / ERROR) filtering.
- 📦 **S3 Report Storage** — Full test reports are stored in S3 and retrievable per-PR.

---

## Project Structure

```
AI-Impact-Analyzer/
├── impact-analyzer/                 # React frontend
│   ├── src/
│   │   ├── main.jsx                 # App entry point
│   │   ├── App.jsx                  # Router + SimulationProvider
│   │   ├── pages/                   # 8 page components
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── PullRequestsPage.jsx
│   │   │   ├── AnalysisPage.jsx
│   │   │   ├── TestSelectionPage.jsx
│   │   │   ├── TestExecutionPage.jsx
│   │   │   ├── MetricsPage.jsx
│   │   │   ├── LogsPage.jsx
│   │   │   └── SettingsPage.jsx
│   │   ├── components/
│   │   │   ├── layout/              # MainLayout, Sidebar, TopNavbar
│   │   │   ├── shared/              # GlassCard, StatCard, StatusBadge
│   │   │   └── ui/                  # ChakraProvider wrapper, toaster, tooltip
│   │   ├── hooks/
│   │   │   ├── useSimulation.jsx    # React Context wrapping simulationStore
│   │   │   ├── useAnimatedCounter.js
│   │   │   └── useThemeColors.js
│   │   ├── api/                     # Axios API call helpers
│   │   ├── context/                 # Additional React contexts
│   │   └── theme.js                 # Chakra UI custom theme tokens
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── impact-analyzer-backend/         # Node.js/Express backend
│   ├── server.js                    # Entry point — connects DB then starts server
│   ├── src/
│   │   ├── app.js                   # Express app: middleware, routes, error handler
│   │   ├── config/
│   │   │   ├── db.js                # MongoDB connection
│   │   │   └── aws.js               # AWS SDK config
│   │   ├── routes/
│   │   │   ├── index.js             # Route aggregator
│   │   │   ├── authRoutes.js        # /api/auth/*
│   │   │   ├── webhookRoutes.js     # /api/webhook/*
│   │   │   ├── prRoutes.js          # /api/pr/*
│   │   │   ├── logsRoutes.js        # /api/logs/*
│   │   │   └── githubRoutes.js      # /api/github/*
│   │   ├── controllers/             # Route handler functions
│   │   ├── services/
│   │   │   ├── aiService.js         # Ollama integration (risk, test selection, results)
│   │   │   ├── analyzerService.js   # Orchestrates the full analysis pipeline
│   │   │   ├── pipelineService.js   # Pipeline stage state machine
│   │   │   ├── codebuildService.js  # AWS CodeBuild trigger + polling
│   │   │   ├── s3Service.js         # S3 report upload/download
│   │   │   ├── githubService.js     # GitHub API client
│   │   │   ├── logService.js        # Log persistence helpers
│   │   │   ├── buildPoller.js       # Background CodeBuild status polling
│   │   │   ├── ollamaService.js     # Low-level Ollama HTTP client
│   │   │   └── timerService.js      # Utility timing helpers
│   │   ├── models/
│   │   │   ├── PullRequest.model.js
│   │   │   ├── PipelineRun.model.js
│   │   │   ├── TestMapping.model.js
│   │   │   ├── Log.model.js
│   │   │   ├── User.model.js
│   │   │   └── OTP.model.js
│   │   ├── middleware/
│   │   │   └── auth.js              # JWT protect middleware
│   │   └── utils/                   # Shared utility functions
│   └── package.json
│
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **MongoDB** (local or Atlas URI)
- **Ollama** running locally with a model pulled (e.g. `ollama pull qwen3-coder` or `ollama pull llama3.1:8b`)
- **AWS account** with CodeBuild project and S3 bucket configured (optional — backend degrades gracefully without it)
- A **GitHub repository** with a webhook pointing to your backend's `/api/webhook/github` endpoint (optional for simulation mode)

---

### Frontend Setup

```bash
cd impact-analyzer

# Install dependencies
npm install

# Start the development server (http://localhost:5173)
npm run dev

# Build for production
npm run build
```

The frontend includes a **fully functional simulation mode** — you can explore every page and trigger mock PR analyses without connecting the backend.

---

### Backend Setup

```bash
cd impact-analyzer-backend

# Install dependencies
npm install

# Copy and fill in environment variables
cp .env.example .env   # (or create .env manually — see section below)

# Start with auto-reload (development)
npm run dev

# Start in production
npm start
```

The server starts on port **5000** by default and connects to MongoDB before accepting requests.

---

## Environment Variables

Create a `.env` file in `impact-analyzer-backend/` with the following keys:

```env
# ── Server ────────────────────────────────────────────────────
PORT=5000
NODE_ENV=development

# ── MongoDB ───────────────────────────────────────────────────
MONGO_URI=mongodb://localhost:27017/ai-impact-analyzer

# ── JWT ───────────────────────────────────────────────────────
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d

# ── Ollama (local LLM) ────────────────────────────────────────
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=qwen3-coder-next      # or llama3.1:8b
OLLAMA_TIMEOUT=180000

# ── GitHub ────────────────────────────────────────────────────
GITHUB_TOKEN=ghp_your_github_personal_access_token
GITHUB_WEBHOOK_SECRET=your_webhook_secret

# ── AWS ───────────────────────────────────────────────────────
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
CODEBUILD_PROJECT_NAME=your-codebuild-project
S3_BUCKET_NAME=your-s3-bucket

# ── Email (OTP / notifications) ───────────────────────────────
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
```

---

## API Reference

All routes are prefixed with `/api`.

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health check |
| GET | `/api/health` | API health check |
| GET | `/api/ai/health` | Ollama model health check |

### Authentication (`/api/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register with email + password |
| POST | `/api/auth/verify-otp` | Public | Verify email OTP |
| POST | `/api/auth/resend-otp` | Public | Resend OTP email |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| POST | `/api/auth/github` | Public | GitHub OAuth login |
| POST | `/api/auth/forgot-password` | Public | Send password-reset email |
| PUT | `/api/auth/reset-password/:token` | Public | Reset password with token |
| GET | `/api/auth/me` | 🔒 JWT | Get current user profile |
| PUT | `/api/auth/profile` | 🔒 JWT | Update user profile |
| PUT | `/api/auth/password` | 🔒 JWT | Change password |
| POST | `/api/auth/connect-github` | 🔒 JWT | Connect GitHub account |
| DELETE | `/api/auth/disconnect-github` | 🔒 JWT | Disconnect GitHub account |

### Pull Requests (`/api/pr`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/pr` | 🔒 JWT | List all PRs |
| GET | `/api/pr/recent` | 🔒 JWT | Last 20 PRs |
| GET | `/api/pr/:id` | 🔒 JWT | Get PR by ID |
| GET | `/api/pr/:id/status` | 🔒 JWT | PR + pipeline stages + logs (polling) |
| GET | `/api/pr/:id/report` | 🔒 JWT | Fetch test report from S3 |
| POST | `/api/pr/analyze/:id` | 🔒 JWT | Trigger full AI analysis pipeline |
| PUT | `/api/pr/:id` | 🔒 JWT | Update PR fields |
| DELETE | `/api/pr/:id` | 🔒 JWT | Delete PR and associated data |

### Webhooks (`/api/webhook`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/webhook/github` | Public (HMAC) | Receive real GitHub PR events |
| POST | `/api/webhook/simulate` | 🔒 JWT | Trigger a simulated PR from the frontend |

### Logs (`/api/logs`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/logs` | 🔒 JWT | Fetch system logs with optional filters |

### GitHub (`/api/github`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/github/repos` | 🔒 JWT | List user's GitHub repositories |
| GET | `/api/github/repos/:owner/:repo/prs` | 🔒 JWT | List open PRs for a repo |

---

## Frontend Pages

| Route | Page | Description |
|-------|------|-------------|
| `/dashboard` | Dashboard | KPI stat cards, time-saved area chart, risk distribution donut chart, recent activity feed, environment health |
| `/pull-requests` | Pull Requests | PR list with risk filters (All / High / Medium / Low), simulation trigger button, persistent history |
| `/analysis` | AI Analysis | Staged reveal of AI analysis — file fetching → dependency mapping → risk model → risk score ring with explanation → impacted modules grid → dependency chains |
| `/test-selection` | Test Selection | Selected vs. skipped tests with animated counters, coverage ring chart, optimization breakdown (must-run / dependency-affected / skippable) |
| `/test-runs` | Test Execution | 8-stage CI pipeline progress bar, live test results grid (pass/fail/duration/coverage), streaming terminal log output |
| `/metrics` | Metrics | 5 analytics charts: time saved (area), tests reduced (bar), risk score trend (line), pipeline duration (composed), PRs analyzed 30-day (area) |
| `/logs` | Logs | System log viewer with type tabs (Lambda / Model Inference / Test Runner) and severity filter chips (INFO / DEBUG / WARN / ERROR) |
| `/settings` | Settings | Configuration toggles for AI analysis, test optimization, notifications, GitHub integration, and infrastructure info |

---

## AI & Pipeline Flow

When a PR webhook is received (or a simulation is triggered), the backend orchestrates the following sequence:

```
GitHub Webhook / Simulate Endpoint
        │
        ▼
1. Fetch Changed Files
   └─ Clone repo, diff against base branch, classify files by category
        │
        ▼
2. Dependency Mapping
   └─ Map changed files → modules → inter-module dependency chains
        │
        ▼
3. AI Risk Analysis  (Ollama LLM)
   └─ Prompt: files, modules, commit message, repo context
   └─ Output: riskScore (0-100), riskLevel, reasoning, criticalFiles, suggestions
        │
        ▼
4. AI Test Selection  (Ollama LLM)
   └─ Prompt: risk score, changed files, modules, file categories
   └─ Output: selectedTests[], skippedTests[], selectionStrategy, coverageEstimate
        │
        ▼
5. AWS CodeBuild Execution
   └─ Start build with TEST_FILES env var (only selected tests)
   └─ Poll for completion every 15 seconds
        │
        ▼
6. Report Upload & Storage
   └─ Upload JSON report to S3
   └─ Store results in MongoDB (PipelineRun, TestMapping, Log models)
   └─ Emit Socket.io events to connected frontend clients
```

### AI Prompting Strategy

The AI service uses structured prompts that instruct the LLM to:
- Respond with **pure JSON only** (no markdown, no explanations outside the JSON object).
- Use `/no_think` to suppress chain-of-thought in compatible models.
- Base assessments **strictly on the file names and paths provided** — hallucination of unrelated modules is explicitly prohibited.
- Apply a risk scoring rubric: 0–25 low, 26–50 medium, 51–75 high, 76–100 critical.

---

## Screenshots

The frontend provides a full dark/light themed dashboard experience:

- **Dashboard** — animated stat counters, glassmorphism cards, live area and donut charts
- **AI Analysis** — step-by-step staged reveal with progress indicators, risk score ring, and module dependency visualization
- **Test Execution** — horizontal pipeline stage bar with status indicators and a streaming terminal-style log panel
- **Metrics** — 5 multi-chart analytics page covering 30-day system performance trends

> To see the UI in action, run `npm run dev` inside `impact-analyzer/` and open [http://localhost:5173](http://localhost:5173). Click **"Simulate New PR"** on the Pull Requests page to trigger a full end-to-end simulation with animated state transitions across all pages.
