import React, { useState } from 'react';
import {
  ExternalLink,
  BookOpen,
  Video,
  FileText,
  Users,
  Search,
  Sparkles,
  Bookmark,
  GraduationCap,
  Code
} from 'lucide-react';

interface ResourceItem {
  title: string;
  category: 'videos' | 'notes' | 'cheatsheets' | 'books' | 'community' | 'pw_handbooks' | 'other_branches';
  url: string;
  source: string;
  description: string;
  badge?: string;
  isHighYield?: boolean;
  tier?: 1 | 2 | 3;
}

const curatedResources: ResourceItem[] = [
  // 0. Official PhysicsWallah Subject-Wise Handbooks (Direct PDFs)
  {
    title: 'Operating Systems GATE-O-PEDIA Handbook (PW)',
    category: 'pw_handbooks',
    url: 'https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS_BLOGS/2fd06899-b7f2-44c7-b859-e608cf490de4.pdf',
    source: 'PhysicsWallah',
    description: '44-page comprehensive handbook covering Process Scheduling, Peterson Algorithm, Semaphores, Deadlock Avoidance, Multi-level Paging, Virtual Memory, and Disk Scheduling.',
    badge: 'PW Handbook PDF',
    isHighYield: true,
    tier: 2
  },
  {
    title: 'Computer Networks GATE-O-PEDIA Handbook (PW)',
    category: 'pw_handbooks',
    url: 'https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS_BLOGS/a483295c-2895-4375-bfa7-21b750de1c8b.pdf',
    source: 'PhysicsWallah',
    description: 'Complete handbook covering OSI vs TCP/IP models, Flow & Error Control (Stop-and-Wait, GBN, SR), IPv4/IPv6 Subnetting, Routing Algorithms, TCP Congestion Control, and Application Protocols.',
    badge: 'PW Handbook PDF',
    isHighYield: true,
    tier: 2
  },
  {
    title: 'Database Management Systems (DBMS) Handbook (PW)',
    category: 'pw_handbooks',
    url: 'https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS_BLOGS/1c29fc66-868a-4f54-be30-df0a813790b9.pdf',
    source: 'PhysicsWallah',
    description: 'In-depth notes on Relational Algebra, Tuple Relational Calculus, SQL Queries, Normalization (1NF to BCNF), Conflict Serializability, and B/B+ Tree Indexing calculations.',
    badge: 'PW Handbook PDF',
    isHighYield: true,
    tier: 1
  },
  {
    title: 'Computer Organization & Architecture (COA) Handbook (PW)',
    category: 'pw_handbooks',
    url: 'https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS_BLOGS/8d2a418c-7299-40d9-bb15-9ea32e768a88.pdf',
    source: 'PhysicsWallah',
    description: 'Complete formulas for Instruction Pipelining & Stalls, Cache Memory Mapping (Direct, Set-Associative, Fully Associative), Cache Replacement, Memory Interleaving, and IEEE 754 Floating Point.',
    badge: 'PW Handbook PDF',
    isHighYield: true,
    tier: 2
  },
  {
    title: 'Programming & Data Structures Handbook (PW)',
    category: 'pw_handbooks',
    url: 'https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS_BLOGS/44297ff4-cbe0-4fc4-87e1-948f9daeb5b6.pdf',
    source: 'PhysicsWallah',
    description: 'Detailed coverage of C Pointers, Recursion, Memory Allocation, Arrays, Stacks, Queues, Linked Lists, Trees (BST, AVL Tree Rotations, Heaps), and Hash Tables with collision resolution.',
    badge: 'PW Handbook PDF',
    isHighYield: true,
    tier: 1
  },
  {
    title: 'Algorithms GATE-O-PEDIA Handbook (PW)',
    category: 'pw_handbooks',
    url: 'https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS_BLOGS/acc041c0-74ff-4608-9ef9-ab759d0953f2.pdf',
    source: 'PhysicsWallah',
    description: 'Master Theorem recurrence cases, Sorting algorithms comparison, Divide-and-Conquer, Greedy techniques (Huffman, MST), Dynamic Programming (LCS, Matrix Chain, 0/1 Knapsack), and Graph Traversals.',
    badge: 'PW Handbook PDF',
    isHighYield: true,
    tier: 3
  },
  {
    title: 'Theory of Computation (TOC) Handbook (PW)',
    category: 'pw_handbooks',
    url: 'https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS_BLOGS/e71de686-d85c-4910-a7c8-f5623dfb17d1.pdf',
    source: 'PhysicsWallah',
    description: 'Regular Languages, DFA/NFA Construction, Myhill-Nerode, Context-Free Grammars, Pushdown Automata, Turing Machine variants, Decidability, and Closure Properties Table.',
    badge: 'PW Handbook PDF',
    isHighYield: true,
    tier: 3
  },
  {
    title: 'Compiler Design Handbook (PW)',
    category: 'pw_handbooks',
    url: 'https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS_BLOGS/e751d87f-9074-4f6b-83a2-e97c4e168117.pdf',
    source: 'PhysicsWallah',
    description: 'Lexical Analysis, Top-Down Parsing (LL(1) FIRST and FOLLOW sets), Bottom-Up Parsing (LR(0), SLR(1), CLR(1), LALR(1)), Syntax-Directed Translation, and Code Optimization techniques.',
    badge: 'PW Handbook PDF',
    tier: 3
  },
  {
    title: 'Digital Logic Handbook (PW)',
    category: 'pw_handbooks',
    url: 'https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS_BLOGS/92030e28-da6b-4f49-8920-ec1ed0b61684.pdf',
    source: 'PhysicsWallah',
    description: 'Boolean Algebra Minimization, K-Maps, Multiplexers/Decoders, Adders/Subtractors, Flip-Flops (SR, JK, D, T), Synchronous & Asynchronous Counters, and Finite State Machines.',
    badge: 'PW Handbook PDF',
    isHighYield: true,
    tier: 1
  },
  {
    title: 'Engineering Mathematics Handbook (PW)',
    category: 'pw_handbooks',
    url: 'https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS_BLOGS/7290303c-b37a-40c7-b486-a298ffe6aa60.pdf',
    source: 'PhysicsWallah',
    description: 'Linear Algebra (Matrices, Rank, Eigenvalues/Eigenvectors), Calculus (Limits, Continuity, Maxima/Minima), Vector Calculus, Differential Equations, and Probability Distributions.',
    badge: 'PW Handbook PDF',
    isHighYield: true,
    tier: 1
  },
  {
    title: 'Discrete Mathematics Handbook (PW)',
    category: 'pw_handbooks',
    url: 'https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS_BLOGS/30aa7d74-582f-4314-ad40-c211dd49d268.pdf',
    source: 'PhysicsWallah',
    description: 'Propositional & First-Order Logic, Set Theory, Relations & Equivalence Classes, Partial Orders & Lattices, Combinatorics (Pigeonhole, Permutations), and Graph Theory properties.',
    badge: 'PW Handbook PDF',
    isHighYield: true,
    tier: 1
  },
  {
    title: 'General Aptitude Handbook (PW)',
    category: 'pw_handbooks',
    url: 'https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS_BLOGS/fcb3fb4a-2ae6-4a7d-8b2f-280497391bb1.pdf',
    source: 'PhysicsWallah',
    description: 'Quantitative Aptitude, Numerical Computation, Analytical Reasoning, Spatial Aptitude, and English Grammar shortcuts for guaranteed 15 marks.',
    badge: 'PW Handbook PDF',
    isHighYield: true,
    tier: 1
  },

  // 1. Official Video Lectures
  {
    title: 'NPTEL Official GATE Video Portal (CSE & IT)',
    category: 'videos',
    url: 'https://gate.nptel.ac.in/video.php?branchID=2&cid=1',
    source: 'NPTEL / IIT Professors',
    description: 'Official, authoritative subject-wise video lectures recorded by IIT professors specifically for GATE CSE. Free and strictly syllabus-aligned.',
    badge: 'Official IIT',
    isHighYield: true
  },
  {
    title: 'Computer Networks Complete GATE Playlist',
    category: 'videos',
    url: 'https://www.youtube.com/playlist?list=PLOG_8OlGMp73hMyn-WX1M2Q4ON98DmaRq',
    source: 'Ankit Doyla Sir (Unacademy)',
    description: 'In-depth conceptual lectures covering OSI/TCP-IP, Subnetting, Flow Control, and Application layer protocols.',
    badge: 'YouTube High-Yield',
    isHighYield: true
  },
  {
    title: 'Theory of Computation (TOC) GATE Playlist',
    category: 'videos',
    url: 'https://www.youtube.com/playlist?list=PLOG_8OlGMp72SAVxAk3VwEKQNbLkpN4Vs',
    source: 'Ankit Doyla Sir (Unacademy)',
    description: 'Crystal-clear walk-through of Finite Automata, DFA minimization, and regular expression shortcuts.',
    badge: 'YouTube Playlist'
  },

  // 2. Structured Notes
  {
    title: 'PhysicsWallah (PW) Free GATE CSE Notes',
    category: 'notes',
    url: 'https://www.pw.live/exams/gate/gate-cse-notes/',
    source: 'PhysicsWallah',
    description: 'Well-structured, comprehensive topic notes and downloadable PDF study material covering all key GATE CSE subjects.',
    badge: 'Top Free Notes',
    isHighYield: true
  },
  {
    title: 'GATE CSE Resource Hub (gatecse.in)',
    category: 'notes',
    url: 'https://gatecse.in/gate-cse-resources/',
    source: 'GateCSE.in',
    description: 'A legendary central repository of GATE CSE standard PDFs, syllabus breakdowns, and previous year answer explanations.',
    badge: 'Community Classic',
    isHighYield: true
  },
  {
    title: 'GATE & CSE Resources Repository',
    category: 'notes',
    url: 'https://github.com/baquer/GATE-and-CSE-Resources-for-Students',
    source: 'GitHub Open Source',
    description: 'A curated GitHub repository containing organized study materials, handwritten toppers notes, and subject folders.',
    badge: 'GitHub Repo'
  },
  {
    title: 'GATE CSE 2027 Resource Hub & PYQs',
    category: 'notes',
    url: 'https://gist.github.com/Alimammiya/0768324e8d07c17a69c787d7782593d9',
    source: 'GitHub Gist',
    description: 'Free study material, subject-wise notes, previous year questions (PYQs), and curated resources targeted for GATE CSE 2027.',
    badge: 'Target 2027'
  },
  {
    title: 'Edurev GATE CSE Crash Course & Question Bank',
    category: 'notes',
    url: 'https://edurev.in/courses/73145_Crash-Course-for-GATE-CSE',
    source: 'EduRev',
    description: 'Concise subject-wise summaries, high-yield crash course notes, and practice question sets for CSE & IT.',
    badge: 'Crash Course'
  },
  {
    title: 'Curated Notes & Past Papers (Google Drive)',
    category: 'notes',
    url: 'https://drive.google.com/drive/folders/1_Y5ifg_kljqmOyIJqBwe5y0MkEX8tOi7',
    source: 'Community Reddit Drive',
    description: 'Collection of handwritten notes, coaching materials, and past question papers shared by qualified students.',
    badge: 'Drive Folder'
  },
  {
    title: 'GATE CSE Exam Guide & Syllabus (CollegeVerse)',
    category: 'notes',
    url: 'https://collegeverse.co.in/gate-exam/',
    source: 'CollegeVerse',
    description: 'Detailed overview of the exam pattern, subject-wise marking scheme, and eligibility criteria.',
    badge: 'Exam Guide'
  },
  {
    title: 'MadeEasy GATE Subject Codes & Detailed Overview',
    category: 'notes',
    url: 'https://www.madeeasy.in/gate',
    source: 'MadeEasy',
    description: 'Official syllabus breakdown, subject marks weightage analysis, and eligibility insights.',
    badge: 'MadeEasy Guide'
  },
  {
    title: 'GATE Past Papers & Official Answer Keys (BYJU’S)',
    category: 'notes',
    url: 'https://byjus.com/gate/gate-exam/',
    source: 'BYJU’S Exam Prep',
    description: 'Comprehensive repository of previous years GATE question papers with detailed answer explanations.',
    badge: 'PYQ Papers'
  },

  // 3. Formula Sheets & Last Minute Notes
  {
    title: 'GeeksforGeeks Last Minute Notes (LMNs)',
    category: 'cheatsheets',
    url: 'https://www.geeksforgeeks.org/last-minute-notes-lmns/',
    source: 'GeeksforGeeks',
    description: 'Essential formula sheets, algorithmic complexities, and quick revision bullet points for rapid pre-exam recall across CSE subjects.',
    badge: 'Formula Sheets',
    isHighYield: true
  },
  {
    title: 'GATE Study Plan & Subject-Wise Strategy (SlideShare)',
    category: 'cheatsheets',
    url: 'https://www.slideshare.net/slideshow/gate-preparation-strategy/134718443',
    source: 'SlideShare',
    description: 'A presentation covering subject-wise timelines, revision strategies, and time management tips for GATE.',
    badge: 'Study Plan'
  },
  {
    title: 'GATE Exam & Placement Guide Mobile App',
    category: 'cheatsheets',
    url: 'https://play.google.com/store/apps/details?id=com.dps.b_t',
    source: 'Google Play Store',
    description: 'Free mobile reference app containing handwritten formula sheets, PDFs, and quick revision cards for on-the-go review.',
    badge: 'Mobile App'
  },

  // 4. Programming Books & Repositories
  {
    title: 'GoalKicker Free Programming Tech Books',
    category: 'books',
    url: 'https://goalkicker.com/',
    source: 'GoalKicker',
    description: 'Free, high-quality reference books compiled from Stack Overflow documentation for C, Algorithms, and Data Structures.',
    badge: 'Free Books'
  },
  {
    title: 'Madhurima Rawat Semester & Code Notes',
    category: 'books',
    url: 'https://github.com/madhurimarawat/Semester-Notes',
    source: 'GitHub',
    description: 'Comprehensive college semester notes, implemented code examples, and CS topic summaries from the source gist.',
    badge: 'Code & Notes'
  },
  {
    title: 'GATE Data Science & AI Open Repository (dsai-gate)',
    category: 'books',
    url: 'https://github.com/madhurimarawat/dsai-gate',
    source: 'GitHub (Madhurima Rawat)',
    description: 'Structured open-source collection of GATE Data Science & AI study materials, lecture slides, and notes.',
    badge: 'DA & AI Repo'
  },
  {
    title: 'GFG 100-Day GATE Data Science & AI Plan',
    category: 'books',
    url: 'https://www.geeksforgeeks.org/100-days-of-gate-data-science-ai/',
    source: 'GeeksforGeeks',
    description: 'A 100-day structured syllabus schedule for Machine Learning, Linear Algebra, and Data Science GATE preparation.',
    badge: '100-Day Plan'
  },

  // 5. Discussion Communities
  {
    title: 'CSE GATE Notes Telegram Discussion Group',
    category: 'community',
    url: 'https://t.me/cse_gatenotes',
    source: 'Telegram',
    description: 'Active discussion community for GATE CSE aspirants to discuss tricky questions, share notes, and clear exam doubts.',
    badge: 'Active Group'
  },
  {
    title: 'GATE Data Science & AI Community',
    category: 'community',
    url: 'https://t.me/+VUcQzNznBcg3NWI1',
    source: 'Telegram',
    description: 'Discussion channel dedicated to the new GATE DA paper, covering Probability, Linear Algebra, Machine Learning, and Python.',
    badge: 'DA & AI'
  },

  // 6. Other Engineering Branches (From Gist)
  {
    title: 'GATE Electronics & Communication (ECE) Study Materials',
    category: 'other_branches',
    url: 'https://gist.github.com/Alimammiya/c4c99eaa8d72f6e28089fd53274d0feb',
    source: 'GitHub Gist',
    description: 'Curated free study materials, subject notes, and PYQs for GATE Electronics and Communication Engineering.',
    badge: 'GATE ECE'
  },
  {
    title: 'GATE Mechanical Engineering (ME) Study Materials',
    category: 'other_branches',
    url: 'https://gist.github.com/Alimammiya/fad6aa7b39f101c0ddf80402d411ed90',
    source: 'GitHub Gist',
    description: 'Subject-wise notes, reference books, and past exam questions for GATE Mechanical Engineering.',
    badge: 'GATE ME'
  },
  {
    title: 'GATE Electrical Engineering (EE) Study Materials',
    category: 'other_branches',
    url: 'https://gist.github.com/Alimammiya/a9da7424c5dc98d2715c09b03486d092',
    source: 'GitHub Gist',
    description: 'Comprehensive study materials, circuit theory formulas, and PYQs for GATE Electrical Engineering.',
    badge: 'GATE EE'
  },
  {
    title: 'GATE Civil Engineering Study Materials',
    category: 'other_branches',
    url: 'https://gist.github.com/Alimammiya/b73fca42a2cb4b446f64d3868934d968',
    source: 'GitHub Gist',
    description: 'Free study material, structural analysis notes, and solved past papers for GATE Civil Engineering.',
    badge: 'GATE Civil'
  }
];

export const ResourcesView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'physics_wallah' | 'curated'>('physics_wallah');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [pwTier, setPwTier] = useState<'all' | 1 | 2 | 3>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const pwHandbooks = curatedResources.filter(item => item.category === 'pw_handbooks');
  const otherResources = curatedResources.filter(item => item.category !== 'pw_handbooks');

  const filteredPwHandbooks = pwHandbooks.filter(item => {
    const matchesTier = pwTier === 'all' || item.tier === pwTier;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTier && matchesSearch;
  });

  const filteredOtherResources = otherResources.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-4 sm:space-y-6 max-w-6xl mx-auto">
      {/* Top Primary Section Switcher */}
      <div className="flex flex-col sm:flex-row p-1.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg gap-1.5">
        <button
          onClick={() => {
            setActiveSection('physics_wallah');
            setSearchQuery('');
          }}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 touch-manipulation ${
            activeSection === 'physics_wallah'
              ? 'bg-gradient-to-r from-amber-500/25 via-orange-500/25 to-amber-500/25 text-amber-300 border border-amber-500/50 shadow-md ring-1 ring-amber-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Physics Wallah (PW) Official Hub</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/30 text-amber-200 font-extrabold uppercase tracking-wide border border-amber-500/40">
            12 Handbooks
          </span>
        </button>

        <button
          onClick={() => {
            setActiveSection('curated');
            setSearchQuery('');
          }}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 touch-manipulation ${
            activeSection === 'curated'
              ? 'bg-gradient-to-r from-cyan-500/25 to-indigo-500/25 text-cyan-300 border border-cyan-500/50 shadow-md ring-1 ring-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Bookmark className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Curated Community Resources</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30">
            NPTEL · GfG · Books
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: DEDICATED PHYSICS WALLAH (PW) HUB                             */}
      {/* ========================================================================= */}
      {activeSection === 'physics_wallah' && (
        <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-150">
          {/* Branded Physics Wallah Header */}
          <div className="p-5 sm:p-8 rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-orange-950/50 border border-amber-500/40 shadow-xl space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
                <GraduationCap className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Physics Wallah (PW) Official Study Materials</span>
              </div>
              <span className="text-xs text-amber-400/90 font-medium">12 Complete Subject Handbooks Available</span>
            </div>

            <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
              Official Physics Wallah GATE-O-PEDIA Handbooks
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              Instant 1-click access to the official Physics Wallah subject handbooks, formula compendiums, and comprehensive revision PDFs. Verified and sourced directly from Physics Wallah&apos;s official GATE CSE notes portal.
            </p>

            {/* Direct Official Portals & Free Video Lectures */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <a
                href="https://www.pw.live/exams/gate/gate-cse-notes/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-950/40"
              >
                <span>Visit PW Official Notes Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://www.youtube.com/@GATEWallah"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600/30 hover:bg-rose-600 border border-rose-500/40 text-rose-200 hover:text-white text-xs font-bold transition-all shadow-md"
              >
                <Video className="w-3.5 h-3.5 text-rose-300" />
                <span>GATE Wallah Official YouTube Channel</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* PW Tier Filter & Search Bar */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 shadow-sm">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar -mx-1 px-1">
              {[
                { id: 'all', label: 'All 12 Handbooks' },
                { id: 1, label: 'Tier 1: High Yield (6)' },
                { id: 2, label: 'Tier 2: Core Systems (3)' },
                { id: 3, label: 'Tier 3: Advanced (3)' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setPwTier(t.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all touch-manipulation min-h-[36px] ${
                    pwTier === t.id
                      ? 'bg-amber-500/25 text-amber-300 border border-amber-500/45 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Search Input within PW */}
            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search PW handbooks & topics..."
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-amber-400 min-h-[38px]"
              />
            </div>
          </div>

          {/* 12 PW Handbooks Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPwHandbooks.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 hover:border-amber-500/50 transition-all flex flex-col justify-between shadow-lg group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-amber-400" />
                      Physics Wallah (PW)
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        item.tier === 1 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                        item.tier === 2 ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' :
                        'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      }`}>
                        Tier {item.tier}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        Official PDF
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1.5">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-500 font-medium">
                    PhysicsWallah Live PDF
                  </span>
                  <div className="flex items-center gap-2">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm bg-amber-500 hover:bg-amber-400 text-slate-950 active:scale-95"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: ALL CURATED COMMUNITY RESOURCES & GUIDES                       */}
      {/* ========================================================================= */}
      {activeSection === 'curated' && (
        <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-150">
          {/* Header Banner */}
          <div className="p-4 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border border-slate-800 shadow-xl space-y-2.5 sm:space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] sm:text-xs font-semibold">
              <Bookmark className="w-3.5 h-3.5 shrink-0" /> Curated Reference Hub
            </div>
            <h1 className="text-xl sm:text-3xl font-bold text-white tracking-tight">
              GATE CSE &amp; IT Free Study Resources
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              A collection of top free resources for GATE CSE: NPTEL IIT video lectures, GeeksforGeeks formula sheets, open-source repositories, and verified community materials.
            </p>

            {/* Source citation */}
            <div className="pt-1.5 text-[11px] text-slate-400 flex flex-wrap items-center gap-1.5">
              <span>Sourced &amp; verified from:</span>
              <a
                href="https://gist.github.com/madhurimarawat/376ed280655bbd1a8d712741f282a08c"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 underline inline-flex items-center gap-1"
              >
                madhurimarawat/GATE-CSE-Resources Gist <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Quick Notice to Switch to Physics Wallah */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-amber-200">
              <GraduationCap className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Looking for official Physics Wallah handbooks? We have all 12 complete subject PDFs in our dedicated Physics Wallah section.</span>
            </div>
            <button
              onClick={() => setActiveSection('physics_wallah')}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold whitespace-nowrap shrink-0 transition-colors"
            >
              Open PW Hub (12)
            </button>
          </div>

          {/* Filter and Search Bar */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
            {/* Category Pills (Horizontal scrolling on mobile) */}
            <div className="overflow-x-auto no-scrollbar -mx-1 px-1">
              <div className="flex flex-nowrap sm:flex-wrap items-center gap-1.5 min-w-max">
                {[
                  { id: 'all', label: 'All Resources', icon: Bookmark },
                  { id: 'videos', label: 'Video Lectures', icon: Video },
                  { id: 'notes', label: 'PDF Notes', icon: FileText },
                  { id: 'cheatsheets', label: 'Formula Sheets', icon: Sparkles },
                  { id: 'books', label: 'Books & Code', icon: Code },
                  { id: 'community', label: 'Communities', icon: Users },
                  { id: 'other_branches', label: 'Other Branches', icon: BookOpen },
                ].map(cat => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 touch-manipulation whitespace-nowrap min-h-[36px] ${
                        isSelected
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search resources, topics..."
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 min-h-[38px]"
              />
            </div>
          </div>

          {/* Resource Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
            {filteredOtherResources.map((item, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between shadow-lg group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                      {item.source}
                    </span>
                    {item.badge && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.isHighYield
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                    {item.category}
                  </span>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${
                      item.url.endsWith('.pdf')
                        ? 'bg-cyan-600/30 hover:bg-cyan-600 border border-cyan-500/40 text-cyan-200 hover:text-white'
                        : 'bg-slate-800 hover:bg-cyan-600 text-slate-200 hover:text-white'
                    }`}
                  >
                    <span>{item.url.endsWith('.pdf') ? 'Download PDF' : 'Open Resource'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
