# 📑 PRD — Bait Meareah PWA App

This document defines the requirements for the MVP of the **Bait Meareah** Progressive Web App.

---

## 1. Goal
Build a **PWA app** for teachers to manage *בית מארח* hosting rotations.  
Each student hosts exactly once across the cycle.  
The app must work offline, store data locally, and be deployable to GitHub Pages.  

---

## 2. Users
**Primary:** Teacher (creates class, manages students, generates groups).  
**Secondary (future):** Parents (offline mini-form, JSON import).  

---

## 3. Constraints & Requirements
- Offline-first.  
- No external DB (local only).  
- Cross-platform (desktop + iOS/Android PWAs).  
- Static hosting (GitHub Pages).  
- Privacy: student data never leaves the device unless exported manually.  

---

## 4. Core Features (MVP)

### Class & Student Management
Teachers can create, edit, and delete classes.  
Students are added by pasting a multi-line list of names.  
Each student can have attributes: name, canHost, capacityMin/Max, like[], avoid[].  

### Rounds & Scheduling
Teachers define rounds manually (name, optional date window).  
The app computes groups per round from the class size and target group size.  
Each student must host exactly once across all rounds.  

### Generator
A greedy + retries algorithm assigns hosts and guests.  
Constraints: canHost, capacity, and avoid are treated as hard rules.  
“Like” preferences are treated as soft rules (best effort).  
A simple fairness pass reduces repeated pairings.  

### Review & Adjust
Per-round board displays groups as cards.  
Teachers can manually adjust using Select-and-Move.  
Validation panel separates blocking errors from warnings.  

### Share & Backup
Teachers can generate WhatsApp/clipboard summaries, a printable view, and export/import data as JSON.  

---

## 5. Nice-to-Have (Phase 2)
- Parent offline mini-form with JSON import.  
- CSV import (Google Forms export).  
- Calendar export (.ics).  
- Co-host/sponsor hosting.  
- Dark mode, Hebrew/English toggle.  

---

## 6. Data Model
- **Class:** `{ id, name, year }`  
- **Student:** `{ id, classId, name, canHost, capacityMin, capacityMax, like[], avoid[] }`  
- **Round:** `{ id, classId, name, dateWindow? }`  
- **Group:** `{ id, roundId, hostId, memberIds[], notes? }`  
- **Assignment:** `{ roundId, groups[] }`  
- **Settings:** `{ groupSize }` (default = 6)  

---

## 7. Storage
Uses Dexie.js.  
Version 1 schema: KV-only (`&key`) for simplicity.  
Version 2 (future): structured tables (students, rounds, groups).  
The app requests `navigator.storage.persist()` on first run.  
Data backup and restore is via JSON export/import.  

---

## 8. Tech Stack
- Frontend: React + Vite  
- UI: shadcn/ui (Tailwind)  
- PWA: vite-plugin-pwa  
- Storage: Dexie.js  
- Hosting: GitHub Pages  

---

## 9. User Flows

**Setup Class**  
Teacher creates a new class and pastes student names.  

**Configure**  
Teacher sets group size and number of rounds.  
Teacher can optionally edit capacities and preferences.  

**Generate**  
Algorithm assigns unique hosts and guests according to constraints.  

**Adjust**  
Manual edits are possible via Select-and-Move.  
Validation feedback highlights errors and warnings.  

**Share**  
Teachers can copy to clipboard, print a view, and export JSON.  

---

## 10. UX/UI Notes
- Dashboard shows a list of classes.  
- Class view presents a grid of students with host status.  
- Rounds view displays a board of groups per round.  
- Validation banner shows blocking errors and warnings.  
- Export/import buttons are clearly accessible.  

---

## 11. Risks & Mitigation
- **Too few hosts:** block with a clear message and guide to adjust canHost or round count.  
- **iOS data eviction:** request persistent storage and encourage JSON backups.  
- **Teacher typos/missing names:** provide easy edits and undo/redo.  

---

## 12. Timeline (MVP)
- Week 1: Project scaffold, Dexie KV, class/students CRUD.  
- Week 2: Rounds editor, generator v1.  
- Week 3: Review UI, validation, manual edits.  
- Week 4: Share/export/import, PWA polish, deploy to GitHub Pages.  

---

## 13. Acceptance Criteria
- Installable PWA on iOS/Android/desktop.  
- Teachers can create classes, add students, and define rounds.  
- The generator produces a valid plan where each student hosts once.  
- Manual adjustments are possible with clear validation feedback.  
- JSON export/import works reliably.  
- Deployed app runs on GitHub Pages and works offline.  

---

## 14. Constraints (Locked for MVP)
- Teacher entry only (no parent mini-form).  
- Constraints: capacity + like/avoid only.  
- Manual editing = Select-and-Move (no drag & drop).  
- Hebrew-only, RTL layout.  
- Multiple classes supported.  
- Default group size = 6.  
- Backups = plain JSON only.  
