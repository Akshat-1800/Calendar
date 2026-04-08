# Wall Calendar UI (Frontend Architecture Notes)

This project is a polished calendar experience built with Next.js App Router, React, Tailwind CSS, and date-fns. The goal is to make a digital calendar feel physical and premium: a hanging wall card, seasonal visual changes, responsive day-grid interactions, and smooth note/range workflows.

Instead of documenting only what the app does, this README explains why key frontend decisions were made.

## What This App Does

- Displays a month calendar with a responsive 7-column day grid.
- Lets users pick a date and perform actions from a date popover.
- Supports range workflows:
	- create range
	- preview while selecting
	- inspect range details
	- modify range
	- delete range with confirmation
- Supports note workflows:
	- add notes from the date popover or quick add panel
	- list notes in a side panel
	- delete notes with confirmation
- Applies seasonal theming (summer/monsoon/autumn/winter) across controls, highlights, and hero image.
- Uses subtle motion and toast feedback to keep interactions clear.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- date-fns 4
- react-hot-toast
- animate.css (light utility animations)

## Frontend Goals and Reasoning

### 1. Physical UI Metaphor (Wall Calendar)

Why:
- A realistic metaphor improves affordance. Users immediately understand the product as a monthly planning surface.

How:
- The top pin, hanging string, binding strip, and white card container are intentionally layered in the main page composition.
- The global background is warm and textured to simulate an off-white wall, not a flat app canvas.

Result:
- The interface feels less like a generic dashboard and more like a focused planning object.

### 2. One Source of Truth for Calendar Interaction

Why:
- Range creation, edit mode, popover state, hover preview, and modal visibility are tightly coupled interaction states.
- Splitting these into many components can create hard-to-debug edge cases.

How:
- Calendar interaction state is centralized in the calendar widget component.
- Derived states (preview range, active range, selection mode) are computed with memoized selectors.

Result:
- Easier to maintain complex date interactions without inconsistent UI states.

### 3. Lightweight Utility-First Styling with Theme Tokens

Why:
- Static class names are fast to iterate on, but seasonal adaptation needs dynamic composition.

How:
- A season-theme token map controls primary colors, light backgrounds, rings, text, focus states, and hero image URLs.
- Components receive a resolved theme object and apply classes through a tiny class-composition helper.

Result:
- The design system remains simple, while still allowing visual variability by month.

### 4. Full-Cell Range Highlighting for Clarity

Why:
- Text-only highlights are easy to miss and hurt scannability in dense calendar grids.

How:
- Entire day-cell containers are colored for preview/middle/edge states.
- Text style remains visible and theme-aware while ranges exist.
- When a range is removed, the styling falls back automatically to default cell styles.

Result:
- Better visual continuity for ranges and stronger interaction confidence.

### 5. Mobile-First Spacing Decisions

Why:
- 7-column layouts can quickly break on narrow screens when cell dimensions are fixed.

How:
- Cells are fluid with aspect-ratio constraints and responsive max widths.
- Grid gaps and container paddings reduce on smaller screens.
- Desktop scale is preserved at larger breakpoints.

Result:
- No overlap/clustering on small devices while keeping strong desktop readability.

### 6. Portals + Client Mount Guards for Modal Safety

Why:
- Modal and popover overlays belong at the document root for layering and event handling.
- App Router hydration can mismatch if portal rendering happens before client mount.

How:
- Modals/popovers render with createPortal.
- Components that need document access use client-side mount guards before rendering.

Result:
- Stable hydration behavior and predictable overlay z-index behavior.

### 7. Immediate Feedback Through Toasts

Why:
- Range/note actions are quick operations that benefit from non-blocking confirmation.

How:
- React Hot Toast is configured once in root layout with mobile-aware positioning.
- Success messages are used for create/delete actions.

Result:
- Better feedback without interrupting workflow.

## High-Level Architecture

### App entry

- app/page.js: simple route entry that renders the calendar page shell.
- app/layout.js: global layout, font setup, and toast provider.
- app/globals.css: wall background texture, global typography, and shared keyframes.

### Calendar shell

- components/calendar/CalendarPage.js:
	- wall-card composition (pin/string/binding/card)
	- season-aware hero month sync via shared month index

### Feature orchestration

- components/calendar/BottomSection.js:
	- owns note list state
	- wires note add/delete handlers
	- coordinates selected date from calendar to notes panel

- components/calendar/CalendarWidget.js:
	- owns date selection state and all range interaction state
	- computes day grid data and range preview logic
	- controls popover + modals + action flows

### Presentation components

- components/calendar/CalendarHeader.js: month navigation, month dropdown, static year display.
- components/calendar/CalendarGrid.js: weekday row + day cells.
- components/calendar/CalendarDayCell.js: visual day states (today, selected, note marker, range preview/middle/edge).
- components/calendar/NotesPanel.js: quick add, list, and note deletion flow.

### Overlay and form components

- components/calendar/DateActionPopover.js
- components/calendar/RangeCreateModal.js
- components/calendar/RangeDetailsModal.js
- components/calendar/RangeDeleteConfirmModal.js
- components/calendar/NoteModal.js
- components/calendar/NoteDeleteConfirmModal.js

### Utilities

- utils/date.js:
	- month/day generation
	- date normalization helpers
	- month option constants
- utils/seasonTheme.js:
	- month-to-season mapping
	- shared visual token definitions
- utils/cn.js:
	- lightweight conditional class joining

## UX and Accessibility Notes

- Keyboard escape support is implemented for overlays.
- Click-outside handling closes popover/modal layers.
- Focus-visible ring states are preserved for day cells and form inputs.
- Hover effects are additive and do not control core visibility logic (for example, range visibility).

## Performance and Maintainability Notes

- Derived values are memoized where useful (grid generation, selected labels, preview computations).
- UI state is colocated with the interaction domain that owns it.
- Theme tokens prevent duplicated hard-coded color strings across many components.

## Current Trade-Offs

- Data persistence is not included yet:
	- notes and ranges live in memory and reset on refresh.
- No backend/API is required for this version.
- Hero image currently uses img rather than next/image (lint warns about this).

## Run Locally

### Prerequisites

- Node.js 18.18+ (or newer LTS)
- npm 9+

### Install

```bash
npm install
```

### Start development server

```bash
npm run dev
```

Open http://localhost:3000

### Build for production

```bash
npm run build
```

### Start production server

```bash
npm run start
```

### Lint

```bash
npm run lint
```

## Suggested Next Steps

- Persist notes and ranges to localStorage or an API.
- Replace hero img with next/image for image optimization.
- Add unit tests for date/range helpers and interaction states.
- Add end-to-end tests for create/modify/delete range and note flows.
