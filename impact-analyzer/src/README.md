# 🎯 DESIGN CONTEXT — Enterprise Dark Theme (Black/Grey)

## Purpose

This project is a **professional DevOps impact-analysis dashboard**.
The UI must resemble internal engineering tools used by senior developers and platform teams.

It should feel similar to:

* GitHub
* Linear
* Datadog
* Vercel
* Stripe Dashboard

The design must look:

* sharp
* minimal
* serious
* data-focused
* enterprise-grade

Avoid playful or colorful UI.

---

# 🎨 COLOR SYSTEM

## Background hierarchy

Use deep black/grey tones only.

```
Primary background:     #0B0F14
Secondary background:   #0F141A
Card background:        #111827
Sidebar background:     #0D1117
Hover background:       rgba(255,255,255,0.04)
Border color:           rgba(255,255,255,0.06)
```

No bright colors for large areas.

Accent colors must be subtle and used only for status or actions.

---

## Accent colors

Use only for meaning.

```
Primary accent:   #4F46E5   (indigo)
Success:          #22C55E
Warning:          #F59E0B
Danger:           #EF4444
Info:             #06B6D4
Muted text:       rgba(255,255,255,0.65)
Faint text:       rgba(255,255,255,0.45)
```

Avoid gradients except for primary CTA button.

---

# 🧱 LAYOUT SYSTEM

## Overall layout

Use a structured SaaS dashboard layout:

* Left sidebar navigation
* Top navbar
* Content grid
* Cards aligned in grid

Max width:

```
1280px
```

Spacing:

```
8px base spacing scale
```

Use Chakra UI layout primitives only:

* Box
* Flex
* Grid
* Stack

Do NOT invent layout components.

---

# 🧾 TYPOGRAPHY

Font family:

```
Inter, system-ui, sans-serif
```

Text rules:

**Page titles**

```
font-size: 20–24px
font-weight: 600
letter-spacing: -0.02em
```

**Card titles**

```
font-size: 13px
font-weight: 500
text-transform: uppercase
opacity: 0.7
```

**Numbers**

```
font-weight: 600
```

**Body**

```
font-size: 13–14px
opacity: 0.85
```

Avoid large playful text.

---

# 🧱 CARD DESIGN

Cards must feel structured and professional.

```
Background: #111827
Border: 1px solid rgba(255,255,255,0.05)
Border radius: 8px
Padding: 16px
Shadow: none or very subtle
```

Hover:

```
background: rgba(255,255,255,0.02)
```

Avoid glassmorphism or heavy blur.

---

# 🧭 SIDEBAR DESIGN

Sidebar should look like engineering tooling.

```
Width: 260px
Background: #0D1117
Border-right: 1px solid rgba(255,255,255,0.06)
```

Active item:

```
background: rgba(79,70,229,0.12)
border-left: 2px solid #4F46E5
```

Icons:

```
16px
opacity: 0.7
```

---

# 🔘 BUTTON STYLING

Primary button:

```
Background: #4F46E5
Hover: #4338CA
Radius: 8px
Font-weight: 500
```

Secondary button:

```
Background: transparent
Border: 1px solid rgba(255,255,255,0.1)
```

Avoid heavy gradients.

---

# 📊 DATA VISUALIZATION

Charts must use muted enterprise palette:

```
Primary: #4F46E5
Secondary: #06B6D4
Success: #22C55E
Warning: #F59E0B
Danger: #EF4444
```

Grid lines:

```
rgba(255,255,255,0.05)
```

---

# 🧪 STATUS BADGES

Use subtle pill badges:

```
border-radius: 6px
font-size: 11px
padding: 2px 6px
font-weight: 500
```

Examples:

* Running → blue
* Passed → green
* Failed → red
* High risk → red
* Medium → yellow
* Low → green

---

# 🧠 INTERACTION DESIGN

Animations must be minimal.

Use:

```
transition: all 0.2s ease
```

Hover lift:

```
translateY(-1px)
```

Avoid flashy animations.

---

# 🧩 COMPONENT RULES

Always use official Chakra UI v3 components.

Allowed:

* Box
* Flex
* Grid
* Card
* Badge
* Progress
* Stat
* Table
* Tabs
* Drawer
* Tooltip

Do NOT invent custom components unless necessary.

---

# 🎯 VISUAL GOAL

The UI should feel like:

> A real internal DevOps platform used by senior engineers reviewing CI/CD pipelines.

Not:

> A student project or colorful marketing site.

---

# 🧠 AI CODING AGENT INSTRUCTIONS

When generating UI:

* Use Chakra UI v3 components only
* Follow enterprise dark theme
* Use black/grey palette
* Keep spacing tight
* Prioritize readability and structure
* Avoid playful styles
* Avoid large gradients
* Avoid bright colors

Always prefer:

```
structured, minimal, professional
```

over:

```
colorful, decorative, playful
```

---

# 🏁 END RESULT

The dashboard must look:

* sharp
* minimal
* serious
* engineering-focused
* production-ready

Like a tool used by DevOps teams in real companies.
