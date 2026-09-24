# GATE CSE 2027 Platform — Project Handover & Progress Documentation (`agent.md`)

**Target:** Qualifying score (35+/100) on GATE CSE 2027  
**Design Philosophy:** High-yield studying, retrieval practice, spaced repetition, zero cognitive clutter  
**Repository:** [https://github.com/psreyas09/gate](https://github.com/psreyas09/gate) (`main` branch)  
**Live Production URL:** [https://gatestudy.vercel.app](https://gatestudy.vercel.app)  

---

## 1. System Architecture & Tech Stack

- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS + Lucide Icons + KaTeX (math rendering) + custom Markdown LaTeX pipeline ([`MathText.tsx`](file:///home/sreyas/projects/gate_study/client/src/components/MathText.tsx)).
- **Backend (Local):** Node.js 22 + Express 5 with built-in SQLite (`node:sqlite` in WAL mode).
- **Dual Persistence Strategy (Non-Negotiable Core Requirement):**
  - **Local Node Server:** Persists to SQLite database at [`data/gate_study.db`](file:///home/sreyas/projects/gate_study/data/gate_study.db).
  - **Vercel / Cloud CDN:** Zero serverless data loss. Handled via [`apiInterceptor.ts`](file:///home/sreyas/projects/gate_study/client/src/services/apiInterceptor.ts) and [`localApi.ts`](file:///home/sreyas/projects/gate_study/client/src/services/localApi.ts) which persist all progress, mock sessions, question attempts, SM-2 flashcard intervals, and calendar settings directly to browser local storage.
  - **Backup / Snapshot:** Complete JSON export & atomic database import in both modes via [`BackupModal.tsx`](file:///home/sreyas/projects/gate_study/client/src/components/BackupModal.tsx).

---

## 2. Completed Milestones

### A. Curriculum Scope & Priority Weighting
- **Tier 1 (Full Depth — 70% study priority):**
  - General Aptitude (Verbal, Quant, Analytical, Data Interpretation)
  - Engineering Mathematics (Discrete Math, Linear Algebra, Calculus, Probability & Statistics)
  - Digital Logic (Number systems, Boolean Algebra, K-maps, Combinational & Sequential circuits)
  - DBMS (ER models, Relational model, Normalization 1NF–BCNF, SQL, Transactions/ACID)
  - Programming & Data Structures (C fundamentals, Linked lists, Stacks, Queues, Trees, Hashing, Complexity)
- **Tier 2 (Fundamentals Only — 25% study priority):**
  - Operating Systems (Scheduling, Paging/Memory, Synchronization, Deadlocks)
  - Computer Networks (OSI/TCP-IP, Subnetting, Routing, Protocols)
  - Computer Organization & Architecture (Data representation, Instruction cycle, Cache hierarchy, Pipelining)
- **Tier 3 (Light-Touch Only — 5% study priority):**
  - Theory of Computation (DFA/NFA, Regular Expressions, Regular Languages)
  - Algorithms Beyond Basics (Sorting, Searching, Greedy)
  - Compiler Design (Phases of Compilation overview)

### B. Standard Textbook Citations
Every lesson explicitly cites standard reference textbooks:
- *Data Structures and Algorithms Made Easy* (Narasimha Karumanchi)
- *Database System Concepts* (Silberschatz, Korth, Sudarshan)
- *Operating System Concepts* (Silberschatz, Galvin, Gagne)
- *Computer Networking: A Top-Down Approach* (Kurose, Ross)
- *Digital Logic and Computer Design* & *Computer System Architecture* (M. Morris Mano)
- *Discrete Mathematics and Its Applications* (Kenneth Rosen)
- *Higher Engineering Mathematics* (B.S. Grewal)
- *Quantitative Aptitude* (R.S. Aggarwal)

### C. Core Features Live
1. **Lesson Mode:** 39 bite-sized lessons across all 11 subjects. Mandatory 3-question quick checks require passing before marking a lesson as completed.
2. **Practice & PYQ Bank:** 126+ curated questions (MCQ, MSQ, NAT) with immediate step-by-step explanations, tag filtering, and optional Interleaving mode.
3. **Spaced Repetition Engine (SM-2):** SuperMemo SM-2 algorithm scheduling reviews based on confidence ratings (*Again, Hard, Good, Easy*).
4. **Timed Mock Exam:** Real GATE scoring simulated (+1, +2 for correct; -0.33, -0.67 penalty on MCQs; 0 penalty on MSQ/NAT) evaluated against the 35/100 qualifying benchmark.
5. **Study Calendar:** Light Mode (busy periods: reviews only) vs. Full Mode (new lessons + practice + reviews).
6. **Resources Hub:** Curated external resources (NPTEL portal, Physics Wallah notes, GFG LMNs, Ankit Doyla playlists, Google Drive notes, Telegram groups).
7. **Automated Test Suite:** 49/49 automated unit and API checks passing ([`test_suite.js`](file:///home/sreyas/projects/gate_study/test_suite.js)).

---

## 3. Key Files Reference

```
gate_study/
├── agent.md                        # This handover document
├── package.json                    # Root package scripts (server, client, dev, build, test)
├── vercel.json                     # Vercel monorepo install & build config
├── test_suite.js                   # 49-check automated regression test suite
├── server/
│   ├── db.js                       # SQLite initialization & schema definitions
│   ├── seed.js                     # Base syllabus and PYQ seed script
│   ├── seed_all_lessons.js         # Full 39-topic lesson content and quick checks
│   ├── sm2.js                      # SuperMemo SM-2 algorithm logic
│   ├── backup.js                   # JSON snapshot export/import & binary backup
│   └── index.js                    # Express API routes
├── data/
│   ├── gate_study.db               # SQLite database file (WAL mode)
│   └── backups/                    # Local JSON snapshots directory
└── client/
    ├── src/
    │   ├── App.tsx                 # Main application view container
    │   ├── types.ts                # TypeScript domain models (OverviewData, Subject, Lesson, etc.)
    │   ├── data/
    │   │   └── curriculumSeed.json # Pre-bundled static syllabus data (198 KB)
    │   ├── services/
    │   │   ├── localApi.ts         # In-browser API & storage persistence engine
    │   │   └── apiInterceptor.ts   # Network/fallback fetch interceptor
    │   └── components/
    │       ├── Navbar.tsx          # Navigation bar with Light/Full mode badge & Backup modal
    │       ├── DashboardView.tsx   # Progress summary, readiness score, weak topics
    │       ├── LessonsView.tsx     # Lesson reading & quick checks modal
    │       ├── PracticeView.tsx    # Question bank, filter controls, answer submission
    │       ├── SpacedRepetitionView.tsx # Flashcard review with SM-2 rating
    │       ├── MockTestView.tsx    # Timed mock test runner and scoring breakdown
    │       ├── CalendarView.tsx    # Exam countdown and busy period scheduler
    │       ├── ResourcesView.tsx   # Searchable gate study resources directory
    │       ├── MathText.tsx        # LaTeX ($...$, $$...$$) and Markdown renderer
    │       └── BackupModal.tsx     # Export and import JSON backup modal
```

---

## 4. Planned Items for Next Session

1. **PYQ Bank Expansion:**
   - Add 50+ additional Previous Year Questions from GATE 2018–2024 with detailed step-by-step solutions.
2. **Keyboard Shortcuts:**
   - Support `Space` to flip flashcards and numbers `1, 2, 3, 4` for SM-2 ratings (`Again`, `Hard`, `Good`, `Easy`).
3. **Visual Analytics / Progress Charts:**
   - Add charts visualizing subject-wise accuracy and historical mock test score trends.
4. **PWA Offline Support:**
   - Configure a Vite PWA plugin with service worker caching so the entire web app works completely offline on mobile devices.

---

## 5. Developer Quick-Start Commands

```bash
# 1. Run local development (API server on :3001, Vite dev server on :5173)
npm run dev

# 2. Run backend API only
npm run server

# 3. Run automated regression test suite (49 tests)
npm test

# 4. Build client bundle for production
npm run build

# 5. Push updates to GitHub
git add .
git commit -m "feat: your change description"
git push origin main

# 6. Deploy updates to Vercel production
vercel --prod --yes
```
