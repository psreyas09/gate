// server/more_lessons.js
// 21 Additional In-Depth GATE CSE Topics, Rich Lessons with Citations, Quick Checks, Questions, and Flashcards

const MORE_TOPICS = [
  // Engineering Math
  {
    id: 'math_linear_algebra_systems',
    subject_id: 'engg_math',
    name: 'Linear Systems (Ax=b), Rank & Vector Spaces',
    order_index: 6,
    is_high_yield: 1,
    estimated_study_mins: 35,
    scope: 'qualify'
  },
  {
    id: 'math_discrete_combinatorics',
    subject_id: 'engg_math',
    name: 'Combinatorics, Generating Functions & Pigeonhole',
    order_index: 7,
    is_high_yield: 1,
    estimated_study_mins: 30,
    scope: 'scoring'
  },
  {
    id: 'math_calculus_integrals',
    subject_id: 'engg_math',
    name: 'Mean Value Theorems & Definite Integrals',
    order_index: 8,
    is_high_yield: 0,
    estimated_study_mins: 25,
    scope: 'scoring'
  },

  // Programming & Data Structures
  {
    id: 'ds_heaps_priority_queues',
    subject_id: 'prog_ds',
    name: 'Binary Heaps, Heapify & Priority Queues',
    order_index: 6,
    is_high_yield: 1,
    estimated_study_mins: 30,
    scope: 'scoring'
  },
  {
    id: 'ds_graph_traversals',
    subject_id: 'prog_ds',
    name: 'Graph Traversals: BFS, DFS & Applications',
    order_index: 7,
    is_high_yield: 1,
    estimated_study_mins: 35,
    scope: 'scoring'
  },

  // Database Management Systems
  {
    id: 'dbms_concurrency_recovery',
    subject_id: 'dbms',
    name: 'Concurrency Control (2PL) & Crash Recovery (ARIES)',
    order_index: 6,
    is_high_yield: 1,
    estimated_study_mins: 35,
    scope: 'scoring'
  },

  // Operating Systems
  {
    id: 'os_page_replacement',
    subject_id: 'os',
    name: 'Virtual Memory, Page Replacement & Thrashing',
    order_index: 5,
    is_high_yield: 1,
    estimated_study_mins: 35,
    scope: 'scoring'
  },
  {
    id: 'os_disk_scheduling',
    subject_id: 'os',
    name: 'Disk Scheduling Algorithms (SCAN, C-SCAN, LOOK)',
    order_index: 6,
    is_high_yield: 0,
    estimated_study_mins: 25,
    scope: 'comprehensive'
  },
  {
    id: 'os_semaphores_ipc',
    subject_id: 'os',
    name: 'Semaphores, Mutex & Classical IPC Problems',
    order_index: 7,
    is_high_yield: 1,
    estimated_study_mins: 35,
    scope: 'scoring'
  },

  // Computer Networks
  {
    id: 'cn_sliding_window',
    subject_id: 'cn',
    name: 'Sliding Window Protocols & Flow Control (ARQ)',
    order_index: 4,
    is_high_yield: 1,
    estimated_study_mins: 35,
    scope: 'scoring'
  },
  {
    id: 'cn_routing_algorithms',
    subject_id: 'cn',
    name: 'Routing Protocols: Distance Vector, Link State & BGP',
    order_index: 5,
    is_high_yield: 0,
    estimated_study_mins: 30,
    scope: 'scoring'
  },
  {
    id: 'cn_network_security',
    subject_id: 'cn',
    name: 'Network Security: RSA, Hashes & Digital Signatures',
    order_index: 6,
    is_high_yield: 0,
    estimated_study_mins: 30,
    scope: 'comprehensive'
  },

  // Computer Organization & Architecture
  {
    id: 'coa_ieee754_floating',
    subject_id: 'coa',
    name: 'IEEE 754 Floating Point Representation',
    order_index: 4,
    is_high_yield: 1,
    estimated_study_mins: 35,
    scope: 'scoring'
  },
  {
    id: 'coa_dma_io',
    subject_id: 'coa',
    name: 'I/O Interface: Interrupts, Polling & DMA',
    order_index: 5,
    is_high_yield: 0,
    estimated_study_mins: 25,
    scope: 'comprehensive'
  },

  // Theory of Computation
  {
    id: 'toc_cfg_pda',
    subject_id: 'toc',
    name: 'Context-Free Grammars (CFG) & Pushdown Automata',
    order_index: 3,
    is_high_yield: 1,
    estimated_study_mins: 35,
    scope: 'comprehensive'
  },
  {
    id: 'toc_turing_decidability',
    subject_id: 'toc',
    name: 'Turing Machines, Decidability & Undecidability',
    order_index: 4,
    is_high_yield: 1,
    estimated_study_mins: 35,
    scope: 'comprehensive'
  },

  // Algorithms
  {
    id: 'algo_dynamic_programming',
    subject_id: 'algorithms',
    name: 'Dynamic Programming: 0/1 Knapsack, LCS & MCM',
    order_index: 3,
    is_high_yield: 1,
    estimated_study_mins: 40,
    scope: 'comprehensive'
  },
  {
    id: 'algo_graph_algorithms',
    subject_id: 'algorithms',
    name: 'Graph Algorithms: Dijkstra, Bellman-Ford & MST',
    order_index: 4,
    is_high_yield: 1,
    estimated_study_mins: 35,
    scope: 'comprehensive'
  },
  {
    id: 'algo_divide_conquer',
    subject_id: 'algorithms',
    name: 'Divide & Conquer, Master Theorem & Recurrences',
    order_index: 5,
    is_high_yield: 1,
    estimated_study_mins: 30,
    scope: 'scoring'
  },

  // Compiler Design
  {
    id: 'comp_syntax_parsers',
    subject_id: 'compiler',
    name: 'Syntax Analysis: LL(1), LR(0), SLR, LALR & CLR',
    order_index: 2,
    is_high_yield: 1,
    estimated_study_mins: 40,
    scope: 'comprehensive'
  },
  {
    id: 'comp_optimization_flow',
    subject_id: 'compiler',
    name: 'Intermediate Code, Basic Blocks & Optimization',
    order_index: 3,
    is_high_yield: 0,
    estimated_study_mins: 30,
    scope: 'comprehensive'
  }
];

const MORE_LESSONS = [
  // 1. math_linear_algebra_systems
  {
    id: 'lesson_math_linear_systems',
    topic_id: 'math_linear_algebra_systems',
    title: 'Linear Systems (Ax=b), Rank-Nullity & Consistency',
    citation: 'Higher Engineering Mathematics (B.S. Grewal) Ch 2.5 & Linear Algebra (Gilbert Strang) Ch 3',
    content_markdown: `### Linear Systems ($Ax=b$), Rank & Vector Spaces

In GATE CSE, questions on system of linear equations test consistency criteria and free variable degrees.

#### 1. The Augmented Matrix & Rouché-Capelli Theorem
Given $A_{m \\times n} X_{n \\times 1} = B_{m \\times 1}$, form the augmented matrix $[A \\mid B]$:
1. **Inconsistent (No Solution)**:
   $$\\text{rank}(A) \\neq \\text{rank}([A \\mid B])$$
2. **Unique Solution**:
   $$\\text{rank}(A) = \\text{rank}([A \\mid B]) = n \\quad (\\text{where } n = \\text{number of variables})$$
3. **Infinitely Many Solutions**:
   $$\\text{rank}(A) = \\text{rank}([A \\mid B]) = r < n$$
   - Number of linearly independent solutions = $n - r$ free variables.

#### 2. Homogeneous System ($Ax = 0$)
- Always consistent ($X = 0$ is trivial solution).
- Has non-trivial (non-zero) solution $\\iff \\text{rank}(A) < n \\iff \\det(A) = 0$ (for square matrix).

#### 3. Rank-Nullity Theorem
For any linear transformation matrix $A_{m \\times n}$:
$$\\text{rank}(A) + \\text{nullity}(A) = n \\quad (\\text{number of columns / dimension of domain})$$
- Dimension of column space = $\\text{rank}(A)$.
- Dimension of null space (kernel) = $\\text{nullity}(A) = n - \\text{rank}(A)$.

#### GATE Shortcut:
Reduce $[A \\mid B]$ to row echelon form. Count the number of non-zero rows to immediately read off the rank!`,
    quick_check_questions: [
      {
        id: 'qc_math_sys_1',
        question: 'A system of 4 linear equations in 4 variables Ax = B has rank(A) = 3 and rank([A|B]) = 3. How many solutions exist?',
        options: ['Unique solution', 'Infinitely many solutions with 1 free variable', 'No solution', 'Exactly 3 solutions'],
        correct_index: 1,
        explanation: 'rank(A) = rank([A|B]) = 3 < 4 (variables). The system is consistent with n - r = 4 - 3 = 1 free variable, yielding infinitely many solutions.'
      },
      {
        id: 'qc_math_sys_2',
        question: 'For a 5x7 matrix A, what is the maximum possible rank and minimum possible nullity of A?',
        options: ['Max rank = 5, Min nullity = 2', 'Max rank = 7, Min nullity = 0', 'Max rank = 5, Min nullity = 0', 'Max rank = 7, Min nullity = 2'],
        correct_index: 0,
        explanation: 'rank(A) <= min(5, 7) = 5. By Rank-Nullity: rank + nullity = 7 columns. When rank is maximum (5), nullity is minimum: 7 - 5 = 2.'
      },
      {
        id: 'qc_math_sys_3',
        question: 'A homogeneous system of 3 linear equations in 3 variables Ax = 0 has only the trivial solution if and only if:',
        options: ['det(A) = 0', 'det(A) != 0', 'rank(A) < 3', 'trace(A) = 0'],
        correct_index: 1,
        explanation: 'A square homogeneous system has only the trivial solution (zero vector) iff A is non-singular, meaning det(A) != 0 and rank(A) = n = 3.'
      }
    ]
  },

  // 2. math_discrete_combinatorics
  {
    id: 'lesson_math_combinatorics',
    topic_id: 'math_discrete_combinatorics',
    title: 'Combinatorics, Generating Functions & Pigeonhole Principle',
    citation: 'Discrete Mathematics and Its Applications (Kenneth Rosen) Ch 6 & 8',
    content_markdown: `### Combinatorics, Recurrences & Pigeonhole Principle

Discrete counting questions are frequent 1-mark and 2-mark questions in GATE CSE.

#### 1. Generalized Pigeonhole Principle
If $N$ objects are placed into $k$ boxes, then at least one box contains at least:
$$\\lceil \\frac{N}{k} \\rceil \\quad \\text{objects}$$
- **Minimum objects needed**: To ensure at least $m$ items in one box among $k$ boxes:
  $$N = k(m - 1) + 1$$

#### 2. Principle of Inclusion-Exclusion (PIE)
For 3 sets $A, B, C$:
$$|A \\cup B \\cup C| = \\sum |A| - \\sum |A \\cap B| + |A \\cap B \\cap C|$$

#### 3. Generating Functions & Recurrence Relations
- The sequence $a_n = 1$ has generating function: $G(x) = \\sum_{n=0}^\\infty x^n = \\frac{1}{1 - x}$
- The sequence $a_n = c^n$ has generating function: $G(x) = \\frac{1}{1 - cx}$
- **Characteristic Equation for $a_n = c_1 a_{n-1} + c_2 a_{n-2}$**:
  Solve $r^2 - c_1 r - c_2 = 0$.
  - Distinct roots $r_1, r_2$: $a_n = A r_1^n + B r_2^n$.
  - Repeated root $r$: $a_n = (A + B n) r^n$.`,
    quick_check_questions: [
      {
        id: 'qc_comb_1',
        question: 'In a group of 367 people, what is the guaranteed minimum number of people who share the same birthday (day and month)?',
        options: ['1', '2', '3', 'Cannot be determined'],
        correct_index: 1,
        explanation: 'There are at most 366 possible birthdays (including Feb 29). By Pigeonhole Principle, ceil(367 / 366) = 2.'
      },
      {
        id: 'qc_comb_2',
        question: 'How many cards must be selected from a standard 52-card deck to guarantee getting at least 3 cards of the same suit?',
        options: ['9', '10', '13', '15'],
        correct_index: 0,
        explanation: 'Number of suits k = 4. Desired m = 3. Minimum cards = k*(m - 1) + 1 = 4*(3 - 1) + 1 = 4*2 + 1 = 9 cards.'
      },
      {
        id: 'qc_comb_3',
        question: 'What is the characteristic equation and general solution form for the Fibonacci recurrence F(n) = F(n-1) + F(n-2)?',
        options: ['r² - r - 1 = 0, with roots (1 ± √5)/2', 'r² + r + 1 = 0, with complex roots', 'r² - 2r + 1 = 0, with repeated root r = 1', 'r² - r + 1 = 0'],
        correct_index: 0,
        explanation: 'F(n) - F(n-1) - F(n-2) = 0 gives r² - r - 1 = 0. Roots are r = (1 ± √5)/2 (Golden ratio).'
      }
    ]
  },

  // 3. math_calculus_integrals
  {
    id: 'lesson_math_calculus_integrals',
    topic_id: 'math_calculus_integrals',
    title: 'Mean Value Theorems & Definite Integrals',
    citation: 'Higher Engineering Mathematics (B.S. Grewal) Ch 4 & Ch 7',
    content_markdown: `### Mean Value Theorems & Definite Integrals

#### 1. Rolle\'s Theorem & Lagrange\'s MVT
- **Rolle\'s Theorem**: If $f$ is continuous on $[a, b]$, differentiable on $(a, b)$, and $f(a) = f(b)$, then $\\exists c \\in (a, b)$ such that $f\'(c) = 0$.
- **Lagrange\'s Mean Value Theorem (LMVT)**:
  If $f$ is continuous on $[a, b]$ and differentiable on $(a, b)$, then:
  $$f\'(c) = \\frac{f(b) - f(a)}{b - a} \\quad \\text{for some } c \\in (a, b)$$

#### 2. King\'s Property of Definite Integrals (GATE Favorite)
$$\\int_a^b f(x) \\, dx = \\int_a^b f(a + b - x) \\, dx$$
- Special Case: $\\int_0^a f(x) \\, dx = \\int_0^a f(a - x) \\, dx$
- Adding the original integral $I$ and transformed integral $I$ yields $2I$, frequently simplifying integrands to constants:
  $$I = \\int_0^{\\pi/2} \\frac{\\sin^n x}{\\sin^n x + \\cos^n x} \\, dx = \\frac{\\pi}{4}$$

#### 3. Odd and Even Functions:
$$\\int_{-a}^a f(x) \\, dx = \\begin{cases} 2 \\int_0^a f(x) \\, dx & \\text{if } f(-x) = f(x) \\text{ (even)} \\\\ 0 & \\text{if } f(-x) = -f(x) \\text{ (odd)} \\end{cases}$$`,
    quick_check_questions: [
      {
        id: 'qc_calc_1',
        question: 'What is the value of ∫ (from 0 to π/2) of sin(x) / (sin(x) + cos(x)) dx?',
        options: ['π/2', 'π/4', '1', '0'],
        correct_index: 1,
        explanation: 'By Kings property I = ∫ sin(x)/(sin(x)+cos(x)) dx = ∫ cos(x)/(cos(x)+sin(x)) dx. 2I = ∫ 1 dx = π/2 => I = π/4.'
      },
      {
        id: 'qc_calc_2',
        question: 'If f(x) = x³ - 3x on [-√3, √3], does Rolle\'s theorem guarantee a root of f\'(x) in (-√3, √3)?',
        options: ['Yes, at x = ±1', 'No, because f(x) is not differentiable', 'No, because f(-√3) != f(√3)', 'Only at x = 0'],
        correct_index: 0,
        explanation: 'f(-√3) = -3√3 + 3√3 = 0, f(√3) = 3√3 - 3√3 = 0. f is polynomial (continuous & diff). f\'(x) = 3x² - 3 = 0 => x = ±1, both in (-√3, √3).'
      },
      {
        id: 'qc_calc_3',
        question: 'What is the value of ∫ (from -1 to 1) of (x³ + x*cos(x) + sin³(x)) dx?',
        options: ['2', '1', '0', 'π'],
        correct_index: 2,
        explanation: 'All three terms x³, x*cos(x), and sin³(x) are odd functions: f(-x) = -f(x). The integral of any odd function over [-a, a] is exactly 0.'
      }
    ]
  },

  // 4. ds_heaps_priority_queues
  {
    id: 'lesson_ds_heaps',
    topic_id: 'ds_heaps_priority_queues',
    title: 'Binary Heaps, Heapify & Priority Queues',
    citation: 'Introduction to Algorithms (CLRS) Ch 6 & Karumanchi Ch 7',
    content_markdown: `### Binary Heaps, Heapify & Priority Queues

A **Binary Heap** is a complete binary tree satisfying the heap property.

#### 1. Array Representation (1-indexed vs 0-indexed)
For node at index $i$ (0-indexed):
- Parent: $\\lfloor (i - 1) / 2 \\rfloor$
- Left Child: $2i + 1$
- Right Child: $2i + 2$
- Leaf nodes are indexed from $\\lfloor n/2 \\rfloor$ to $n - 1$.

#### 2. Key Operations & Complexities
1. **Max-Heapify(i)**: Maintains heap invariant downward: $O(\\log N)$ time, $O(1)$ auxiliary space.
2. **Build-Heap**: Builds a heap from an arbitrary array of $N$ elements by calling Heapify from $i = \\lfloor N/2 \\rfloor - 1$ down to 0.
   $$\\text{Time Complexity} = O(N) \\quad (\\text{NOT } O(N \\log N)!)$$
   - Why? Most nodes are near the leaves where tree height is small: $\\sum_{h=0}^{\\log N} \\frac{N}{2^{h+1}} O(h) = O(N)$.
3. **Insert**: Add to end, bubble up (Percolate Up): $O(\\log N)$.
4. **Extract-Max / Min**: Swap root with last element, delete last, Heapify root: $O(\\log N)$.
5. **HeapSort**: Build Max-Heap ($O(N)$), repeatedly swap root and call Heapify ($N \\times O(\\log N)$):
   $$\\text{Total Time} = O(N \\log N) \\quad \\text{in-place, NOT stable}$$`,
    quick_check_questions: [
      {
        id: 'qc_heap_1',
        question: 'What is the tight worst-case time complexity of building a binary heap from an unsorted array of n elements?',
        options: ['O(log n)', 'O(n)', 'O(n log n)', 'O(n²)'],
        correct_index: 1,
        explanation: 'Building a heap bottom-up with Build-Heap takes O(n) time due to the converging sum of heights at each level.'
      },
      {
        id: 'qc_heap_2',
        question: 'In a max-heap of n distinct elements, where can the minimum element be located?',
        options: ['Always at index n-1', 'At the root', 'At any of the leaf nodes (indices floor(n/2) to n-1)', 'At index 1'],
        correct_index: 2,
        explanation: 'In a max-heap, every parent is greater than its children. Therefore, the minimum element must be one of the leaf nodes.'
      },
      {
        id: 'qc_heap_3',
        question: 'Which of the following arrays represents a valid min-heap?',
        options: ['[10, 15, 30, 40, 50, 100, 20]', '[5, 12, 8, 14, 20, 10, 15]', '[2, 8, 6, 16, 25, 4, 12]', '[1, 3, 2, 7, 6, 5, 0]'],
        correct_index: 1,
        explanation: 'In [5, 12, 8, 14, 20, 10, 15]: children of 5 are 12, 8 (valid); children of 12 are 14, 20 (valid); children of 8 are 10, 15 (valid). All min-heap conditions hold.'
      }
    ]
  },

  // 5. ds_graph_traversals
  {
    id: 'lesson_ds_graphs',
    topic_id: 'ds_graph_traversals',
    title: 'Graph Traversals: BFS, DFS & Applications',
    citation: 'Introduction to Algorithms (CLRS) Ch 22 & Karumanchi Ch 9',
    content_markdown: `### Graph Representations & Traversals (BFS / DFS)

#### 1. Graph Representations
- **Adjacency Matrix**: $V \\times V$ matrix. Space: $O(V^2)$. Edge lookup $(u, v)$: $O(1)$. Good for dense graphs ($E \\approx V^2$).
- **Adjacency List**: Array of $V$ lists. Space: $O(V + E)$. Edge lookup: $O(\\text{degree}(u))$. Good for sparse graphs ($E \\ll V^2$).

#### 2. Breadth-First Search (BFS)
- Uses a **Queue** (FIFO).
- Traverses level-by-level from start node.
- **Time Complexity**: $O(V + E)$ with adjacency list.
- **Key Application**: Computes the **shortest path in unweighted graphs**.

#### 3. Depth-First Search (DFS)
- Uses a **Stack** / Recursion.
- Discovers edges into tree edges, back edges, forward edges, and cross edges.
  - **Back edge** in directed graph $\\iff$ **Cycle exists**!
- **Time Complexity**: $O(V + E)$ with adjacency list.

#### 4. Topological Sort (DAGs Only)
- Linear ordering of vertices such that for every directed edge $(u, v)$, vertex $u$ comes before $v$.
- Can be found by sorting vertices in decreasing order of their DFS finish times, or using **Kahn\'s Algorithm** (in-degree tracking using queue in $O(V + E)$).`,
    quick_check_questions: [
      {
        id: 'qc_gt_1',
        question: 'A cycle exists in a directed graph during DFS if and only if the traversal encounters a:',
        options: ['Tree edge', 'Cross edge', 'Forward edge', 'Back edge'],
        correct_index: 3,
        explanation: 'A back edge connects a vertex to an ancestor in the DFS tree that is currently on the recursion stack, proving a cycle.'
      },
      {
        id: 'qc_gt_2',
        question: 'What is the time complexity of finding a topological sort of a Directed Acyclic Graph with V vertices and E edges using Kahn\'s algorithm?',
        options: ['O(V²)', 'O(V + E)', 'O(V log E)', 'O(E log V)'],
        correct_index: 1,
        explanation: 'Kahn\'s algorithm processes each vertex and edge once using an in-degree array and a queue, running in O(V + E) time.'
      },
      {
        id: 'qc_gt_3',
        question: 'To find the shortest path between two vertices in an unweighted directed graph, which algorithm should be used?',
        options: ['Dijkstra\'s algorithm', 'Depth-First Search', 'Breadth-First Search', 'Prim\'s algorithm'],
        correct_index: 2,
        explanation: 'BFS explores vertices in order of their hop distance from the source, guaranteeing shortest path in unweighted graphs in O(V + E).'
      }
    ]
  },

  // 6. dbms_concurrency_recovery
  {
    id: 'lesson_dbms_concurrency_recovery',
    topic_id: 'dbms_concurrency_recovery',
    title: 'Concurrency Control (2PL) & Crash Recovery (ARIES)',
    citation: 'Database System Concepts (Silberschatz) Ch 15 & 16',
    content_markdown: `### Concurrency Control (2PL) & Recovery Protocols

#### 1. Two-Phase Locking (2PL)
- **Growing Phase**: Transaction may acquire locks, but release none.
- **Shrinking Phase**: Transaction may release locks, but acquire none.
- **Lock Point**: The moment when the last lock is acquired.
- **Properties**:
  - Basic 2PL **guarantees conflict serializability**.
  - Basic 2PL **does NOT prevent deadlocks**! (Deadlocks can still occur).
  - Basic 2PL **may suffer from cascading aborts**.

#### 2. Variants of 2PL:
- **Strict 2PL**: All exclusive ($X$) locks held by a transaction must be held until commit/abort.
  - Guarantees **strict schedules** (avoids cascading aborts / cascadeless).
- **Rigorous 2PL**: ALL locks (shared $S$ and exclusive $X$) held until commit/abort.
  - Transactions can be serialized in the order in which they commit.

#### 3. Log-Based Recovery & WAL (Write-Ahead Logging)
- **WAL Rule 1**: Before a database page is written to disk, the corresponding log record must be flushed to stable storage.
- **WAL Rule 2**: All log records must be flushed before a transaction commits.
- **Checkpoints**: Avoid scanning the entire log from the start during recovery.
  - Undo transactions active at crash (did NOT commit).
  - Redo transactions that committed before crash but whose dirty blocks were not on disk.`,
    quick_check_questions: [
      {
        id: 'qc_db_cr_1',
        question: 'Which of the following is TRUE about the basic Two-Phase Locking (2PL) protocol?',
        options: ['It guarantees conflict serializability and prevents deadlocks', 'It guarantees conflict serializability but may suffer from deadlocks', 'It prevents cascading aborts', 'It does not guarantee serializability'],
        correct_index: 1,
        explanation: 'Basic 2PL ensures conflict serializability, but transactions can wait on each other in cycles, so deadlocks can still happen.'
      },
      {
        id: 'qc_db_cr_2',
        question: 'Strict Two-Phase Locking (Strict 2PL) requires that:',
        options: ['All locks are released simultaneously', 'Exclusive locks are held until transaction commit or abort', 'No shared locks are allowed', 'Lock acquisitions happen before any data read'],
        correct_index: 1,
        explanation: 'Strict 2PL requires holding all exclusive (X) locks until the transaction completes (commit/abort), eliminating cascading rollbacks.'
      },
      {
        id: 'qc_db_cr_3',
        question: 'The Write-Ahead Logging (WAL) protocol dictates that:',
        options: ['Database buffers must be written before log buffers', 'Log records corresponding to an update must be flushed to disk before the updated database page is written to disk', 'Transactions must commit before log records are generated', 'Checkpoints occur after every transaction'],
        correct_index: 1,
        explanation: 'WAL ensures that the log record detailing a modification reaches non-volatile storage before the actual dirty database page is written to disk.'
      }
    ]
  },

  // 7. os_page_replacement
  {
    id: 'lesson_os_page_replacement',
    topic_id: 'os_page_replacement',
    title: 'Virtual Memory, Page Replacement & Thrashing',
    citation: 'Operating System Concepts (Silberschatz) Ch 9 & Tanenbaum Ch 3',
    content_markdown: `### Virtual Memory & Page Replacement Algorithms

When a page fault occurs and no free physical frame is available, the OS must choose a victim page to evict.

#### 1. Standard Page Replacement Algorithms
1. **FIFO (First-In, First-Out)**:
   - Evicts the oldest page brought into memory.
   - **Belady\'s Anomaly**: For certain reference strings, increasing the number of page frames *increases* the number of page faults!
2. **Optimal (MIN / Clairvoyant)**:
   - Evicts the page that will **not be used for the longest period in the future**.
   - Lowest possible page fault rate; impossible to implement in practice (requires future knowledge).
3. **LRU (Least Recently Used)**:
   - Evicts the page that has not been used for the longest period in the past.
   - Belongs to **Stack Algorithms**: The set of pages in an $n$-frame memory is always a subset of pages in an $(n+1)$-frame memory.
   - **Never suffers from Belady\'s Anomaly**!

#### 2. Effective Memory Access Time (EMAT)
Let $p$ be the page fault rate ($0 \\le p \\le 1$), $m$ be memory access time, and $PFT$ be page fault service time:
$$\\text{EMAT} = (1 - p) \\cdot m + p \\cdot PFT$$

#### 3. Thrashing
- When a process spends more time paging (swapping pages in and out) than executing instructions.
- Occurs when: $\\sum \\text{Working Set Size} > \\text{Total Physical Memory Frames}$.`,
    quick_check_questions: [
      {
        id: 'qc_os_pr_1',
        question: 'Which page replacement algorithm can suffer from Belady\'s Anomaly?',
        options: ['Optimal', 'LRU (Least Recently Used)', 'FIFO (First-In First-Out)', 'LFU with aging'],
        correct_index: 2,
        explanation: 'FIFO is prone to Beladys Anomaly, where allocating more page frames leads to more page faults for specific reference strings.'
      },
      {
        id: 'qc_os_pr_2',
        question: 'Why are LRU and Optimal algorithms immune to Belady\'s Anomaly?',
        options: ['They are Stack Algorithms where frames(n) ⊆ frames(n+1)', 'They use hardware timers', 'They always minimize disk I/O', 'They prevent thrashing'],
        correct_index: 0,
        explanation: 'Stack algorithms guarantee that the set of pages in memory with n frames is a subset of the pages in memory with n+1 frames, preventing anomalies.'
      },
      {
        id: 'qc_os_pr_3',
        question: 'If memory access time is 100 ns and page fault service time is 10 ms (10,000,000 ns), what is the maximum allowable page fault rate to keep EMAT under 200 ns?',
        options: ['1 in 100,000 (0.001%)', '1 in 10,000 (0.01%)', '1 in 1,000 (0.1%)', '1 in 1,000,000 (0.0001%)'],
        correct_index: 0,
        explanation: 'EMAT = 100 + p * 10,000,000 <= 200 => p * 10^7 <= 100 => p <= 10^-5 = 1 in 100,000.'
      }
    ]
  },

  // 8. os_disk_scheduling
  {
    id: 'lesson_os_disk_scheduling',
    topic_id: 'os_disk_scheduling',
    title: 'Disk Scheduling Algorithms (SCAN, C-SCAN, LOOK)',
    citation: 'Operating System Concepts (Silberschatz) Ch 10 & Stallings Ch 11',
    content_markdown: `### Secondary Storage & Disk Scheduling Algorithms

Disk access time is dominated by:
$$\\text{Total Access Time} = \\text{Seek Time} + \\text{Rotational Latency} + \\text{Transfer Time}$$
- **Seek Time**: Time to move head to desired cylinder/track (dominant factor).
- **Rotational Latency**: Time for target sector to rotate under head = $\\frac{1}{2 \\times \\text{RPM}} \\times 60$ seconds.

#### Disk Head Scheduling Algorithms:
1. **FCFS (First-Come, First-Served)**: Simple, fair, but high head movement.
2. **SSTF (Shortest Seek Time First)**: Selects request closest to current head position.
   - Minimizes immediate seek time, but causes **starvation** for distant requests.
3. **SCAN (Elevator Algorithm)**:
   - Head moves in one direction servicing requests until it reaches the **disk end (cylinder 0 or max)**, then reverses direction.
4. **C-SCAN (Circular SCAN)**:
   - Moves in one direction servicing requests. When it reaches the end, it immediately returns to the beginning **without servicing requests on the return trip**.
   - Provides more uniform waiting time.
5. **LOOK & C-LOOK**:
   - Like SCAN / C-SCAN, but the head only goes as far as the **last request in that direction**, without traveling unnecessarily to the physical disk ends!`,
    quick_check_questions: [
      {
        id: 'qc_os_ds_1',
        question: 'What is the fundamental difference between SCAN and LOOK disk scheduling?',
        options: ['LOOK reverses direction at the last request rather than traveling to the physical disk boundary', 'SCAN is circular while LOOK is bidirectional', 'LOOK suffers from starvation while SCAN does not', 'LOOK calculates rotational delay'],
        correct_index: 0,
        explanation: 'LOOK checks if there are any further requests ahead. If none, it reverses immediately without going all the way to cylinder 0 or max track.'
      },
      {
        id: 'qc_os_ds_2',
        question: 'For a disk spinning at 7200 RPM, what is the average rotational latency?',
        options: ['8.33 ms', '4.17 ms', '2.08 ms', '6.00 ms'],
        correct_index: 1,
        explanation: 'One full rotation takes 60 / 7200 = 1 / 120 sec = 8.33 ms. Average rotational latency is half a rotation = 4.17 ms.'
      },
      {
        id: 'qc_os_ds_3',
        question: 'Which disk scheduling algorithm provides the most uniform wait time for requests across all cylinders?',
        options: ['SSTF', 'FCFS', 'C-SCAN', 'SCAN'],
        correct_index: 2,
        explanation: 'C-SCAN treats cylinders as a circular list, returning directly to the start without serving requests on the return journey, ensuring uniform wait times.'
      }
    ]
  },

  // 9. os_semaphores_ipc
  {
    id: 'lesson_os_semaphores_ipc',
    topic_id: 'os_semaphores_ipc',
    title: 'Semaphores, Mutex & Classical IPC Problems',
    citation: 'Operating System Concepts (Silberschatz) Ch 6 & Tanenbaum Ch 2',
    content_markdown: `### Semaphores, Mutex & Classical Concurrency

#### 1. Critical Section Requirements
Any valid solution to the critical section problem must satisfy:
1. **Mutual Exclusion**: If process $P_i$ is executing in its critical section, no other processes can execute in their critical sections.
2. **Progress**: If no process is in its critical section, only processes not in remainder section can participate in deciding who enters next.
3. **Bounded Waiting**: There exists a bound on the number of times other processes are allowed to enter their critical sections after a process has made a request.

#### 2. Counting vs Binary Semaphores
A semaphore $S$ is an integer variable accessed via two atomic operations:
- **wait(S) / P(S)**:
  \`\`\`c
  wait(S) {
    while (S <= 0); // busy wait (in spinlocks)
    S--;
  }
  \`\`\`
- **signal(S) / V(S)**:
  \`\`\`c
  signal(S) { S++; }
  \`\`\`
- If initialized to $k$, it permits at most $k$ concurrent threads.
- If $k$ processes are in CS and $m$ are waiting, value of counting semaphore with blocking queue $= -m$.

#### 3. Bounded-Buffer (Producer-Consumer)
- \`mutex = 1\` (for mutual exclusion on buffer)
- \`empty = N\` (counting empty slots)
- \`full = 0\` (counting filled slots)
- Producer: \`wait(empty); wait(mutex); ... signal(mutex); signal(full);\`
- Consumer: \`wait(full); wait(mutex); ... signal(mutex); signal(empty);\`
- *Caution*: Swapping order to \`wait(mutex); wait(empty);\` causes **deadlock**!`,
    quick_check_questions: [
      {
        id: 'qc_os_sem_1',
        question: 'A counting semaphore S is initialized to 10. Then 6 wait(S) and 4 signal(S) operations are performed. What is the final value of S?',
        options: ['8', '12', '4', '10'],
        correct_index: 0,
        explanation: 'Initial = 10. 6 wait operations subtract 6: 10 - 6 = 4. 4 signal operations add 4: 4 + 4 = 8.'
      },
      {
        id: 'qc_os_sem_2',
        question: 'In the Producer-Consumer problem with a buffer of size N, what happens if the producer executes wait(mutex) before wait(empty)?',
        options: ['It runs faster', 'Deadlock can occur if the buffer becomes full', 'Mutual exclusion is violated', 'Data corruption occurs'],
        correct_index: 1,
        explanation: 'If the buffer is full, wait(empty) blocks while holding mutex. The consumer cannot acquire mutex to empty a slot, causing deadlock.'
      },
      {
        id: 'qc_os_sem_3',
        question: 'Which of the following critical section criteria prevents a process indefinitely waiting to enter its critical section?',
        options: ['Mutual Exclusion', 'Progress', 'Bounded Waiting', 'Aging'],
        correct_index: 2,
        explanation: 'Bounded waiting guarantees a limit on the number of times other processes enter CS after a request is made, preventing starvation.'
      }
    ]
  },

  // 10. cn_sliding_window
  {
    id: 'lesson_cn_sliding_window',
    topic_id: 'cn_sliding_window',
    title: 'Sliding Window Protocols & Flow Control (ARQ)',
    citation: 'Computer Networking: A Top-Down Approach (Kurose & Ross) Ch 3 & Tanenbaum Ch 3',
    content_markdown: `### Sliding Window Protocols: Stop-and-Wait, GBN & SR

#### 1. Channel Utilization / Efficiency
Let $T_t = \\frac{L}{B}$ be transmission time, $T_p = \\frac{D}{V}$ be propagation delay, and $a = \\frac{T_p}{T_t}$.
- **Stop-and-Wait**:
  $$\\eta = \\frac{T_t}{T_t + 2T_p} = \\frac{1}{1 + 2a}$$
- **Sliding Window (Window size $W$)**:
  $$\\eta = \\min\\left(1, \\frac{W \\cdot T_t}{T_t + 2T_p}\\right) = \\min\\left(1, \\frac{W}{1 + 2a}\\right)$$
- To achieve $100\\%$ efficiency: $W \\ge 1 + 2a$.

#### 2. Comparison of ARQ Protocols
| Feature | Stop-and-Wait | Go-Back-N (GBN) | Selective Repeat (SR) |
|---|---|---|---|
| Sender Window ($W_s$) | 1 | $N > 1$ | $N > 1$ |
| Receiver Window ($W_r$) | 1 | 1 | $N$ (same as $W_s$) |
| Out-of-order packets | Discarded | Discarded | Buffered |
| Acknowledgement | ACK / NAK | Cumulative ($ACK_k$) | Independent / Selective |
| Minimum Sequence Numbers ($k$ bits) | $W_s + W_r = 2$ | $W_s + W_r = N + 1$ | $W_s + W_r = 2N$ |
| Max $W_s$ for $k$-bit sequence numbers | 1 | $2^k - 1$ | $2^{k-1}$ |`,
    quick_check_questions: [
      {
        id: 'qc_cn_sw_1',
        question: 'For a 4-bit sequence number field, what are the maximum sender window sizes for Go-Back-N and Selective Repeat respectively?',
        options: ['15 and 8', '16 and 8', '15 and 15', '8 and 8'],
        correct_index: 0,
        explanation: 'With k = 4 bits, total sequence numbers = 2⁴ = 16. In GBN, max Ws = 2^k - 1 = 15. In SR, max Ws = 2^(k-1) = 8.'
      },
      {
        id: 'qc_cn_sw_2',
        question: 'A link has bandwidth 10 Mbps and propagation delay 20 ms. Packet size is 1000 bytes (8000 bits). What is the parameter a = Tp / Tt?',
        options: ['10', '20', '25', '50'],
        correct_index: 2,
        explanation: 'Tt = 8000 bits / (10 * 10^6 bps) = 0.8 ms. Tp = 20 ms. a = Tp / Tt = 20 / 0.8 = 25.'
      },
      {
        id: 'qc_cn_sw_3',
        question: 'In Go-Back-N protocol, if packets 0, 1, 2, 3, 4 are sent and packet 2 is lost in transit, what does the receiver do upon receiving packet 3?',
        options: ['Buffers packet 3 and sends ACK 3', 'Discards packet 3 and re-sends cumulative ACK for packet 1', 'Naks packet 2 and stores 3', 'Halts transmission'],
        correct_index: 1,
        explanation: 'In GBN, receiver window is 1. Any out-of-order packet is discarded and an ACK for the highest in-order packet (packet 1) is repeated.'
      }
    ]
  },

  // 11. cn_routing_algorithms
  {
    id: 'lesson_cn_routing_algorithms',
    topic_id: 'cn_routing_algorithms',
    title: 'Routing Protocols: Distance Vector, Link State & BGP',
    citation: 'Computer Networking: A Top-Down Approach (Kurose & Ross) Ch 5',
    content_markdown: `### Routing Algorithms & Protocols (DV, LS, BGP)

#### 1. Distance Vector Routing (Bellman-Ford)
- Each router shares its full routing table with **direct neighbors only**, at periodic intervals.
- Equation: $D_x(y) = \\min_v \\{ c(x, v) + D_v(y) \\}$
- **Count-to-Infinity Problem**: Good news travels fast, but link failures propagate very slowly (loops of incrementing costs).
  - Mitigated by: **Split Horizon** (don\'t advertise a route back to the neighbor you learned it from) and **Poison Reverse** (advertise with $\\infty$ metric).

#### 2. Link State Routing (Dijkstra)
- Each router broadcasts the state and cost of its immediate links to **ALL routers in the network** via Link State Advertisements (LSA) flooding.
- Every node reconstructs the exact complete graph topology, then runs Dijkstra\'s algorithm locally.
- Protocol: **OSPF (Open Shortest Path First)**.

#### 3. Border Gateway Protocol (BGP)
- De facto inter-autonomous system (AS) routing protocol.
- **Path Vector Protocol**: Instead of just distance/cost, it advertises the complete list of Autonomous Systems along the path: \`AS-PATH: [AS 100, AS 200, AS 300]\`.
- Completely prevents routing loops by checking if its own AS number is already in the \`AS-PATH\`.`,
    quick_check_questions: [
      {
        id: 'qc_cn_rt_1',
        question: 'The "Count to Infinity" problem in Distance Vector routing is caused by:',
        options: ['High bandwidth delay product', 'Routing loops and slow propagation of link failure information', 'Flooding of LSA packets', 'Dijkstra heap updates'],
        correct_index: 1,
        explanation: 'When a link breaks, neighboring routers falsely believe an alternative path exists through each other, slowly counting up to infinity.'
      },
      {
        id: 'qc_cn_rt_2',
        question: 'Which of the following is TRUE about Link State Routing (OSPF)?',
        options: ['Routers send their entire routing tables only to immediate neighbors', 'Routers flood local link state information to all nodes in the network', 'It uses Bellman-Ford algorithm', 'It suffers from count-to-infinity'],
        correct_index: 1,
        explanation: 'In link-state routing, every router floods LSAs describing its local links to all nodes in the network so everyone builds identical topology maps.'
      },
      {
        id: 'qc_cn_rt_3',
        question: 'How does BGP (Border Gateway Protocol) prevent routing loops across Autonomous Systems?',
        options: ['By using Split Horizon', 'By recording the complete AS-PATH attribute and rejecting paths containing its own AS number', 'By limiting hop count to 15', 'By computing minimum spanning trees'],
        correct_index: 1,
        explanation: 'BGP is a Path Vector protocol; if a router sees its own Autonomous System number in the AS-PATH attribute of an update, it drops the route to prevent loops.'
      }
    ]
  },

  // 12. cn_network_security
  {
    id: 'lesson_cn_network_security',
    topic_id: 'cn_network_security',
    title: 'Network Security: RSA, Hashes & Digital Signatures',
    citation: 'Cryptography and Network Security (William Stallings) Ch 9 & Kurose Ch 8',
    content_markdown: `### Network Security: Asymmetric Crypto, RSA & Signatures

#### 1. RSA Algorithm (Asymmetric Cryptography)
1. Select two large distinct primes $p$ and $q$.
2. Compute modulus: $n = p \\times q$.
3. Compute Euler\'s Totient: $\\phi(n) = (p - 1)(q - 1)$.
4. Choose public exponent $e$ such that $1 < e < \\phi(n)$ and $\\gcd(e, \\phi(n)) = 1$.
5. Compute private exponent $d$:
   $$d \\equiv e^{-1} \\pmod{\\phi(n)} \\iff e \\cdot d \\equiv 1 \\pmod{\\phi(n)}$$
6. **Encryption**: $C = M^e \\pmod n$ (using Public Key $(e, n)$).
7. **Decryption**: $M = C^d \\pmod n$ (using Private Key $(d, n)$).

#### 2. Digital Signatures & Message Authentication
- **Confidentiality**: Encrypt with **Receiver\'s Public Key** (only receiver can decrypt with private key).
- **Authentication / Non-Repudiation (Signature)**:
  - Sender encrypts digest (hash) with **Sender\'s Private Key**.
  - Any receiver verifies with **Sender\'s Public Key**.

#### 3. Cryptographic Hash Functions (SHA-256)
- **Pre-image Resistance (One-Way)**: Given $h$, computationally infeasible to find $m$ such that $H(m) = h$.
- **Second Pre-image Resistance**: Given $m_1$, infeasible to find $m_2 \\neq m_1$ such that $H(m_1) = H(m_2)$.
- **Collision Resistance**: Infeasible to find ANY pair $(m_1, m_2)$ such that $H(m_1) = H(m_2)$.`,
    quick_check_questions: [
      {
        id: 'qc_cn_sec_1',
        question: 'In RSA, if p = 3, q = 11, and public key e = 7, what is the private key d?',
        options: ['3', '7', '13', '17'],
        correct_index: 0,
        explanation: 'n = 33, φ(n) = (3-1)(11-1) = 2*10 = 20. We need e*d ≡ 1 (mod 20) => 7*d ≡ 1 (mod 20). For d = 3: 7*3 = 21 ≡ 1 (mod 20). Thus d = 3.'
      },
      {
        id: 'qc_cn_sec_2',
        question: 'To provide digital signature and non-repudiation, a message digest should be encrypted with:',
        options: ['Receiver\'s public key', 'Receiver\'s private key', 'Sender\'s private key', 'Sender\'s public key'],
        correct_index: 2,
        explanation: 'A digital signature must only be producible by the sender, so it is encrypted with the senders private key and verified by anyone with senders public key.'
      },
      {
        id: 'qc_cn_sec_3',
        question: 'If an adversary cannot find ANY two distinct messages m1 and m2 such that H(m1) = H(m2), the hash function satisfies:',
        options: ['First pre-image resistance', 'Collision resistance', 'Non-repudiation', 'Perfect secrecy'],
        correct_index: 1,
        explanation: 'Collision resistance means it is computationally infeasible to find any two different inputs that produce the same hash output.'
      }
    ]
  },

  // 13. coa_ieee754_floating
  {
    id: 'lesson_coa_ieee754',
    topic_id: 'coa_ieee754_floating',
    title: 'IEEE 754 Floating Point Representation',
    citation: 'Computer System Architecture (Mano) Ch 3 & Computer Organization (Hamacher) Ch 9',
    content_markdown: `### IEEE 754 Floating Point Standard (Single & Double)

#### 1. 32-Bit Single Precision Format
Divided into three fields:
| Field | Width | Description |
|---|---|---|
| **Sign ($S$)** | 1 bit | 0 for positive, 1 for negative |
| **Biased Exponent ($E$)** | 8 bits | Excess-127 bias ($E = \\text{Actual Exponent} + 127$) |
| **Mantissa / Fraction ($M$)** | 23 bits | Fractional part with implicit leading 1 ($1.M$) |

$$\\text{Value} = (-1)^S \\times 1.M \\times 2^{E - 127}$$

#### 2. Special Encodings in IEEE 754:
| Exponent ($E$) | Fraction ($M$) | Meaning |
|---|---|---|
| $0 < E < 255$ | Any | **Normalized Number** ($1.M \\times 2^{E-127}$) |
| $E = 0$ | $M = 0$ | **Zero** ($+0$ or $-0$) |
| $E = 0$ | $M \\neq 0$ | **Denormalized / Subnormal** ($0.M \\times 2^{-126}$) |
| $E = 255$ | $M = 0$ | **Infinity** ($+\\infty$ or $-\\infty$) |
| $E = 255$ | $M \\neq 0$ | **NaN** (Not a Number, e.g. $0/0$) |

#### 3. Step-by-Step Conversion Example: $-14.25$
1. Sign bit $S = 1$ (negative).
2. Binary representation: $14.25 = 1110.01_2$.
3. Normalize: $1.11001_2 \\times 2^3$.
4. Exponent $E = 3 + 127 = 130 = 10000010_2$.
5. Mantissa $M = 11001000000000000000000_2$ (23 bits).`,
    quick_check_questions: [
      {
        id: 'qc_coa_fp_1',
        question: 'What is the biased exponent value stored in an IEEE 754 32-bit single-precision float for the number 2^(-5)?',
        options: ['122', '132', '127', '5'],
        correct_index: 0,
        explanation: 'Bias is 127. Stored Exponent E = Actual Exponent + Bias = -5 + 127 = 122.'
      },
      {
        id: 'qc_coa_fp_2',
        question: 'In IEEE 754 single precision, an exponent field of all 1s (255) with a non-zero fraction field represents:',
        options: ['Zero', 'Positive Infinity', 'Denormalized number', 'NaN (Not a Number)'],
        correct_index: 3,
        explanation: 'E = 255 and M != 0 is reserved to represent NaN (Not a Number).'
      },
      {
        id: 'qc_coa_fp_3',
        question: 'What is the decimal equivalent of the IEEE 754 single precision float: 0xC0000000?',
        options: ['-2.0', '+2.0', '-0.5', '-4.0'],
        correct_index: 0,
        explanation: '0xC0000000 = 1 10000000 000...0. S = 1 (-), E = 128 (actual exp = 128 - 127 = 1), M = 0. Value = -1 * (1.0) * 2¹ = -2.0.'
      }
    ]
  },

  // 14. coa_dma_io
  {
    id: 'lesson_coa_dma_io',
    topic_id: 'coa_dma_io',
    title: 'I/O Interface: Interrupts, Polling & DMA',
    citation: 'Computer System Architecture (M. Morris Mano) Ch 11',
    content_markdown: `### I/O Organization: Programmed I/O, Interrupts & DMA

#### 1. Three Types of I/O Transfers:
1. **Programmed I/O (Polling)**: CPU executes a busy-wait loop constantly reading status flags. Complete waste of CPU cycles.
2. **Interrupt-Driven I/O**: Device signals CPU via an interrupt line when ready. CPU suspends current process, executes Interrupt Service Routine (ISR), and resumes.
3. **Direct Memory Access (DMA)**:
   - For high-speed bulk transfers (e.g. disk to RAM).
   - DMA controller takes over system buses from the CPU.

#### 2. DMA Transfer Modes:
- **Burst Mode (Block Transfer)**: DMA controller holds the bus continuously until the entire block of data is transferred. CPU is suspended for the entire duration.
- **Cycle Stealing Mode**: DMA controller takes bus for one memory cycle to transfer one byte/word, then releases bus back to CPU.

#### 3. CPU Slowdown Calculation:
Let device speed be $R$ bytes/sec and memory bus bandwidth be $B$ bytes/sec:
$$\\text{CPU Time Stolen / Slowdown} = \\frac{R}{B} \\times 100\\%$$`,
    quick_check_questions: [
      {
        id: 'qc_coa_dma_1',
        question: 'A DMA controller transfers data at 2 MB/sec over a memory bus having 10 MB/sec bandwidth using cycle stealing. What percentage of CPU time is stolen?',
        options: ['10%', '20%', '50%', '80%'],
        correct_index: 1,
        explanation: 'Percentage of CPU time stolen = (Device Transfer Rate / Memory Bus Bandwidth) = 2 MB / 10 MB = 20%.'
      },
      {
        id: 'qc_coa_dma_2',
        question: 'Which I/O data transfer method is most suitable for high-speed secondary disk block transfers without CPU intervention per byte?',
        options: ['Programmed I/O', 'Polling', 'DMA (Direct Memory Access)', 'Memory-mapped polling'],
        correct_index: 2,
        explanation: 'DMA transfers blocks of data directly between secondary storage and main memory without involving the CPU for individual bytes.'
      },
      {
        id: 'qc_coa_dma_3',
        question: 'In Daisy Chaining priority interrupt arbitration, which device has the highest priority?',
        options: ['The device closest to the CPU', 'The device farthest from the CPU', 'The device with largest buffer', 'Priority is round-robin'],
        correct_index: 0,
        explanation: 'In daisy chaining, the interrupt grant line propagates serially from the CPU; the device physically closest to the CPU intercepts the signal first.'
      }
    ]
  },

  // 15. toc_cfg_pda
  {
    id: 'lesson_toc_cfg_pda',
    topic_id: 'toc_cfg_pda',
    title: 'Context-Free Grammars (CFG) & Pushdown Automata',
    citation: 'Introduction to Automata Theory (Hopcroft, Motwani, Ullman) Ch 5 & 6',
    content_markdown: `### Context-Free Languages (CFL) & Pushdown Automata (PDA)

#### 1. Context-Free Grammars (CFG)
A CFG is defined as $G = (V, \\Sigma, R, S)$ where every rule is of the form:
$$A \\to \\alpha \\quad (A \\in V, \\alpha \\in (V \\cup \\Sigma)^*)$$
- **Ambiguous Grammar**: If a grammar generates more than one parse tree (or leftmost derivations) for the same string $w$.
  - An **inherently ambiguous language** has NO unambiguous grammar (e.g. $L = \\{a^i b^j c^k \\mid i = j \\lor j = k\\}$).

#### 2. Pushdown Automata (PDA)
A PDA is an NFA equipped with an auxiliary infinite **Stack** memory ($7$-tuple: $(Q, \\Sigma, \\Gamma, \\delta, q_0, Z_0, F)$).
- **DPDA vs NPDA**:
  - NPDA is strictly more powerful than DPDA!
  - DPDA recognizes **Deterministic Context-Free Languages (DCFL)** (e.g. $L = \\{a^n b^n\\}$, $L = \\{w c w^R\\}$).
  - DPDA cannot recognize non-deterministic palindromes $L = \\{w w^R\\}$ without middle marker $c$.

#### 3. Closure Properties of CFLs:
| Operation | CFL | DCFL |
|---|---|---|
| **Union** | Yes | No |
| **Concatenation** | Yes | No |
| **Kleene Star** | Yes | No |
| **Intersection** | **NO** ($L_1 \\cap L_2$ not necessarily CFL) | **NO** |
| **Complementation** | **NO** | **YES** |
| **Intersection with Regular** | **YES** | **YES** |`,
    quick_check_questions: [
      {
        id: 'qc_toc_cfg_1',
        question: 'Which of the following operations is Context-Free Languages (CFL) NOT closed under?',
        options: ['Union', 'Intersection', 'Concatenation', 'Kleene Star'],
        correct_index: 1,
        explanation: 'CFLs are NOT closed under intersection (e.g. {a^n b^n c^m} ∩ {a^m b^n c^n} = {a^n b^n c^n}, which is CSL, not CFL).'
      },
      {
        id: 'qc_toc_cfg_2',
        question: 'Language L = {w w^R | w ∈ {0, 1}*} (even-length palindromes) can be accepted by:',
        options: ['A Deterministic Pushdown Automaton (DPDA)', 'A Non-deterministic Pushdown Automaton (NPDA) only', 'A Finite Automaton (DFA)', 'None of the above'],
        correct_index: 1,
        explanation: 'Because there is no center marker, the automaton must non-deterministically guess the midpoint of the string, so it requires an NPDA.'
      },
      {
        id: 'qc_toc_cfg_3',
        question: 'If L1 is a Context-Free Language and R is a Regular Language, what is L1 ∩ R?',
        options: ['Always Context-Free', 'Always Regular', 'Not guaranteed to be Context-Free', 'Context-Sensitive only'],
        correct_index: 0,
        explanation: 'The intersection of a CFL with a Regular language is always guaranteed to be a Context-Free Language.'
      }
    ]
  },

  // 16. toc_turing_decidability
  {
    id: 'lesson_toc_decidability',
    topic_id: 'toc_turing_decidability',
    title: 'Turing Machines, Decidability & Undecidability',
    citation: 'Introduction to the Theory of Computation (Michael Sipser) Ch 4 & 5',
    content_markdown: `### Turing Machines, Decidability & Rice\'s Theorem

#### 1. Language Classes & Turing Machines
- **Decidable (Recursive, $REC$)**: Turing Machine halts on ALL inputs (accepts or rejects). Closed under union, intersection, complement!
- **Turing Recognizable (Recursively Enumerable, $RE$)**: TM halts and accepts if $w \\in L$, but may loop forever if $w \\notin L$.
- **Theorem**: A language $L$ is Decidable $\\iff$ both $L$ and its complement $\\bar{L}$ are $RE$.

#### 2. Classic Undecidable Problems:
1. **Halting Problem ($A_{\\text{TM}}, H_{\\text{TM}}$)**: Given $\\langle M, w \\rangle$, does $M$ halt on $w$? Undecidable, but $RE$.
2. **Complement of Halting Problem ($\\bar{H}_{\\text{TM}}$)**: Not even $RE$!
3. **Empty Language for TM ($E_{\\text{TM}} = \\{ \\langle M \\rangle \\mid L(M) = \\emptyset \\}$)**: Undecidable, not $RE$.
4. **Post Correspondence Problem (PCP)**: Undecidable over alphabet $\\ge 2$ symbols.

#### 3. Rice\'s Theorem (Instant GATE Solvers)
Let $P$ be any **non-trivial property** about the *language recognized by a Turing Machine*.
$$\\text{Testing whether } L(M) \\in P \\text{ is UNDECIDABLE!}$$
- Examples of Undecidable properties by Rice\'s Theorem:
  - Is $L(M)$ empty?
  - Is $L(M)$ regular?
  - Is $L(M)$ context-free?
  - Does $L(M)$ contain string "101"?`,
    quick_check_questions: [
      {
        id: 'qc_toc_dec_1',
        question: 'According to Rice\'s Theorem, which of the following problems is DECIDABLE for a Turing Machine M?',
        options: ['Whether L(M) is empty', 'Whether L(M) is finite', 'Whether M has more than 5 states', 'Whether L(M) contains the string "01"'],
        correct_index: 2,
        explanation: 'Rice\'s theorem applies only to semantic properties of the language L(M). The number of states is a syntactic property of the TM description, which is trivially decidable by inspecting M.'
      },
      {
        id: 'qc_toc_dec_2',
        question: 'If a language L and its complement L\' are both Recursively Enumerable (RE), then L is:',
        options: ['Decidable (Recursive)', 'Undecidable but RE', 'Non-RE', 'Context-Free'],
        correct_index: 0,
        explanation: 'By Post\'s Theorem, if both L and L\' are recognized by TMs, we can simulate both in parallel; one will halt, making L decidable.'
      },
      {
        id: 'qc_toc_dec_3',
        question: 'The Halting Problem for Turing Machines is:',
        options: ['Decidable', 'Undecidable but Recursively Enumerable', 'Neither Decidable nor Recursively Enumerable', 'Regular'],
        correct_index: 1,
        explanation: 'The Halting Problem is semi-decidable (RE) because a Universal TM can simulate M on w and halt if M halts, but cannot detect infinite loops.'
      }
    ]
  },

  // 17. algo_dynamic_programming
  {
    id: 'lesson_algo_dp',
    topic_id: 'algo_dynamic_programming',
    title: 'Dynamic Programming: 0/1 Knapsack, LCS & MCM',
    citation: 'Introduction to Algorithms (CLRS) Ch 15',
    content_markdown: `### Dynamic Programming (DP) Paradigms & Recurrences

Dynamic Programming applies when a problem exhibits:
1. **Optimal Substructure**: An optimal solution contains optimal solutions to subproblems.
2. **Overlapping Subproblems**: Subproblem solutions can be memoized in a table.

#### 1. 0/1 Knapsack Problem
Given $n$ items with weights $w_i$ and values $v_i$, and capacity $W$:
$$DP[i, w] = \\begin{cases} DP[i-1, w] & \\text{if } w_i > w \\\\ \\max(DP[i-1, w], DP[i-1, w - w_i] + v_i) & \\text{if } w_i \\le w \\end{cases}$$
- **Time Complexity**: $O(nW)$ (Pseudo-polynomial). Space: $O(W)$ with 1D optimization.

#### 2. Longest Common Subsequence (LCS)
Given strings $X[1..m]$ and $Y[1..n]$:
$$L[i, j] = \\begin{cases} 0 & \\text{if } i=0 \\text{ or } j=0 \\\\ 1 + L[i-1, j-1] & \\text{if } X[i] == Y[j] \\\\ \\max(L[i-1, j], L[i, j-1]) & \\text{if } X[i] \\neq Y[j] \\end{cases}$$
- **Time Complexity**: $O(mn)$.

#### 3. Matrix Chain Multiplication (MCM)
To multiply matrices $A_1 \\times A_2 \\times \\dots \\times A_n$ where $A_i$ has dimension $p_{i-1} \\times p_i$:
$$m[i, j] = \\min_{i \\le k < j} \\{ m[i, k] + m[k+1, j] + p_{i-1} p_k p_j \\}$$
- **Time Complexity**: $O(n^3)$ operations.`,
    quick_check_questions: [
      {
        id: 'qc_algo_dp_1',
        question: 'What is the length of the Longest Common Subsequence of strings X = "ABCBDAB" and Y = "BDCAB"?',
        options: ['3', '4', '5', '6'],
        correct_index: 1,
        explanation: 'Common subsequences of length 4 include "BCAB" and "BDAB". No common subsequence of length 5 exists.'
      },
      {
        id: 'qc_algo_dp_2',
        question: 'The 0/1 Knapsack problem with n items and capacity W is solved using Dynamic Programming in O(nW) time. This time complexity is:',
        options: ['Polynomial in input size', 'Pseudo-polynomial', 'Logarithmic', 'Strictly exponential in all cases'],
        correct_index: 1,
        explanation: 'Capacity W is represented in log2(W) bits. The running time is proportional to the numerical value of W, making it pseudo-polynomial.'
      },
      {
        id: 'qc_algo_dp_3',
        question: 'To multiply three matrices A (10x100), B (100x5), C (5x50), which parenthesization minimizes total scalar multiplications?',
        options: ['(A * B) * C with 7,500 multiplications', 'A * (B * C) with 75,000 multiplications', 'Both yield equal multiplications', '(A * B) * C with 5,000 multiplications'],
        correct_index: 0,
        explanation: '(A*B)*C takes (10*100*5) + (10*5*50) = 5000 + 2500 = 7500. A*(B*C) takes (100*5*50) + (10*100*50) = 25000 + 50000 = 75000.'
      }
    ]
  },

  // 18. algo_graph_algorithms
  {
    id: 'lesson_algo_graph_algorithms',
    topic_id: 'algo_graph_algorithms',
    title: 'Graph Algorithms: Dijkstra, Bellman-Ford & MST',
    citation: 'Introduction to Algorithms (CLRS) Ch 23 & 24',
    content_markdown: `### Shortest Paths & Minimum Spanning Trees (MST)

#### 1. Single-Source Shortest Paths (SSSP)
1. **Dijkstra\'s Algorithm**:
   - Greedy algorithm. Finds shortest paths from source to all vertices with **non-negative edge weights**.
   - Time: $O((V + E) \\log V)$ using Min-Heap / Priority Queue.
   - **Fails on graphs with negative edge weights**!
2. **Bellman-Ford Algorithm**:
   - Dynamic Programming. Relaxes all $E$ edges $V - 1$ times.
   - Time: $O(V \\cdot E)$.
   - **Works with negative edge weights** and detects negative weight cycles (if distance decreases on $V$-th relaxation).

#### 2. Minimum Spanning Trees (MST)
For connected weighted undirected graph with $V$ vertices, an MST has $V-1$ edges and minimum total weight:
1. **Kruskal\'s Algorithm**:
   - Sorts edges by weight ($O(E \\log E)$), greedily adds minimum weight edge that doesn\'t form a cycle using **Disjoint Set Union (DSU)**.
   - Total Time: $O(E \\log E) = O(E \\log V)$.
2. **Prim\'s Algorithm**:
   - Grows a single tree from an arbitrary start node using min-priority queue.
   - Total Time: $O(E \\log V)$ with binary heap.`,
    quick_check_questions: [
      {
        id: 'qc_algo_graph_1',
        question: 'Dijkstra\'s shortest path algorithm can produce incorrect results when:',
        options: ['The graph contains cycles', 'The graph is directed', 'The graph contains negative weight edges', 'The graph is disconnected'],
        correct_index: 2,
        explanation: 'Dijkstras greedy choice assumes that once a vertex distance is finalized, it cannot be reduced further; negative edges violate this property.'
      },
      {
        id: 'qc_algo_graph_2',
        question: 'What is the time complexity of the Bellman-Ford algorithm on a graph with V vertices and E edges?',
        options: ['O(V + E)', 'O(V * E)', 'O(E log V)', 'O(V³)'],
        correct_index: 1,
        explanation: 'Bellman-Ford relaxes all E edges for V-1 passes, leading to O(V * E) time complexity.'
      },
      {
        id: 'qc_algo_graph_3',
        question: 'If all edge weights in a connected undirected graph are distinct, how many Minimum Spanning Trees exist?',
        options: ['Exactly 1 unique MST', 'Multiple MSTs', 'V - 1 MSTs', 'E - V + 1 MSTs'],
        correct_index: 0,
        explanation: 'By the Cut Property, if all edge weights are strictly distinct, the Minimum Spanning Tree is guaranteed to be unique.'
      }
    ]
  },

  // 19. algo_divide_conquer
  {
    id: 'lesson_algo_divide_conquer',
    topic_id: 'algo_divide_conquer',
    title: 'Divide & Conquer, Master Theorem & Recurrences',
    citation: 'Introduction to Algorithms (CLRS) Ch 4',
    content_markdown: `### Divide & Conquer & The Master Theorem

#### 1. Master Theorem Standard Form
For recurrences of the form:
$$T(n) = a \\, T\\left(\\frac{n}{b}\\right) + \\Theta(n^k \\log^p n) \\quad (a \\ge 1, b > 1, k \\ge 0)$$
Compute critical exponent: $c = \\log_b a$.

| Case | Condition | Solution $T(n)$ |
|---|---|---|
| **Case 1** | $c > k$ | $\\Theta(n^{\\log_b a})$ (Leaves dominate) |
| **Case 2** | $c = k$ | $\\Theta(n^k \\log^{p+1} n)$ (Balanced work per level) |
| **Case 3** | $c < k$ (and regularity $a f(n/b) \\le c f(n)$) | $\\Theta(n^k \\log^p n)$ (Root dominates) |

#### Common Examples:
- MergeSort: $T(n) = 2T(n/2) + O(n) \\implies a=2, b=2, k=1 \\implies \\log_2 2 = 1 = k \\implies \\Theta(n \\log n)$
- Binary Search: $T(n) = T(n/2) + O(1) \\implies a=1, b=2, k=0 \\implies \\log_2 1 = 0 = k \\implies \\Theta(\\log n)$
- Strassen\'s Matrix Multiplication: $T(n) = 7T(n/2) + O(n^2) \\implies \\log_2 7 \\approx 2.81 > 2 \\implies \\Theta(n^{2.81})$

#### 2. Inversion Count via MergeSort
An inversion is a pair $(i, j)$ such that $i < j$ but $A[i] > A[j]$.
- Counting inversions is done during the Merge step in $O(n \\log n)$ time total!`,
    quick_check_questions: [
      {
        id: 'qc_algo_dc_1',
        question: 'What is the solution to the recurrence relation T(n) = 4T(n/2) + n² using Master Theorem?',
        options: ['Θ(n²)', 'Θ(n² log n)', 'Θ(n³)', 'Θ(n log n)'],
        correct_index: 1,
        explanation: 'a = 4, b = 2, f(n) = n² (k=2, p=0). log_b(a) = log_2(4) = 2. Since log_b(a) = k = 2, Case 2 applies: T(n) = Θ(n^k log^(p+1) n) = Θ(n² log n).'
      },
      {
        id: 'qc_algo_dc_2',
        question: 'What is the solution to T(n) = 8T(n/2) + n?',
        options: ['Θ(n³)', 'Θ(n²)', 'Θ(n log n)', 'Θ(n⁴)'],
        correct_index: 0,
        explanation: 'a = 8, b = 2, f(n) = n¹ (k=1). log_2(8) = 3 > 1. Case 1 applies: T(n) = Θ(n^(log_b a)) = Θ(n³).'
      },
      {
        id: 'qc_algo_dc_3',
        question: 'Maximum number of inversions in an array of size n with distinct elements occurs when the array is:',
        options: ['Sorted in ascending order', 'Sorted in descending order, yielding n(n-1)/2 inversions', 'Alternating high and low', 'All elements are equal'],
        correct_index: 1,
        explanation: 'When descending, every pair (i, j) with i < j satisfies A[i] > A[j], giving total inversions = n*(n-1)/2.'
      }
    ]
  },

  // 20. comp_syntax_parsers
  {
    id: 'lesson_comp_parsers',
    topic_id: 'comp_syntax_parsers',
    title: 'Syntax Analysis: LL(1), LR(0), SLR, LALR & CLR',
    citation: 'Compilers: Principles, Techniques, and Tools (Dragon Book) Ch 4',
    content_markdown: `### Syntax Analysis: Top-Down vs Bottom-Up Parsers

#### 1. Top-Down Parsing: LL(1)
- Left-to-right scan, Leftmost derivation, 1 lookahead token.
- **Table Construction**: For rule $A \\to \\alpha$:
  - For each $a \\in \\text{FIRST}(\\alpha)$, add $A \\to \\alpha$ to $M[A, a]$.
  - If $\\epsilon \\in \\text{FIRST}(\\alpha)$, for each $b \\in \\text{FOLLOW}(A)$, add $A \\to \\alpha$ to $M[A, b]$.
- A grammar is **LL(1) iff** its parse table has no multiple entries.
- *Tip*: An LL(1) grammar can **never be left-recursive** or ambiguous!

#### 2. Bottom-Up Parsing: LR Parsers
- Left-to-right scan, Rightmost derivation in reverse.
- **Hierarchy of Power**:
  $$LR(0) \\subset SLR(1) \\subset LALR(1) \\subset CLR(1)$$
  - Any LL(1) grammar is an $LR(1)$ grammar, but not necessarily $LR(0)$ or $SLR(1)$.

| Parser | States | Reduce Action Placement | Conflict Handling |
|---|---|---|---|
| **LR(0)** | Standard items | Placed in ALL columns of row | Shift/Reduce, Reduce/Reduce |
| **SLR(1)** | Same as LR(0) | Placed ONLY in $\\text{FOLLOW}(A)$ columns | Reduces conflicts of LR(0) |
| **CLR(1) / LR(1)** | Split items with lookahead $[A \\to \\alpha \\cdot, a]$ | Placed ONLY in exact lookahead $a$ | Most powerful, large state count |
| **LALR(1)** | Merged CLR states with identical core items | Same state count as $LR(0)$ / $SLR(1)$ | May introduce Reduce/Reduce conflicts (NEVER Shift/Reduce conflicts!) |`,
    quick_check_questions: [
      {
        id: 'qc_comp_p_1',
        question: 'Which conflict can potentially be introduced when merging CLR(1) states to construct an LALR(1) parsing table?',
        options: ['Shift-Reduce conflict', 'Reduce-Reduce conflict', 'First-Follow conflict', 'No conflicts can be introduced'],
        correct_index: 1,
        explanation: 'Merging states with identical LR(0) cores cannot introduce Shift-Reduce conflicts, but can combine lookaheads for different reductions, causing Reduce-Reduce conflicts.'
      },
      {
        id: 'qc_comp_p_2',
        question: 'Which of the following properties immediately disqualifies a grammar from being LL(1)?',
        options: ['Left recursion (e.g. A -> Aα | β)', 'Right recursion (e.g. A -> αA | β)', 'Having ε productions', 'Having more than 3 non-terminals'],
        correct_index: 0,
        explanation: 'A left-recursive grammar causes an infinite loop in top-down parsers and causes FIRST/FIRST conflicts, so it can never be LL(1).'
      },
      {
        id: 'qc_comp_p_3',
        question: 'In an SLR(1) parsing table, when does a reduce action for rule A -> α get placed in row i?',
        options: ['In every terminal column', 'Only in columns corresponding to FIRST(A)', 'Only in columns corresponding to FOLLOW(A)', 'Only for the $ end marker'],
        correct_index: 2,
        explanation: 'SLR(1) uses simple FOLLOW lookahead: reduce A -> α is placed only in entries (i, a) where a ∈ FOLLOW(A).'
      }
    ]
  },

  // 21. comp_optimization_flow
  {
    id: 'lesson_comp_optimization',
    topic_id: 'comp_optimization_flow',
    title: 'Intermediate Code, Basic Blocks & Optimization',
    citation: 'Compilers: Principles, Techniques, and Tools (Dragon Book) Ch 8 & 9',
    content_markdown: `### Code Optimization, Basic Blocks & Flow Graphs

#### 1. Three-Address Code (3AC)
Every instruction has at most one operator on the right-hand side: $x = y \\text{ op } z$.
- Implemented via:
  - **Quadruples**: \`op, arg1, arg2, result\` (explicit temporary names).
  - **Triples**: \`op, arg1, arg2\` (references earlier instructions by line number).

#### 2. Basic Blocks & Leaders
A **Basic Block** is a sequence of consecutive instructions with single entry and single exit.
- **Rules to Identify Leaders**:
  1. The first instruction of the 3AC is a leader.
  2. Any target of a conditional or unconditional jump is a leader.
  3. Any instruction immediately following a conditional or unconditional jump is a leader.
- A basic block starts at a leader and includes all statements up to (but not including) the next leader or program end.

#### 3. Machine-Independent Optimizations:
1. **Common Subexpression Elimination**: Avoid re-evaluating identical expressions whose operands have not changed.
2. **Dead Code Elimination**: Remove code that computes values never subsequently read.
3. **Constant Folding & Propagation**: Compute compile-time constants (e.g. $x = 3 + 4 \\implies x = 7$).
4. **Loop Optimization**:
   - **Loop Invariant Code Motion**: Move computation outside loop if its operands are constant within loop.
   - **Strength Reduction**: Replace expensive operations with cheaper ones (e.g. $i \\times 4 \\implies$ addition of 4 in each iteration).`,
    quick_check_questions: [
      {
        id: 'qc_comp_opt_1',
        question: 'Which statement is ALWAYS a leader when partitioning three-address code into basic blocks?',
        options: ['The first statement of the program', 'Any statement containing an arithmetic expression', 'The last statement of the program', 'Any assignment to a variable named x'],
        correct_index: 0,
        explanation: 'Leader rule 1: The very first statement of the three-address code is always the leader of the first basic block.'
      },
      {
        id: 'qc_comp_opt_2',
        question: 'Replacing the instruction "y = x * 8" inside a loop with a series of bit shifts or additions is an example of:',
        options: ['Constant Folding', 'Strength Reduction', 'Dead Code Elimination', 'Loop Invariant Code Motion'],
        correct_index: 1,
        explanation: 'Strength reduction replaces computationally heavy operators (like multiplication) with lighter equivalent operators (like left shifts or additions).'
      },
      {
        id: 'qc_comp_opt_3',
        question: 'Replacing "x = 20 * 5" with "x = 100" at compile time is an example of:',
        options: ['Constant Folding', 'Strength Reduction', 'Copy Propagation', 'Code Hoisting'],
        correct_index: 0,
        explanation: 'Evaluating operations on compile-time constants before runtime is known as Constant Folding.'
      }
    ]
  }
];

// Additional Practice Questions & Flashcards for the new material
const MORE_QUESTIONS = [
  {
    id: 'q_math_sys_1',
    subject_id: 'engg_math',
    topic_id: 'math_linear_algebra_systems',
    type: 'NAT',
    marks: 2.0,
    difficulty: 'medium',
    question_text: 'For what value of k does the system of equations x + y + z = 6, x + 2y + 3z = 10, x + 2y + kz = 12 have NO solution?',
    options: null,
    correct_answer: '3',
    explanation: 'Row reducing [A|B]: R2 -> R2 - R1: [0, 1, 2 | 4]. R3 -> R3 - R2: [0, 0, k - 3 | 2]. For no solution, rank(A) < rank([A|B]). This happens when k - 3 = 0 => k = 3.',
    is_pyq: 1,
    pyq_year: 2021,
    pyq_session: 'Set 1'
  },
  {
    id: 'q_ds_heap_1',
    subject_id: 'prog_ds',
    topic_id: 'ds_heaps_priority_queues',
    type: 'MCQ',
    marks: 2.0,
    difficulty: 'medium',
    question_text: 'An array of 10 distinct elements is sorted in ascending order. If this array is viewed as a binary tree, does it satisfy the Min-Heap property?',
    options: ['Yes, always', 'No, never', 'Only if elements are all negative', 'Only if the array size is a power of 2'],
    correct_answer: 'Yes, always',
    explanation: 'For any index i, its children are at 2i+1 and 2i+2. In an ascending sorted array, A[i] < A[2i+1] and A[i] < A[2i+2] for all i. Thus it trivially satisfies the min-heap property!',
    is_pyq: 1,
    pyq_year: 2020,
    pyq_session: 'Set 2'
  },
  {
    id: 'q_os_pr_1',
    subject_id: 'os',
    topic_id: 'os_page_replacement',
    type: 'NAT',
    marks: 2.0,
    difficulty: 'hard',
    question_text: 'Consider the page reference string: 1, 2, 3, 4, 2, 1, 5, 6, 2, 1, 2, 3, 7, 6, 3, 2, 1, 2, 3, 6 with 3 page frames initially empty. How many page faults occur under LRU page replacement?',
    options: null,
    correct_answer: '15',
    explanation: 'Simulating LRU step by step with 3 frames yields exactly 15 page faults across the 20 references.',
    is_pyq: 1,
    pyq_year: 2023,
    pyq_session: 'Set 1'
  },
  {
    id: 'q_cn_sw_1',
    subject_id: 'cn',
    topic_id: 'cn_sliding_window',
    type: 'NAT',
    marks: 2.0,
    difficulty: 'medium',
    question_text: 'In a Go-Back-N ARQ protocol, the propagation delay is 15 ms and frame transmission time is 1 ms. What is the minimum number of bits required in the sequence number field to achieve 100% link utilization?',
    options: null,
    correct_answer: '5',
    explanation: 'a = Tp / Tt = 15 / 1 = 15. Optimum window W >= 1 + 2a = 1 + 30 = 31 frames. For GBN with window 31, sequence numbers needed >= W + 1 = 32. 2^k >= 32 => k = 5 bits.',
    is_pyq: 1,
    pyq_year: 2019,
    pyq_session: 'Set 1'
  },
  {
    id: 'q_algo_dc_1',
    subject_id: 'algorithms',
    topic_id: 'algo_divide_conquer',
    type: 'MCQ',
    marks: 1.0,
    difficulty: 'easy',
    question_text: 'What is the solution of the recurrence relation T(n) = 2T(n/2) + O(n)?',
    options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
    correct_answer: 'O(n log n)',
    explanation: 'By Master Theorem Case 2: a = 2, b = 2, log2(2) = 1, f(n) = n¹. T(n) = O(n log n). This is standard MergeSort recurrence.',
    is_pyq: 1,
    pyq_year: 2022,
    pyq_session: 'Set 1'
  }
];

const MORE_FLASHCARDS = [
  {
    id: 'fc_rank_nullity',
    subject_id: 'engg_math',
    topic_id: 'math_linear_algebra_systems',
    front: 'State the Rank-Nullity Theorem for a matrix A with dimensions m x n.',
    back: 'rank(A) + nullity(A) = n (where n is the number of columns / dimension of the domain).',
    citation: 'B.S. Grewal Ch 2.5'
  },
  {
    id: 'fc_heap_build_complexity',
    subject_id: 'prog_ds',
    topic_id: 'ds_heaps_priority_queues',
    front: 'What is the time complexity to build a Binary Heap from an unsorted array of n elements?',
    back: 'O(n) time using bottom-up Build-Heap (calling Heapify from floor(n/2)-1 down to 0).',
    citation: 'CLRS Ch 6.3'
  },
  {
    id: 'fc_belady_anomaly',
    subject_id: 'os',
    topic_id: 'os_page_replacement',
    front: 'What is Belady\'s Anomaly and which standard algorithm exhibits it?',
    back: 'Belady\'s Anomaly occurs when increasing the number of physical frames increases the number of page faults. It occurs in FIFO, but NEVER in stack algorithms like LRU or Optimal.',
    citation: 'Silberschatz Ch 9.4'
  },
  {
    id: 'fc_sliding_window_eff',
    subject_id: 'cn',
    topic_id: 'cn_sliding_window',
    front: 'What is the formula for channel efficiency in Sliding Window protocol with window size W and a = Tp/Tt?',
    back: 'Efficiency η = min(1, W / (1 + 2a)). For 100% efficiency, W >= 1 + 2a.',
    citation: 'Kurose & Ross Ch 3.4'
  },
  {
    id: 'fc_ieee754_bias',
    subject_id: 'coa',
    topic_id: 'coa_ieee754_floating',
    front: 'What is the bias and bit breakdown for IEEE 754 32-bit single precision floating point?',
    back: '1 sign bit, 8 exponent bits with bias 127, 23 mantissa bits with implicit 1. Value = (-1)^S * (1.M) * 2^(E - 127).',
    citation: 'Hamacher Ch 9'
  },
  {
    id: 'fc_rices_theorem',
    subject_id: 'toc',
    topic_id: 'toc_turing_decidability',
    front: 'State Rice\'s Theorem in simple terms.',
    back: 'Any non-trivial semantic property of the language recognized by a Turing Machine is undecidable.',
    citation: 'Sipser Ch 5'
  },
  {
    id: 'fc_ll1_left_recursion',
    subject_id: 'compiler',
    topic_id: 'comp_syntax_parsers',
    front: 'Can a grammar with left recursion be parsed by an LL(1) parser?',
    back: 'No! Left recursion creates FIRST-FIRST conflicts in LL(1) tables, causing top-down parsers to loop infinitely. It must be eliminated before LL(1) parsing.',
    citation: 'Dragon Book Ch 4.3'
  }
];

module.exports = {
  MORE_TOPICS,
  MORE_LESSONS,
  MORE_QUESTIONS,
  MORE_FLASHCARDS
};
