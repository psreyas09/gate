import React, { useState, useMemo } from 'react';
import {
  Sigma,
  Search,
  Copy,
  Check,
  Star,
  BookOpen,
  Filter,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { MathText } from './MathText';
import { TargetScope } from '../types';

interface FormulaCard {
  id: string;
  title: string;
  subject: string;
  scope: TargetScope;
  latex: string;
  description: string;
  standardTrap?: string;
  tags: string[];
}

const FORMULA_DATABASE: FormulaCard[] = [
  // 1. Engineering Mathematics
  {
    id: 'em-1',
    title: 'Cayley-Hamilton Theorem & Matrix Inverses',
    subject: 'Engineering Mathematics',
    scope: 'qualify',
    latex: 'A^n + c_{n-1}A^{n-1} + \\dots + c_1A + c_0I = 0 \\implies A^{-1} = -\\frac{1}{c_0}\\left(A^{n-1} + c_{n-1}A^{n-2} + \\dots + c_1I\\right)',
    description: 'Every square matrix satisfies its own characteristic equation $|A - \\lambda I| = 0$. Useful to compute $A^{-1}$ and large matrix powers $A^{50}$.',
    standardTrap: 'Only valid for square matrices. The constant term $c_0 = (-1)^n \\det(A)$. If $\\det(A) = 0$, $A^{-1}$ does not exist.',
    tags: ['linear algebra', 'matrices', 'eigenvalues', 'high-yield']
  },
  {
    id: 'em-2',
    title: 'Eigenvalues & Trace / Determinant Properties',
    subject: 'Engineering Mathematics',
    scope: 'qualify',
    latex: '\\sum_{i=1}^n \\lambda_i = \\text{Trace}(A) = \\sum_{i=1}^n a_{ii}, \\quad \\prod_{i=1}^n \\lambda_i = \\det(A)',
    description: 'Sum of eigenvalues equals the sum of the main diagonal elements (Trace). Product of eigenvalues equals the determinant.',
    standardTrap: 'Eigenvalues of a triangular or diagonal matrix are simply its diagonal entries.',
    tags: ['linear algebra', 'trace', 'determinant']
  },
  {
    id: 'em-3',
    title: 'Bayes Theorem & Total Probability Rule',
    subject: 'Engineering Mathematics',
    scope: 'qualify',
    latex: 'P(B_i | A) = \\frac{P(A | B_i) P(B_i)}{\\sum_{j=1}^k P(A | B_j) P(B_j)}',
    description: 'Calculates posterior probability given prior probabilities and conditional likelihoods.',
    standardTrap: 'Always verify mutually exclusive and exhaustive partition: $\\sum P(B_j) = 1$.',
    tags: ['probability', 'bayes', 'conditional']
  },
  {
    id: 'em-4',
    title: 'Poisson Distribution & Variance Equality',
    subject: 'Engineering Mathematics',
    scope: 'scoring',
    latex: 'P(X = k) = \\frac{e^{-\\lambda} \\lambda^k}{k!}, \\quad E[X] = \\lambda, \\quad \\text{Var}(X) = \\lambda',
    description: 'Used for rare event arrivals over a fixed time interval or space. Mean equals variance.',
    standardTrap: 'If variance does not equal mean, the distribution cannot be Poisson.',
    tags: ['probability', 'distributions', 'poisson']
  },

  // 2. Data Structures & Algorithms
  {
    id: 'algo-1',
    title: "Master's Theorem for Divide and Conquer",
    subject: 'Algorithms',
    scope: 'qualify',
    latex: 'T(n) = aT(n/b) + \\Theta(n^k \\log^p n) \\quad (a \\ge 1, b > 1): \\\\ \\text{Case 1: If } \\log_b a > k \\implies T(n) = \\Theta(n^{\\log_b a}) \\\\ \\text{Case 2: If } \\log_b a = k: \\\\ \\quad \\text{if } p > -1 \\implies T(n) = \\Theta(n^k \\log^{p+1} n) \\\\ \\quad \\text{if } p = -1 \\implies T(n) = \\Theta(n^k \\log \\log n) \\\\ \\text{Case 3: If } \\log_b a < k \\text{ (and regular)} \\implies T(n) = \\Theta(n^k \\log^p n)',
    description: 'Standard formula for recurrence relations in divide and conquer algorithms like MergeSort, BinarySearch, Strassen.',
    standardTrap: "Cannot use Master's Theorem if $a$ or $b$ are not constants, or if $f(n)$ is not polynomial (e.g. $2^n$).",
    tags: ['recurrence', 'divide and conquer', 'complexity', 'master theorem']
  },
  {
    id: 'algo-2',
    title: 'Sorting Algorithms Complexity & Stability Summary',
    subject: 'Algorithms',
    scope: 'qualify',
    latex: '\\begin{array}{|l|c|c|c|c|} \\hline \\textbf{Algorithm} & \\textbf{Best} & \\textbf{Average} & \\textbf{Worst} & \\textbf{Stable?} \\\\ \\hline \\text{QuickSort} & O(n \\log n) & O(n \\log n) & O(n^2) & \\text{No} \\\\ \\text{MergeSort} & O(n \\log n) & O(n \\log n) & O(n \\log n) & \\text{Yes} \\\\ \\text{HeapSort} & O(n \\log n) & O(n \\log n) & O(n \\log n) & \\text{No} \\\\ \\text{InsertionSort} & O(n) & O(n^2) & O(n^2) & \\text{Yes} \\\\ \\text{CountingSort} & O(n+k) & O(n+k) & O(n+k) & \\text{Yes} \\\\ \\hline \\end{array}',
    description: 'Essential comparison matrix for time/space complexity and stability.',
    standardTrap: 'QuickSort worst-case occurs when the pivot is always the smallest or largest element on sorted arrays.',
    tags: ['sorting', 'complexity', 'stability']
  },
  {
    id: 'algo-3',
    title: 'Binary Tree Traversal Formulas & Relations',
    subject: 'Data Structures',
    scope: 'qualify',
    latex: '\\text{For strict/full binary tree with } L \\text{ leaves}: \\quad I = L - 1 \\implies N = 2L - 1 \\\\ \\text{Max nodes at depth } d = 2^d, \\quad \\text{Max total nodes in height } h = 2^{h+1} - 1',
    description: 'Relationships between leaves ($L$), internal nodes ($I$), total nodes ($N$), and tree height ($h$).',
    standardTrap: 'Count whether height is 0-indexed or 1-indexed according to the question statement.',
    tags: ['trees', 'binary tree', 'leaves']
  },

  // 3. Database Management Systems
  {
    id: 'dbms-1',
    title: 'Normal Forms Decision Checklist & Conditions',
    subject: 'Database Management Systems',
    scope: 'qualify',
    latex: '\\text{For non-trivial FD } X \\to Y: \\\\ \\textbf{1NF:} \\text{ Atomic attribute values only.} \\\\ \\textbf{2NF:} \\text{ 1NF + No partial dependency (No proper subkey } \\to \\text{ non-prime attribute).} \\\\ \\textbf{3NF:} \\text{ 2NF + For every } X \\to Y, \\text{ either } X \\text{ is Superkey OR } Y \\text{ is Prime attribute.} \\\\ \\textbf{BCNF:} \\text{ For every } X \\to Y, X \\text{ MUST be a Superkey.}',
    description: 'Hierarchical normal form rules. 3NF always guarantees lossless join and dependency preservation simultaneously; BCNF may not preserve dependencies.',
    standardTrap: 'A candidate key is a minimal superkey. Prime attributes are elements of ANY candidate key.',
    tags: ['normalization', '3nf', 'bcnf', 'functional dependencies']
  },
  {
    id: 'dbms-2',
    title: 'Conflict Serializability & Precedence Graph Test',
    subject: 'Database Management Systems',
    scope: 'scoring',
    latex: '\\text{Conflict Operations on same data item } Q \\text{ by } T_i, T_j: \\\\ 1.\\; R_i(Q), W_j(Q) \\quad 2.\\; W_i(Q), R_j(Q) \\quad 3.\\; W_i(Q), W_j(Q) \\\\ \\text{Precedence Graph } G=(V,E): \\text{ Directed edge } T_i \\to T_j \\text{ exists if } T_i \\text{ executes conflicting op before } T_j. \\\\ \\textbf{Condition:} \\text{ Schedule is Conflict Serializable } \\iff G \\text{ has NO directed cycles (DAG)}.',
    description: 'Determines if an interleaved transaction schedule is equivalent to a serial schedule.',
    standardTrap: 'Two Read operations ($R_i(Q), R_j(Q)$) NEVER conflict.',
    tags: ['transactions', 'serializability', 'concurrency']
  },

  // 4. Operating Systems
  {
    id: 'os-1',
    title: 'Turnaround Time & Waiting Time Metrics',
    subject: 'Operating Systems',
    scope: 'qualify',
    latex: '\\text{Turnaround Time (TAT)} = \\text{Completion Time (CT)} - \\text{Arrival Time (AT)} \\\\ \\text{Waiting Time (WT)} = \\text{Turnaround Time (TAT)} - \\text{Burst Time (BT)}',
    description: 'Fundamental formulas for process scheduling analysis in FCFS, SJF, SRTF, Round Robin.',
    standardTrap: 'If I/O bursts are present, $WT = TAT - (\\text{Total CPU Burst} + \\text{Total I/O Burst})$.',
    tags: ['cpu scheduling', 'tat', 'waiting time']
  },
  {
    id: 'os-2',
    title: 'Effective Memory Access Time (EMAT) with TLB',
    subject: 'Operating Systems',
    scope: 'qualify',
    latex: '\\text{EMAT} = h \\cdot (t_{\\text{tlb}} + m) + (1 - h) \\cdot (t_{\\text{tlb}} + 2m) \\\\ \\text{For } k\\text{-level paging}: \\quad \\text{EMAT} = h(t_{\\text{tlb}} + m) + (1 - h)(t_{\\text{tlb}} + (k+1)m)',
    description: 'Calculates average memory access latency with TLB hit ratio $h$, TLB access time $t_{\\text{tlb}}$, and main memory access time $m$.',
    standardTrap: 'Check whether TLB and cache are searched in parallel or sequentially in the question specification.',
    tags: ['paging', 'tlb', 'emat', 'virtual memory']
  },
  {
    id: 'os-3',
    title: "Banker's Algorithm Safety Condition",
    subject: 'Operating Systems',
    scope: 'scoring',
    latex: '\\text{Need}[i][j] = \\text{Max}[i][j] - \\text{Allocation}[i][j] \\\\ \\text{State is Safe if } \\exists \\text{ a sequence } \\langle P_1, P_2, \\dots, P_n \\rangle \\text{ such that for each } P_i: \\\\ \\text{Need}_i \\le \\text{Available}, \\quad \\text{then } \\text{Available} \\leftarrow \\text{Available} + \\text{Allocation}_i',
    description: 'Deadlock avoidance algorithm. Guarantees that at least one process can finish and return resources.',
    standardTrap: 'Safe state guarantees NO deadlock; an unsafe state is NOT necessarily deadlocked, but can lead to deadlock.',
    tags: ['deadlock', 'bankers algorithm', 'safety']
  },

  // 5. Computer Networks
  {
    id: 'cn-1',
    title: 'Sliding Window Protocol Efficiencies & Window Sizes',
    subject: 'Computer Networks',
    scope: 'qualify',
    latex: 'a = \\frac{T_{\\text{prop}}}{T_{\\text{trans}}} = \\frac{d / v}{L / B} \\\\ \\textbf{Stop-and-Wait:} \\quad \\eta = \\frac{1}{1 + 2a} \\\\ \\textbf{Go-Back-N (GBN):} \\quad \\eta = \\min\\left(1, \\frac{W_s}{1 + 2a}\\right), \\quad W_s + W_r = N + 1 \\le 2^k \\implies W_s \\le 2^k - 1, \\; W_r = 1 \\\\ \\textbf{Selective Repeat (SR):} \\quad \\eta = \\min\\left(1, \\frac{W_s}{1 + 2a}\\right), \\quad W_s + W_r \\le 2^k \\implies W_s = W_r = 2^{k-1}',
    description: 'Efficiency ($\\eta$), optimal sender window ($W_s = 1 + 2a$), and sequence number bit requirements ($k$ bits).',
    standardTrap: 'Propagation delay $T_{\\text{prop}}$ is one-way, but total Round Trip Time (RTT) is $2 \\times T_{\\text{prop}}$.',
    tags: ['flow control', 'sliding window', 'gbn', 'sr']
  },
  {
    id: 'cn-2',
    title: 'IPv4 Subnetting Powers of 2 & CIDR Reference',
    subject: 'Computer Networks',
    scope: 'qualify',
    latex: '\\begin{array}{|c|c|c|c|} \\hline \\textbf{CIDR} & \\textbf{Subnet Mask} & \\textbf{Total IPs} & \\textbf{Usable Hosts } (2^h - 2) \\\\ \\hline /24 & 255.255.255.0 & 256 & 254 \\\\ /25 & 255.255.255.128 & 128 & 126 \\\\ /26 & 255.255.255.192 & 64 & 62 \\\\ /27 & 255.255.255.224 & 32 & 30 \\\\ /28 & 255.255.255.240 & 16 & 14 \\\\ /29 & 255.255.255.248 & 8 & 6 \\\\ /30 & 255.255.255.252 & 4 & 2 \\text{ (Point-to-point)} \\\\ \\hline \\end{array}',
    description: 'Subnet bit masking table. Subnet IP is all 0s in host bits; Directed Broadcast is all 1s.',
    standardTrap: 'Always subtract 2 for usable hosts (Network ID and Directed Broadcast Address).',
    tags: ['ip address', 'subnetting', 'cidr']
  },

  // 6. Computer Organization & Architecture
  {
    id: 'coa-1',
    title: 'Cache Address Mapping (Direct vs Set-Associative)',
    subject: 'Computer Organization & Architecture',
    scope: 'qualify',
    latex: '\\text{Physical Address (PA) Bits} = \\log_2(\\text{Main Memory Size}) \\\\ \\text{Block / Line Size} = B \\implies \\text{Word Offset} = \\log_2(B) \\\\ \\textbf{Direct Mapped:} \\quad \\text{Index Bits} = \\log_2(N_{\\text{lines}}), \\quad \\text{Tag Bits} = \\text{PA} - (\\text{Index} + \\text{Word}) \\\\ \\textbf{k-Way Set Associative:} \\quad \\text{Sets} = \\frac{N_{\\text{lines}}}{k} \\implies \\text{Set Index Bits} = \\log_2(\\text{Sets}), \\quad \\text{Tag} = \\text{PA} - (\\text{Set} + \\text{Word})',
    description: 'Dissects physical memory address into Tag, Set/Index, and Word/Byte offset fields.',
    standardTrap: 'Check whether addressing is Byte-Addressable (1 byte/word) or Word-Addressable in the question statement.',
    tags: ['cache', 'mapping', 'tag', 'set-associative']
  },
  {
    id: 'coa-2',
    title: 'Pipeline Speedup & Efficiency',
    subject: 'Computer Organization & Architecture',
    scope: 'scoring',
    latex: 'S = \\frac{\\text{Time}_{\\text{non-pipelined}}}{\\text{Time}_{\\text{pipelined}}} = \\frac{n \\cdot k \\cdot \\tau_{\\text{non}}}{(k + n - 1) \\cdot \\tau_{\\text{pipe}}} \\\\ \\text{Ideal Speedup as } n \\to \\infty: \\quad S_{\\text{max}} = k \\quad (\\text{number of pipeline stages})',
    description: 'Calculates speedup of executing $n$ instructions across $k$ stages with clock cycle $\\tau = \\max(\\tau_i) + d$ (buffer delay).',
    standardTrap: 'Pipeline clock cycle is bounded by the SLOWEST stage + latch delay: $\\tau = \\max(t_i) + t_{\\text{latch}}$.',
    tags: ['pipelining', 'speedup', 'clock cycle']
  },

  // 7. Digital Logic
  {
    id: 'dl-1',
    title: "Boolean Algebra Laws & De Morgan's Rules",
    subject: 'Digital Logic',
    scope: 'qualify',
    latex: '\\overline{A + B} = \\overline{A} \\cdot \\overline{B}, \\quad \\overline{A \\cdot B} = \\overline{A} + \\overline{B} \\\\ A + AB = A, \\quad A + \\overline{A}B = A + B \\\\ AB + \\overline{A}C + BC = AB + \\overline{A}C \\quad (\\text{Consensus Theorem})',
    description: 'Essential Boolean minimization rules. Consensus theorem eliminates redundant terms directly.',
    standardTrap: 'Watch out for duals: to take the dual, swap + and · and swap 0 and 1, but do NOT invert the variables.',
    tags: ['boolean algebra', 'de morgan', 'consensus theorem']
  },
  {
    id: 'dl-2',
    title: 'Flip-Flop Characteristic Equations',
    subject: 'Digital Logic',
    scope: 'qualify',
    latex: '\\textbf{SR Flip-Flop:} \\quad Q_{n+1} = S + \\overline{R}Q_n \\quad (SR = 0) \\\\ \\textbf{JK Flip-Flop:} \\quad Q_{n+1} = J\\overline{Q_n} + \\overline{K}Q_n \\\\ \\textbf{D Flip-Flop:} \\quad Q_{n+1} = D \\\\ \\textbf{T Flip-Flop:} \\quad Q_{n+1} = T \\oplus Q_n = T\\overline{Q_n} + \\overline{T}Q_n',
    description: 'Next-state equations for all standard flip-flops in synchronous sequential circuit design.',
    standardTrap: 'SR flip-flop is undefined for $S = 1, R = 1$; JK toggles when $J = 1, K = 1$.',
    tags: ['sequential circuits', 'flip-flop', 'next state']
  },

  // 8. Theory of Computation & Compiler
  {
    id: 'toc-1',
    title: 'Chomsky Hierarchy of Formal Languages',
    subject: 'Theory of Computation',
    scope: 'qualify',
    latex: '\\text{Regular (Type 3)} \\subset \\text{DCFL} \\subset \\text{CFL (Type 2)} \\subset \\text{CSL (Type 1)} \\subset \\text{Recursive (Decidable)} \\subset \\text{RE (Type 0)}',
    description: 'Strict containment hierarchy: Regular (DFA/NFA) -> CFL (Pushdown Automata) -> CSL (Linear Bounded Automata) -> RE (Turing Machine).',
    standardTrap: 'DCFL is strictly closed under complementation, but general CFL is NOT closed under complementation or intersection.',
    tags: ['chomsky hierarchy', 'languages', 'automata']
  }
];

export const FormulaVaultView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedScope, setSelectedScope] = useState<string>('All');
  const [starredIds, setStarredIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('gate_formula_starred') || '[]');
    } catch {
      return [];
    }
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedTraps, setExpandedTraps] = useState<Record<string, boolean>>({});

  const subjects = useMemo(() => {
    const set = new Set(FORMULA_DATABASE.map(f => f.subject));
    return ['All', ...Array.from(set)];
  }, []);

  const toggleStar = (id: string) => {
    setStarredIds(prev => {
      const updated = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('gate_formula_starred', JSON.stringify(updated));
      return updated;
    });
  };

  const copyFormula = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const filteredFormulas = useMemo(() => {
    return FORMULA_DATABASE.filter(f => {
      const matchesSubject = selectedSubject === 'All' || f.subject === selectedSubject;
      const matchesScope =
        selectedScope === 'All' ||
        (selectedScope === 'starred' && starredIds.includes(f.id)) ||
        f.scope === selectedScope;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        f.title.toLowerCase().includes(q) ||
        f.subject.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.tags.some(t => t.toLowerCase().includes(q));

      return matchesSubject && matchesScope && matchesSearch;
    });
  }, [searchQuery, selectedSubject, selectedScope, starredIds]);

  return (
    <div className="space-y-4 sm:space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-cyan-500/30 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[11px] font-semibold">
              <Sigma className="w-3.5 h-3.5" /> High-Yield Formula Vault &amp; Cheatsheets
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Essential GATE CSE Formulas &amp; Decision Trees
            </h1>
            <p className="text-xs text-slate-300">
              Instant revision reference for critical formulas, recurrence bounds, memory sizing, and exam pitfalls.
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs text-slate-400 block">Total Formulas</span>
            <span className="text-2xl font-extrabold text-cyan-400 font-mono">{FORMULA_DATABASE.length}</span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-2.5 pt-2">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search formula, theorem, complexity (e.g. Master, Cayley, Subnet, EMAT)..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Scope Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedScope('All')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedScope === 'All'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({FORMULA_DATABASE.length})
            </button>
            <button
              onClick={() => setSelectedScope('qualify')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedScope === 'qualify'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              🎯 Qualify Core
            </button>
            <button
              onClick={() => setSelectedScope('starred')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1 transition-colors ${
                selectedScope === 'starred'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-current" /> Starred ({starredIds.length})
            </button>
          </div>
        </div>

        {/* Subject Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 scrollbar-none">
          {subjects.map(sub => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-2.5 py-1 rounded-lg text-[11px] whitespace-nowrap transition-colors ${
                selectedSubject === sub
                  ? 'bg-indigo-500/25 border border-indigo-400 text-indigo-200 font-semibold'
                  : 'bg-slate-950/70 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Formula Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFormulas.map(f => {
          const isStarred = starredIds.includes(f.id);
          const isCopied = copiedId === f.id;
          const showTrap = expandedTraps[f.id];

          return (
            <div
              key={f.id}
              className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3 shadow-lg"
            >
              <div className="space-y-2.5">
                {/* Header: Title + Star + Badges */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                        {f.subject}
                      </span>
                      {f.scope === 'qualify' && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          🎯 Qualify High-Yield
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                      {f.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => toggleStar(f.id)}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      isStarred
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                        : 'border-slate-800 text-slate-500 hover:text-slate-300'
                    }`}
                    title={isStarred ? 'Unstar' : 'Star for quick review'}
                  >
                    <Star className={`w-4 h-4 ${isStarred ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* KaTeX Math Equation Box */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center overflow-x-auto text-cyan-200">
                  <MathText text={`$$${f.latex}$$`} />
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed">
                  {f.description}
                </p>

                {/* Exam Trap Accordion */}
                {f.standardTrap && (
                  <div className="pt-1">
                    <button
                      onClick={() =>
                        setExpandedTraps(prev => ({ ...prev, [f.id]: !prev[f.id] }))
                      }
                      className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1 select-none"
                    >
                      <span>⚠️ Common GATE Exam Trap</span>
                      {showTrap ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                    {showTrap && (
                      <div className="mt-1.5 p-2.5 rounded-lg bg-rose-950/20 border border-rose-900/40 text-rose-200 text-xs leading-relaxed animate-in fade-in duration-200">
                        {f.standardTrap}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer: Tags & Copy LaTeX */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-1 flex-wrap">
                  {f.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[10px] text-slate-500">
                      #{tag}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => copyFormula(f.id, f.latex)}
                  className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{isCopied ? 'Copied' : 'Copy LaTeX'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredFormulas.length === 0 && (
        <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 space-y-2">
          <Search className="w-8 h-8 mx-auto text-slate-600" />
          <h4 className="text-sm font-semibold text-slate-300">No formulas found</h4>
          <p className="text-xs">Try clearing the search query or changing filters.</p>
        </div>
      )}
    </div>
  );
};
