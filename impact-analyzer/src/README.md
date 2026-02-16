# 🧠 AI-Driven Impact Analyzer — Frontend Build Instructions

**Stack:** React + Vite + Chakra UI
**Goal:** Build UI for simulated + real PR analysis pipeline

---

# 🎯 Objective

Build a professional DevOps dashboard UI that interacts with the backend.

The frontend must support:

* Simulated PR creation
* Real GitHub PR display
* PR analysis trigger
* Pipeline stage visualization
* Logs streaming
* Metrics display

The UI must feel like:

> GitHub Actions + Datadog + CI dashboard

---

# 🧱 Backend API Reference

Use these endpoints:

```
POST /api/webhook/github
POST /api/pr/analyze/:id
GET  /api/pr/:id
GET  /api/logs/:id   (if implemented)
```

All UI logic is built around these.

---

# 🗂️ Folder Structure

```
src/
 ├─ api/
 │   api.js
 │
 ├─ pages/
 │   Dashboard.jsx
 │   PRDetails.jsx
 │
 ├─ components/
 │   PRTable.jsx
 │   PipelineView.jsx
 │   LogViewer.jsx
 │   SimulatePRModal.jsx
 │   StatsBar.jsx
 │
 ├─ context/
 │   PRContext.jsx
 │
 └─ App.jsx
```

---

# 🧠 GLOBAL UI DESIGN RULES

Tell Copilot:

```
Use Chakra UI v3 components.
Dark theme only.
Professional DevOps dashboard.
No playful colors.
Use gray/black palette.
Use cards, tables, badges, progress bars.
```

Color scheme:

```
bg: gray.950
card: gray.900
border: gray.800
text: gray.200
accent: blue.400
risk-high: red.400
risk-medium: yellow.400
risk-low: green.400
```

---

# 🔧 STEP 1 — Setup API Client

## Copilot prompt

```
Create api client module.

File: src/api/api.js

Functions:
createPR(payload)
analyzePR(prId)
getPR(prId)
getLogs(prId)

Use axios.
Base URL from env: VITE_API_URL
```

---

# 🔧 STEP 2 — Global PR Context

## Copilot prompt

```
Create PRContext using React context.

Store:
currentPR
setCurrentPR
logs
setLogs

Provide provider wrapper.
```

---

# 🔧 STEP 3 — Dashboard Page

This is main page.

Shows:

* simulate PR button
* PR list
* stats

## Copilot prompt

```
Create Dashboard page.

Layout:
Sidebar
Header
Stats bar
PR table
Simulate PR button

Use Chakra UI:
Grid
Flex
Card
Table
Button

Fetch recent PRs when page loads.
```

---

# 🔧 STEP 4 — Simulate PR Modal

This triggers backend.

## Copilot prompt

```
Create SimulatePRModal component.

Fields:
repo
author
branch
filesChanged (comma separated)

On submit:
POST /api/webhook/github

Return prId.
Close modal.
Refresh dashboard.
```

---

# 🔧 STEP 5 — PR Table Component

Shows all PRs.

## Copilot prompt

```
Create PRTable component.

Columns:
PR ID
Author
Branch
Status
Risk score
Actions

Status badge colors:
received → gray
analyzing → blue
completed → green
failed → red

Click row → open PR details page.
```

---

# 🔧 STEP 6 — PR Details Page

This is the core screen.

Shows:

* risk score
* modules impacted
* selected tests
* pipeline stages
* logs

## Copilot prompt

```
Create PRDetails page.

Fetch PR by id.
Show:

Risk score card
Modules impacted
Selected tests
Skipped tests
Pipeline view
Logs viewer
Analyze button

Analyze button:
POST /api/pr/analyze/:id
Then refetch PR every 2 seconds.
```

---

# 🔧 STEP 7 — Pipeline View

Visual pipeline stages.

## Copilot prompt

```
Create PipelineView component.

Stages:
fetch_changes
dependency_mapping
risk_prediction
test_selection
test_execution
report_upload

Use Chakra:
Stepper or Progress bar

Each stage shows:
status
color
```

---

# 🔧 STEP 8 — Log Viewer

## Copilot prompt

```
Create LogViewer component.

Fetch logs for PR.
Show streaming list.
Auto refresh every 2 seconds.
Scrollable panel.
Monospace font.
```

---

# 🔧 STEP 9 — Stats Bar

Shows metrics.

## Copilot prompt

```
Create StatsBar component.

Cards:
Total PRs
Avg risk
Tests saved
Time saved

Use Chakra Stat components.
```

---

# 🔧 STEP 10 — Routing

## Copilot prompt

```
Setup React Router.

Routes:
/ → Dashboard
/pr/:id → PRDetails
```

---

# 🔧 STEP 11 — Theme Setup

## Copilot prompt

```
Create Chakra dark theme.

Primary colors:
gray scale
blue accent

Apply global styles:
bg: gray.950
card bg: gray.900
border: gray.800
```

---

# 🔄 FRONTEND FLOW

### Simulated PR

```
Click simulate
→ POST webhook
→ show in table
→ click analyze
→ pipeline runs
→ logs update
```

### Real GitHub PR

```
PR opened on GitHub
→ backend receives webhook
→ appears in dashboard
→ analyze
```

No UI change needed.

---

# 🧪 TEST PLAN

### Test 1

Simulate PR
→ appears in dashboard

### Test 2

Analyze PR
→ pipeline updates

### Test 3

Logs visible

### Test 4

Risk score visible

---

# 🧠 IMPORTANT COPILOT RULES

Always tell Copilot:

```
Use Chakra UI components only.
Do not invent components.
Use Flex, Box, Grid, Card.
No Tailwind.
```

---

# 🧱 FINAL UI LOOK

Should look like:

* GitHub Actions dashboard
* dark theme
* minimal
* professional

Not a student UI.

---