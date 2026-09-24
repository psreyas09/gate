# GATE CSE 2027 Study Platform (Target: 35+/100 Qualifying Score)

An interactive, distraction-free web application specifically engineered for efficient, high-yield preparation for the GATE CSE 2027 examination.

Built around a **qualifying-score strategy (35+/100)** rather than exhaustive theory, prioritizing Tier 1 subjects (Aptitude, Engg Math, Digital Logic, DBMS, C & Data Structures) and Tier 2 fundamentals, while explicitly skipping low-yield rabbit holes.

---

## Key Features

1. **Non-Negotiable Local Persistence:**
   - Saved directly to an on-disk SQLite database: `data/gate_study.db`.
   - Every completed lesson, quick-check attempt, SM-2 flashcard rating, practice problem, and timed mock test persists across browser restarts and device reboots.
   - Dual-layer backup: One-click export/import of timestamped JSON backups and direct `.db` file downloads.

2. **Curriculum Structured by Tiers & Authoritative References:**
   - **Tier 1 (Full Depth - 1.0 weight):** General Aptitude (R.S. Aggarwal/Wren & Martin), Engineering Math (Kenneth Rosen/B.S. Grewal), Digital Logic (M. Morris Mano), DBMS (Silberschatz & Korth), Programming & Data Structures (Karumanchi).
   - **Tier 2 (Fundamentals Only - 0.6 weight):** Operating Systems (Silberschatz & Galvin), Computer Networks (Kurose & Ross), Computer Organization & Architecture (Morris Mano).
   - **Tier 3 (Light Touch - 0.3 weight):** Theory of Computation (FA & regular expressions), Algorithms (standard sorting & greedy), Compiler Design (overview of phases).

3. **Retrieval Practice Over Passive Reading (Lesson Mode):**
   - Bite-sized concept pages with KaTeX math rendering ($O(n \log n)$, $\det(A)$, Bayes theorem).
   - Mandatory **3–5 retrieval quick-checks** per lesson that must be passed before a lesson is marked completed.
   - Immediate explanations with step-by-step reasoning for each option.

4. **SuperMemo SM-2 Spaced Repetition Engine:**
   - Schedules flashcards and previously missed practice questions for retention.
   - 4-tier confidence rating: **Again (1)**, **Hard (2)**, **Good (3)**, and **Easy (4)**.
   - Dynamically calculates Ease Factor (EF) and intervals ($I_1 = 1$, $I_2 = 6$, $I_n = I_{n-1} \times \text{EF}$).

5. **Practice & Previous Year Questions (PYQs):**
   - Real GATE question types: **MCQ** (Multiple Choice), **MSQ** (Multiple Select), and **NAT** (Numerical Answer Type).
   - Tagged by subject, topic, difficulty, and GATE year.
   - **Interleaving Mode** to randomize and interleave questions across subjects for higher cognitive transfer.
   - **One-Click Weak-Area Drill** targeting topics with &lt;60% accuracy.

6. **Timed Mock Test Simulation with Genuine Negative Marking:**
   - Timed countdown timer with question palette (Answered, Marked for Review, Unattempted).
   - Authentic GATE negative marking: **-1/3** for 1-mark MCQs, **-2/3** for 2-mark MCQs, **0 penalty** on MSQ and NAT questions.
   - Immediate breakdown comparing final score against the **35/100 qualifying benchmark**.

7. **College Life & Semester Exam Calendar Planner:**
   - Set target exam date and qualifying cutoff.
   - Toggle between **Full Study Mode** (new lessons + practice + reviews) and **Light Mode** (reviews only during end-semester exams to maintain consistency streaks).

---

## Getting Started

### 1. Run Server & Application

To launch both the Node/Express backend and Vite frontend with hot module reload:
```bash
npm run dev
```

Or run the server standalone (which automatically serves the compiled production build from `client/dist` on port 3001):
```bash
npm run server
```
Then open: **http://localhost:3001** (or **http://localhost:5173** in dev mode) in your browser.

### 2. Project Layout

```text
gate_study/
├── data/
│   ├── gate_study.db        # Primary on-disk SQLite database (persists all progress)
│   └── backups/             # Local automatic snapshots
├── server/
│   ├── db.js                # SQLite connection, schema & foreign keys
│   ├── seed.js              # Curriculum hierarchy, lessons, questions & citations
│   ├── sm2.js               # SuperMemo SM-2 spaced repetition calculation engine
│   ├── backup.js            # JSON & SQLite backup/export/restore engine
│   └── index.js             # Express REST API & static server
├── client/
│   ├── src/
│   │   ├── components/      # UI Views (Dashboard, Lessons, SpacedRep, Practice, Mock, Calendar)
│   │   ├── types.ts         # TypeScript data definitions
│   │   ├── App.tsx          # Root container & navigation
│   │   └── index.css        # Tailwind CSS theme
│   └── vite.config.ts       # Vite configuration with API proxy
└── package.json
```
