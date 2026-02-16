# 🧠 AI-Driven Impact Analyzer — Complete Application Documentation

## Table of Contents

1. [Overview](#1-overview)
2. [Technology Stack](#2-technology-stack)
3. [Architecture & Project Structure](#3-architecture--project-structure)
4. [State Management — The Simulation Engine](#4-state-management--the-simulation-engine)
5. [Routing & Layout System](#5-routing--layout-system)
6. [Theme System (Dark/Light Mode)](#6-theme-system-darklight-mode)
7. [Mock Data Layer](#7-mock-data-layer)
8. [Page-by-Page Breakdown](#8-page-by-page-breakdown)
   - [8.1 Dashboard Page](#81-dashboard-page)
   - [8.2 Pull Requests Page](#82-pull-requests-page)
   - [8.3 AI Analysis Page](#83-ai-analysis-page)
   - [8.4 Test Selection Page](#84-test-selection-page)
   - [8.5 Test Execution Page](#85-test-execution-page)
   - [8.6 Metrics Page](#86-metrics-page)
   - [8.7 Logs Page](#87-logs-page)
   - [8.8 Settings Page](#88-settings-page)
9. [Charts & Graphs — Detailed Breakdown](#9-charts--graphs--detailed-breakdown)
10. [Shared Components](#10-shared-components)
11. [Layout Components (Sidebar, TopNavbar)](#11-layout-components-sidebar-topnavbar)
12. [Notification System](#12-notification-system)
13. [Animation System](#13-animation-system)
14. [Simulation Flow — Step by Step](#14-simulation-flow--step-by-step)
15. [Design System & Visual Language](#15-design-system--visual-language)

---

## 1. Overview

The **AI-Driven Impact Analyzer** is a **frontend-only simulation** of a cloud-native AI impact analysis system for GitHub Pull Requests. It is a **demo/prototype application** — there is no real backend, no real AI model, and no real GitHub integration.

### What It Simulates

The application simulates a production-grade SaaS DevOps intelligence platform (similar to Datadog, GitHub Actions, Vercel Dashboard, or AWS Console) that would:

1. **Receive a GitHub Pull Request** (webhook event)
2. **Run AI-powered impact analysis** on the changed files to predict which parts of the codebase are affected
3. **Predict a risk score** (how likely the changes are to break something)
4. **Intelligently select only the necessary tests** to run (instead of running the full test suite)
5. **Execute those tests** in a CI pipeline
6. **Report results** with analytics, metrics, and detailed logs

### Key Design Philosophy

- **Everything is fake but looks real** — all data is randomly generated from curated pools of realistic values
- **Timed state machine** — the simulation runs through phases on `setTimeout` timers to create the illusion of real-time processing
- **No backend** — all state lives in a JavaScript store (in-memory, pub/sub pattern)
- **Production SaaS aesthetics** — glassmorphism cards, animated counters, live charts, dark/light themes

---

## 2. Technology Stack

| Technology           | Version | Purpose                                                        |
| -------------------- | ------- | -------------------------------------------------------------- |
| **React**            | 19.2.0  | Core UI framework                                              |
| **Vite**             | 7.3.1   | Build tool and dev server                                      |
| **React Router DOM** | 7.13.0  | Client-side routing (8 routes)                                 |
| **Chakra UI v3**     | 3.33.0  | Component library (layout, typography, theming)                |
| **@emotion/react**   | 11.14.0 | CSS-in-JS runtime used by Chakra UI                            |
| **next-themes**      | 0.4.6   | Dark/Light theme switching                                     |
| **Recharts**         | 3.7.0   | Charting library (Area, Bar, Pie, Line, Composed charts)       |
| **Framer Motion**    | 12.34.0 | Animation library (available but mostly using CSS transitions) |
| **react-icons**      | 5.5.0   | Icon library (Lucide icon set, `Lu` prefix)                    |

---

## 3. Architecture & Project Structure

```
src/
├── main.jsx                        # App entry point, wraps in ChakraProvider + ColorModeProvider
├── App.jsx                         # BrowserRouter with all routes, wraps in SimulationProvider
├── App.css                         # Minimal app-level styles
├── index.css                       # Global CSS: fonts, themes (.dark/.light), animations, scrollbars
│
├── data/
│   ├── mockData.js                 # All fake data: authors, branches, files, test suites, generators
│   └── simulationStore.js          # State machine: phases, timers, pub/sub notifications
│
├── hooks/
│   ├── useSimulation.jsx           # React Context provider wrapping simulationStore
│   ├── useAnimatedCounter.js       # Hook: smoothly animates number transitions (eased rAF)
│   └── useThemeColors.js           # Hook: returns ~30 theme-aware color tokens
│
├── components/
│   ├── layout/
│   │   ├── MainLayout.jsx          # Sidebar + TopNavbar + scrollable content area
│   │   ├── Sidebar.jsx             # Left navigation, collapsible, phase indicator
│   │   └── TopNavbar.jsx           # Clock, health, notifications, theme toggle, breadcrumb
│   ├── shared/
│   │   ├── GlassCard.jsx           # Reusable glassmorphism card component
│   │   ├── StatCard.jsx            # Metric display card with animated counter
│   │   └── StatusBadge.jsx         # Color-coded status pill (running, completed, failed, etc.)
│   └── ui/
│       ├── provider.jsx            # ChakraProvider + ColorModeProvider wrapper
│       ├── color-mode.jsx          # useColorMode(), useColorModeValue(), ColorModeButton exports
│       ├── toaster.jsx             # Toast notification component
│       └── tooltip.jsx             # Tooltip component
│
├── pages/
│   ├── DashboardPage.jsx           # System overview with stat cards, charts, activity feed
│   ├── PullRequestsPage.jsx        # PR list with persistent history, risk filters, simulation trigger
│   ├── AnalysisPage.jsx            # AI analysis visualization with staged reveal
│   ├── TestSelectionPage.jsx       # Test optimization display (selected vs skipped)
│   ├── TestExecutionPage.jsx       # CI pipeline stages, live test results, streaming logs
│   ├── MetricsPage.jsx             # 5 analytics charts (time saved, tests, risk, pipeline, PRs)
│   ├── LogsPage.jsx                # System log viewer with type/severity filters
│   └── SettingsPage.jsx            # Configuration toggles (all fake)
│
├── theme.js                        # Chakra UI custom theme tokens (navy, brand colors)
└── assets/                         # Static assets directory
```

---

## 4. State Management — The Simulation Engine

### How It Works (No Redux, No Zustand — Custom Pub/Sub)

The state management is a **custom publish/subscribe pattern** implemented in `simulationStore.js`:

```
simulationStore.js (plain JS module)
    ↓ exports: subscribe(), getState(), startSimulation(), resetSimulation(), etc.
    ↓
useSimulation.jsx (React Context)
    ↓ wraps store in Context + Provider, converts to React state via subscribe()
    ↓
Every page/component calls useSimulation() to read state and dispatch actions
```

### State Shape

The global state object contains:

| Field               | Type         | Description                                                                                                                               |
| ------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `phase`             | string       | Current simulation phase: `"idle"`, `"pr_received"`, `"analyzing"`, `"predicting"`, `"selecting_tests"`, `"running_tests"`, `"completed"` |
| `currentPR`         | object\|null | The currently active pull request being simulated                                                                                         |
| `testResults`       | array\|null  | Generated test results (pass/fail for each test)                                                                                          |
| `pipelineStages`    | array        | 8-stage CI pipeline with status tracking                                                                                                  |
| `currentStageIndex` | number       | Which pipeline stage is currently active (-1 to 7)                                                                                        |
| `dashboardStats`    | object       | Aggregate statistics (PRs analyzed, tests saved, health, etc.)                                                                            |
| `metricsHistory`    | array        | 30 days of generated time-series data for charts                                                                                          |
| `logs`              | array        | Full set of generated logs for current simulation                                                                                         |
| `visibleLogs`       | array        | Logs revealed so far (streamed over time)                                                                                                 |
| `completedPRs`      | array        | **Persistent** — all PRs that have completed simulation (survives reset)                                                                  |
| `notifications`     | array        | System notifications (survives reset, capped at 20)                                                                                       |
| `simulationHistory` | array        | Session-level tracking                                                                                                                    |
| `activeLogIndex`    | number       | Current log streaming position                                                                                                            |

### Phase Transitions (Timed State Machine)

When `startSimulation()` is called, a series of `setTimeout` calls drive the simulation:

```
idle → pr_received (0ms)
  → analyzing (1500ms)
  → analyzing (3000ms)     [stages advance]
  → predicting (5000ms)
  → predicting (7000ms)
  → selecting_tests (8500ms)
  → running_tests (10000ms)
  → completed (15000ms)
```

Each transition:

- Advances pipeline stages (marks previous as "completed", current as "running")
- At `selecting_tests`: adds a notification with risk assessment
- At `running_tests`: generates test results
- At `completed`: stores the PR in `completedPRs`, updates dashboard stats, adds success/error notification

### Key Behaviors

- **`resetSimulation()`**: Resets phase to `"idle"`, clears current PR, test results, logs — but **preserves** `completedPRs` and `notifications`
- **`startSimulation()`**: Generates a new PR, kicks off timed transitions, streams logs gradually
- **Log streaming**: Logs are revealed one-by-one over 15 seconds using individual `setTimeout` calls
- **Notifications**: Generated at key moments (PR received, risk assessment, completion). Capped at 20. Each has `read` boolean, type (info/success/warning/error), and timestamp.

---

## 5. Routing & Layout System

### Routes

| Path              | Page Component            | Description                                |
| ----------------- | ------------------------- | ------------------------------------------ |
| `/dashboard`      | `DashboardPage`           | System overview with metrics and charts    |
| `/pull-requests`  | `PullRequestsPage`        | PR list, simulation trigger, history       |
| `/analysis`       | `AnalysisPage`            | AI impact analysis visualization           |
| `/test-selection` | `TestSelectionPage`       | Which tests were selected/skipped and why  |
| `/test-runs`      | `TestExecutionPage`       | CI pipeline, test results, live log output |
| `/metrics`        | `MetricsPage`             | Analytics dashboard with 5 charts          |
| `/logs`           | `LogsPage`                | System log viewer                          |
| `/settings`       | `SettingsPage`            | Configuration panel                        |
| `*`               | Redirects to `/dashboard` | Catch-all redirect                         |

### Layout Structure

All routes are wrapped in `<MainLayout>`:

```
┌──────────────────────────────────────────────┐
│ ┌──────────┐ ┌─────────────────────────────┐ │
│ │          │ │        TopNavbar             │ │
│ │          │ ├─────────────────────────────┤ │
│ │ Sidebar  │ │                             │ │
│ │ (nav)    │ │     <Outlet /> (page)       │ │
│ │          │ │     scrollable content      │ │
│ │          │ │                             │ │
│ └──────────┘ └─────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

---

## 6. Theme System (Dark/Light Mode)

### How Theming Works

The app supports full **dark and light mode** toggling:

1. **CSS Variables** (in `index.css`): Two sets of CSS custom properties are defined under `.dark` and `.light` classes. These control global backgrounds, scrollbars, and body-level styles.

2. **`useThemeColors()` hook** (in `useThemeColors.js`): Returns ~30 color tokens that components use. Reads `colorMode` from `next-themes` and returns appropriate colors:

   | Token           | Dark Value               | Light Value                 | Usage                    |
   | --------------- | ------------------------ | --------------------------- | ------------------------ |
   | `bg`            | `#060d1f`                | `#f0f2f5`                   | Main background          |
   | `bgCard`        | `rgba(15, 23, 52, 0.6)`  | `rgba(255, 255, 255, 0.85)` | Card backgrounds         |
   | `bgCardSolid`   | `#0f1734`                | `#ffffff`                   | Tooltip backgrounds      |
   | `bgHover`       | `rgba(255,255,255,0.05)` | `rgba(0,0,0,0.04)`          | Hover states             |
   | `border`        | `rgba(255,255,255,0.06)` | `rgba(0,0,0,0.08)`          | Standard borders         |
   | `textPrimary`   | `#ffffff`                | `#1a202c`                   | Main text                |
   | `textSecondary` | `rgba(255,255,255,0.7)`  | `rgba(0,0,0,0.65)`          | Secondary text           |
   | `textMuted`     | `rgba(255,255,255,0.5)`  | `rgba(0,0,0,0.45)`          | Muted/label text         |
   | `textFaint`     | `rgba(255,255,255,0.4)`  | `rgba(0,0,0,0.35)`          | Subtle/timestamp text    |
   | `accent`        | `#00bcd4`                | `#00bcd4`                   | Brand accent (same both) |
   | `accentText`    | `#00e5ff`                | `#0097a7`                   | Accent text              |

3. **Theme toggle**: A sun/moon icon button in the TopNavbar calls `toggleColorMode()` from `next-themes`.

4. **Semantic colors remain fixed**: Status colors like `#38a169` (green/success), `#e53e3e` (red/error), `#d69e2e` (yellow/warning), `#6366f1` (indigo), `#805ad5` (purple) are the same in both themes.

---

## 7. Mock Data Layer

### Data Pools (`mockData.js`)

All fake data is generated from curated pools:

- **14 Authors**: Each with name, avatar initials, and role (Senior Engineer, Staff Engineer, Backend Lead, DevOps Engineer, etc.)
- **20 Branches**: Realistic git branch names (`feature/user-auth-refactor`, `fix/payment-gateway-timeout`, `hotfix/cache-invalidation`, etc.)
- **20 Commit Messages**: Professional commit messages matching the branches
- **35 Source Files**: Mapped to 11 modules (Authentication, Payment Processing, ML Pipeline, Cache Layer, Notifications, Database, API Gateway, Event Streaming, Multi-Tenant, Core Utilities, Configuration)
- **~50 Test Files**: Mapped to modules (unit, integration, and e2e tests)
- **14 Dependency Chains**: Module-to-module relationships with strength (strong/medium/weak)
- **9 Risk Explanations**: 3 per risk level (high/medium/low), written as realistic AI analysis text

### PR Generation (`generatePR()`)

When a new simulation starts, `generatePR()`:

1. Picks a random author, branch, and commit message
2. Selects 3-8 random changed files from the 35-file pool
3. Derives affected modules from the file-to-module mapping
4. Determines risk level: >3 modules = "high", >1 = "medium", 1 = "low"
5. Generates risk score (high: 75-95, medium: 40-74, low: 10-39) and confidence (72-97%)
6. Selects 40-70% of relevant tests as "selected", rest as "skipped"
7. Picks a matching risk explanation text

### Pre-seeded PR History (8 PRs)

The app starts with 8 realistic completed PRs already in history (`PRE_SEEDED_PRS`). These have hand-crafted data with varied risk levels, test pass/fail counts, and realistic timestamps.

### Metrics History (`generateMetricsHistory()`)

Generates 30 days of fake time-series data with fields:

- `prsAnalyzed`: 8-32 PRs/day
- `timeSaved`: 12-48 min/day
- `testsReduced`: 120-580 tests skipped/day
- `testsRun`: 40-200 tests executed/day
- `avgRiskScore`: 25-65
- `pipelineDuration`: 2.5-8.5 min
- `buildSuccessRate`: 88-99%
- `avgConfidence`: 78-96%

---

## 8. Page-by-Page Breakdown

### 8.1 Dashboard Page

**Route**: `/dashboard`

**Purpose**: High-level system overview — the "home screen" of the platform.

**UI Sections**:

1. **Hero Stats Row (4 cards)**:
   - **PRs Analyzed**: Total PRs processed (starts at 1,847). Trend: ↑ 12.3%
   - **Tests Saved**: Total tests skipped via optimization (starts at 42,680). Trend: ↑ 8.7%
   - **Avg Time Saved**: Minutes saved per analysis (18.3 min). Trend: ↑ 3.2 min
   - **Pipeline Health**: Overall system health percentage (97.3%). Trend: ↑ 0.8%

2. **Second Stats Row (4 cards)**:
   - **Model Accuracy**: AI model prediction accuracy (94.1%)
   - **Tests Optimized**: Percentage of tests skipped (68.4%)
   - **Active PRs**: Currently open PRs (12)
   - **Avg Build Time**: Average CI build time ("4.2 min")

3. **Charts Row**:
   - **Time Saved Per Day** (Area Chart): Shows daily minutes saved over last 14 days
   - **Risk Distribution** (Donut/Pie Chart): Breakdown of Low/Medium/High risk PRs

4. **Bottom Row**:
   - **Recent Activity** (Feed/List): 6 recent PR events with risk badges and timestamps
   - **Environment Status**: 3 environments (Production, Staging, Development) with health status, uptime, and region. Includes a mini bar chart of Pipeline Success Rate (14 days).

### 8.2 Pull Requests Page

**Route**: `/pull-requests`

**Purpose**: Central hub for triggering simulations and viewing PR history.

**UI Sections**:

1. **Header Bar**:
   - Title "Pull Requests" with current count
   - **"Simulate New PR" button** — the main action button. When clicked: generates a new PR, starts the simulation, and navigates to `/analysis`
   - **"Reset" button** — resets the active simulation (but keeps history)

2. **Risk Filter Bar**:
   - Tabs: All | High (count) | Medium (count) | Low (count)
   - Filters the PR list by risk level

3. **PR List (Cards)**:
   - Each PR card shows:
     - PR ID (e.g., "PR-1248"), branch name, author avatar + name + role
     - Commit message
     - Risk badge (High/Medium/Low) with color coding
     - Risk score (0-100) and confidence percentage
     - Lines changed (+additions / -deletions)
     - Changed files count
     - Status badge (completed/failed/open/analyzing)
     - Test results badge: ✓ passed count / ✗ failed count
     - Timestamp (relative, e.g., "2h ago")

4. **Persistent History**:
   - Completed PRs accumulate across multiple simulations
   - The list shows: active PR (if any) + all completed PRs
   - Starts with 8 pre-seeded PRs

### 8.3 AI Analysis Page

**Route**: `/analysis`

**Purpose**: The "core illusion" — shows a staged, animated reveal of AI analyzing the PR.

**UI Sections** (when a simulation is active):

1. **Analysis Progress Stages** (5-step pipeline):
   - Step 1: "Fetching changed files" (blue)
   - Step 2: "Mapping dependency graph" (purple)
   - Step 3: "Running impact model" (yellow)
   - Step 4: "Predicting risk score" (red)
   - Step 5: "Analysis complete" (green)
   - Each stage has an icon, label, and status indicator (pending → running with spinner → completed with checkmark)
   - Stages reveal progressively as the simulation phases advance

2. **PR Info Card** (when revealed):
   - Author, branch, commit message
   - Changed files with file paths
   - Lines added/deleted

3. **Risk Prediction Panel** (revealed at stage 4+):
   - Large animated risk score (0-100) with color-coded ring
   - Confidence percentage
   - Risk level badge (High/Medium/Low)
   - AI-generated explanation text

4. **Impacted Modules Grid**:
   - Cards for each affected module
   - Shows number of files changed per module

5. **Dependency Chain Visualization**:
   - Shows module-to-module dependencies
   - Each chain has "from → to" with strength indicator (strong/medium/weak)
   - Only shows dependencies relevant to the current PR's modules

6. **Idle State** (no simulation):
   - Large brain icon
   - "No Active Analysis" message
   - Prompt to navigate to Pull Requests

### 8.4 Test Selection Page

**Route**: `/test-selection`

**Purpose**: Shows how the AI optimized test selection — which tests to run and which to skip.

**UI Sections**:

1. **Summary Stats Row (4 cards)**:
   - **Tests Selected**: Number of tests chosen to run (animated counter)
   - **Tests Skipped**: Number of tests deemed unnecessary (animated counter)
   - **Time Saved**: Estimated minutes saved (animated)
   - **Code Coverage**: Coverage percentage maintained (animated)

2. **Coverage Analysis** (SVG donut chart):
   - Circular progress ring showing coverage percentage
   - Test reduction percentage label
   - Module breakdown grid

3. **Optimization Breakdown**:
   - Shows categorization: "Must run", "Dependency affected", "Skippable"
   - Visual bars with percentages

4. **Selected Tests List**:
   - Scrollable list of tests chosen for execution
   - Each shows test file name, module, green checkmark
   - Animates in with staggered delay

5. **Skipped Tests List**:
   - Tests that were skipped
   - Each shows file name, module, yellow skip indicator
   - Reason implied by module relationship

### 8.5 Test Execution Page

**Route**: `/test-runs`

**Purpose**: Simulates a CI/CD pipeline execution with live results.

**UI Sections**:

1. **Pipeline Stages Bar** (horizontal scrollable):
   - 8 stages: Webhook Received → Fetch Changes → Dependency Mapping → AI Impact Analysis → Risk Assessment → Test Selection → Test Execution → Report Generation
   - Each stage shows emoji icon, name, duration, and status (pending/running/completed)
   - Running stage pulses with animation

2. **Test Results Grid** (when tests are running/completed):
   - Each test row shows:
     - Test file name and module
     - Status: PASS (green) or FAIL (red)
     - Duration (seconds)
     - Assertion count
     - Coverage percentage
   - Pass/fail summary at the top

3. **Live Log Output** (terminal-style panel):
   - Dark background, monospace font
   - Logs stream in real-time (one-by-one over 15 seconds)
   - Each log shows timestamp, colored severity badge, and message
   - Auto-scrolls to bottom as new logs appear

4. **Execution Summary** (after completion):
   - Total passed / failed counts
   - Total duration
   - Overall status badge

5. **Idle State** (no simulation):
   - Play icon
   - "No Test Run Active" message

### 8.6 Metrics Page

**Route**: `/metrics`

**Purpose**: Analytics dashboard with 5 charts showing system performance trends.

**UI Sections**:

1. **Refresh Data Button**: Regenerates all metrics data (new random values)

2. **5 Chart Cards** (detailed in Section 9 below):
   - Time Saved Per Day (Area Chart)
   - Tests Reduced (Bar Chart)
   - Risk Score Trend (Line Chart)
   - Pipeline Duration (Composed Chart)
   - PRs Analyzed — 30 Day Overview (Area Chart)

### 8.7 Logs Page

**Route**: `/logs`

**Purpose**: System log viewer with filtering capabilities.

**UI Sections**:

1. **Log Type Tabs**:
   - All Logs (teal)
   - Lambda (orange) — AWS Lambda function logs
   - Model Inference (indigo) — AI model logs
   - Test Runner (green) — Test execution logs

2. **Severity Filter Chips**:
   - All | INFO | DEBUG | WARN | ERROR
   - Color-coded by severity
   - Clickable to filter

3. **Log List** (scrollable, terminal-style):
   - Each log entry shows:
     - Timestamp (e.g., "2026-02-12T08:23:14.221Z")
     - Severity badge (INFO=green, DEBUG=purple, WARN=yellow, ERROR=red)
     - Log message text
   - Realistic log messages covering webhook handling, API calls, model inference, test execution

4. **Export Button**: Download icon (decorative, demo only)

### 8.8 Settings Page

**Route**: `/settings`

**Purpose**: Fake configuration panel to complete the SaaS dashboard look.

**UI Sections**:

1. **AI Analysis Settings**:
   - Auto-Analyze PRs (toggle)
   - AI Explanations (toggle)
   - Security Scanning (toggle)

2. **Test Optimization**:
   - Smart Test Selection (toggle)
   - Cache Results (toggle)
   - Performance Monitoring (toggle)

3. **Notifications**:
   - Slack Notifications (toggle)
   - Email Alerts (toggle)
   - Auto-Merge on Pass (toggle)

4. **Integrations**:
   - GitHub connection status (fake connected state)
   - API Token display (masked)
   - Webhook URL display

5. **Infrastructure**:
   - AI Model version
   - Test Runner version
   - Region
   - Last Deployment date

All toggles use a custom `ToggleSwitch` component with smooth animations. Settings are stored in local component state only (not persisted).

---

## 9. Charts & Graphs — Detailed Breakdown

All charts use the **Recharts** library and render inside `GlassCard` containers.

### 9.1 Time Saved Per Day (Area Chart)

- **Location**: Dashboard Page + Metrics Page
- **Data**: Last 14 days (Dashboard) or 14 days (Metrics) from `metricsHistory`
- **X-axis**: Date labels (e.g., "Feb 1", "Feb 2")
- **Y-axis**: Minutes saved
- **Visual**: Teal/cyan area with gradient fill (`#00bcd4`), smooth curve (`monotone`)
- **What it represents**: How many minutes of CI/CD time were saved each day by only running selected tests instead of the full suite
- **Tooltip**: Shows exact minutes on hover

### 9.2 Risk Distribution (Donut/Pie Chart)

- **Location**: Dashboard Page only
- **Data**: `dashboardStats.riskDistribution` — { low: 62%, medium: 28%, high: 10% }
- **Visual**: Donut chart with three segments:
  - Green (`#38a169`) = Low risk
  - Yellow (`#d69e2e`) = Medium risk
  - Red (`#e53e3e`) = High risk
- **Legend**: Below the chart with colored dots and percentages
- **What it represents**: The proportion of analyzed PRs that fall into each risk category

### 9.3 Pipeline Success Rate (Mini Bar Chart)

- **Location**: Dashboard Page, inside the Environment Status card
- **Data**: Last 14 days of `buildSuccessRate` from `metricsHistory`
- **Visual**: Small teal bars, no axis labels
- **What it represents**: Daily CI/CD pipeline success rate (typically 88-99%)

### 9.4 Tests Reduced (Bar Chart)

- **Location**: Metrics Page
- **Data**: Last 14 days from `metricsHistory`
- **Two bar series**:
  - **Indigo bars** (`#6366f1`): `testsReduced` — number of tests skipped
  - **Teal bars** (`#00bcd4`): `testsRun` — number of tests actually executed
- **What it represents**: The contrast between how many tests were skipped (AI optimization) vs. how many actually ran. The indigo bars should be larger, showing the savings.

### 9.5 Risk Score Trend (Line Chart)

- **Location**: Metrics Page
- **Data**: Full 30-day `metricsHistory`
- **Two lines**:
  - **Yellow solid line** (`#d69e2e`): `avgRiskScore` — average risk score of PRs that day
  - **Green dashed line** (`#38a169`): `avgConfidence` — average AI confidence in predictions
- **Y-axis**: 0-100 scale
- **What it represents**: How the average risk of incoming PRs trends over time, alongside the AI model's confidence. Ideally, confidence stays high while risk varies.

### 9.6 Pipeline Duration (Composed Chart)

- **Location**: Metrics Page
- **Data**: Last 14 days from `metricsHistory`
- **Two data series on different Y-axes**:
  - **Purple bars** (`#805ad5`, left Y-axis): `pipelineDuration` — CI/CD build time in minutes
  - **Green line** (`#38a169`, right Y-axis, domain 80-100): `buildSuccessRate` — success rate percentage
- **What it represents**: The relationship between how long builds take and whether they succeed. You want short bars (fast builds) with a high green line (high success rate).

### 9.7 PRs Analyzed — 30 Day Overview (Area Chart)

- **Location**: Metrics Page
- **Data**: Full 30-day `metricsHistory`
- **Visual**: Indigo area with gradient fill (`#6366f1`), smooth curve
- **What it represents**: Daily volume of PRs analyzed by the system. Shows how busy the development team is.

### 9.8 Coverage Analysis (SVG Donut — Custom)

- **Location**: Test Selection Page
- **Not a Recharts chart** — custom SVG `<circle>` elements
- **Visual**: Ring showing percentage of code coverage maintained after test optimization
- **What it represents**: Even though many tests were skipped, the coverage remains high (typically 78-95%), proving the AI selected the right tests

---

## 10. Shared Components

### GlassCard

- **File**: `components/shared/GlassCard.jsx`
- **Design**: Glassmorphism effect — semi-transparent background with backdrop blur
- **Props**: `hover` (enable lift effect), `glow` (colored shadow on hover), plus any Box props
- **Theme-aware**: Background, border, shadow all adapt to light/dark mode

### StatCard

- **File**: `components/shared/StatCard.jsx`
- **Design**: Metric card with icon, animated counter, trend indicator
- **Props**: `label`, `value` (number), `suffix`, `prefix`, `icon`, `iconColor`, `trend` ("up"/"down"), `trendValue`, `isInteger`
- **Animation**: Uses `useAnimatedCounter` hook — numbers smoothly animate from 0 to target using eased `requestAnimationFrame`
- **Visual**: Has an accent glow circle in the top-right corner matching the icon color

### StatusBadge

- **File**: `components/shared/StatusBadge.jsx`
- **Design**: Small pill/badge with colored dot and label
- **Supports 11 statuses**: running, completed, failed, healthy, degraded, pending, analyzing, open, high, medium, low, passed
- **Each status has**: text color, background color, border color, optional pulse animation
- **Theme-independent**: Uses semantic rgba colors that work in both themes

---

## 11. Layout Components (Sidebar, TopNavbar)

### Sidebar (`components/layout/Sidebar.jsx`)

- **8 navigation items**: Dashboard, Pull Requests, AI Analysis, Test Selection, Test Execution, Metrics, Logs, Settings
- **Collapsible**: Toggle button collapses sidebar from full-width (with labels) to icon-only mode
- **Active route highlighting**: Current page has accent-colored background and left border
- **Phase indicator**: Shows current simulation phase with color-coded dot (e.g., yellow dot = "analyzing")
- **Brand**: "Impact AI" logo/text at top

### TopNavbar (`components/layout/TopNavbar.jsx`)

- **Page title**: Shows current page name based on route
- **Live clock**: Updates every second, shows HH:MM:SS
- **Animated health indicator**: Smoothly animates pipeline health percentage, color changes based on value (green >90, yellow >70, red ≤70)
- **Phase badge**: Shows "● Simulating" badge when a simulation is active
- **Theme toggle**: Sun (☀️) / Moon (🌙) icon button to switch between light and dark mode
- **Notification bell**: Shows unread count badge. Clicking opens a dropdown with:
  - Up to 10 notifications
  - Each shows type icon (colored), title, message, relative timestamp
  - "Mark as read" per notification
  - "Mark all as read" button
  - Click outside to close
- **User avatar**: Fake "SK" avatar circle

---

## 12. Notification System

### How Notifications Work

1. **Pre-seeded**: App starts with 5 notifications (System Online, PR Merged, Dev Degraded, Model Retrained, Rate Limiter Alert)
2. **Generated during simulation**:
   - When PR is received: info notification with PR ID and commit message
   - When risk is assessed (selecting_tests phase): info notification with risk level and score
   - When completed: success (all passed) or error (tests failed) notification
3. **Properties**: `id`, `type` (info/success/warning/error), `title`, `message`, `time` (timestamp), `read` (boolean)
4. **Capped at 20**: Oldest notifications are removed when limit is reached
5. **Persist across resets**: Notifications survive `resetSimulation()`

### Visual

- Bell icon with red badge showing unread count
- Dropdown panel with colored type icons (green check, red X, yellow triangle, blue info)
- Relative timestamps ("3m ago", "1h ago")
- "Mark read" removes the indicator; "Mark all read" clears all

---

## 13. Animation System

### useAnimatedCounter Hook

- **Purpose**: Smoothly animates a number from its current value to a new target
- **Implementation**: Uses `requestAnimationFrame` with cubic ease-out interpolation
- **Duration**: Configurable (default 1500ms)
- **Used by**: StatCard (all 8 dashboard stats), AnalysisPage (risk score, confidence), TestSelectionPage (4 stat counters)

### CSS Animations (in `index.css`)

- **`@keyframes pulse`**: Pulsing animation for "running" status badges
- **`@keyframes shimmer`**: Shimmer/loading effect for skeleton states
- **`@keyframes glow`**: Glowing border effect
- **`@keyframes fadeIn`**: Fade-in for newly appearing elements
- **`@keyframes slideUp`**: Slide-up entrance animation
- **`@keyframes float`**: Subtle floating motion for icons

### Transition Effects

- All interactive elements use `transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)`
- Hover effects: cards lift up (`translateY(-2px)`), backgrounds lighten/darken
- Theme transitions: body background and text color animate over 0.3s

---

## 14. Simulation Flow — Step by Step

Here's exactly what happens when a user clicks "Simulate New PR":

1. **User clicks "Simulate New PR"** on Pull Requests page
2. **`handleAnalyze()`** is called:
   - Sets `isGenerating = true` (shows loading state for 800ms)
   - Calls `resetSimulation()` to clear any previous simulation
   - After 800ms: calls `startSimulation()` and navigates to `/analysis`
3. **`startSimulation()` in simulationStore**:
   - Generates a random PR via `generatePR()` (random author, branch, files, risk, tests)
   - Sets phase to `"pr_received"`
   - Generates pipeline stages and logs
   - Adds "PR Received" notification
   - Schedules 7 timed transitions using `setTimeout`
4. **Phase: `pr_received` (0s)** — Analysis page shows first stage animating
5. **Phase: `analyzing` (1.5s)** — Stages 1-2 reveal, "Fetching files" → "Mapping dependencies"
6. **Phase: `analyzing` (3s)** — Stage 2-3 advance
7. **Phase: `predicting` (5s)** — Risk prediction stage begins
8. **Phase: `predicting` (7s)** — Risk score and confidence animate in
9. **Phase: `selecting_tests` (8.5s)** — Test selection panel populates; risk notification added
10. **Phase: `running_tests` (10s)** — Test results generated; pipeline shows "Test Execution" running
11. **Phase: `completed` (15s)**:
    - All pipeline stages marked complete
    - Dashboard stats updated (totalPRsAnalyzed++, totalTestsSaved updated)
    - PR stored in `completedPRs` with pass/fail counts
    - Success or error notification added
12. **Meanwhile**: Logs are streamed one-by-one from 0s to 15s across all phases
13. **User can navigate freely** between pages during simulation — each page shows relevant data for the current phase
14. **After completion**: User can click "Simulate New PR" again — new PR is generated and added to history

---

## 15. Design System & Visual Language

### Color Palette

| Color      | Hex                   | Usage                                      |
| ---------- | --------------------- | ------------------------------------------ |
| Deep Navy  | `#060d1f`             | Main background (dark mode)                |
| Light Gray | `#f0f2f5`             | Main background (light mode)               |
| Teal/Cyan  | `#00bcd4` / `#00e5ff` | Brand accent, primary actions, area charts |
| Indigo     | `#6366f1`             | Secondary accent, PR stats, bar charts     |
| Purple     | `#805ad5`             | AI/ML elements, pipeline duration          |
| Green      | `#38a169`             | Success, low risk, passed tests            |
| Yellow     | `#d69e2e`             | Warning, medium risk, analyzing            |
| Red        | `#e53e3e`             | Error, high risk, failed tests             |
| Orange     | `#f6ad55` / `#ed8936` | Lambda logs, build time                    |
| Blue       | `#3182ce`             | Info, running status, open PRs             |

### Typography

- **Primary font**: Inter (weights: 300-900)
- **Monospace font**: JetBrains Mono (used in log viewers and code-like displays)
- **Hierarchy**: 2xl for main numbers, sm for card titles, xs for labels and descriptions, 10px for timestamps

### Glassmorphism Design Language

- Semi-transparent backgrounds with backdrop blur
- Subtle borders with low-opacity white (dark) or black (light)
- Depth through shadow layers
- Smooth transitions on all interactive elements
- Accent glows on hover (colored shadows matching the card's theme)

### Responsive Grid

- Dashboard uses 4-column grids on desktop, 2 on tablet, 1 on mobile
- Charts row uses 2:1 ratio on desktop, stacks on mobile
- Sidebar collapses to icon-only mode
- All layouts use Chakra's responsive breakpoint syntax: `{{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }}`
