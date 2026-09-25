const { db } = require('./db');
const { seedAllLessons } = require('./seed_all_lessons');

async function seedDatabase() {
  const existing = await db.prepare('SELECT COUNT(*) as count FROM subjects').get();
  if (existing && existing.count > 0) {
    console.log('Database already seeded. Skipping initial seeding.');
    return;
  }

  console.log('Seeding GATE CSE 2027 curriculum database...');

  // 1. Subjects
  const subjects = [
    // Tier 1 (Full Depth, Weight 1.0)
    {
      id: 'aptitude',
      name: 'General Aptitude',
      tier: 1,
      priority_weight: 1.0,
      reference_book: 'Quantitative Aptitude (R.S. Aggarwal) & High School English Grammar (Wren & Martin)',
      citation_info: 'Verbal reasoning, quantitative problem solving, and analytical data interpretation.'
    },
    {
      id: 'engg_math',
      name: 'Engineering Mathematics',
      tier: 1,
      priority_weight: 1.0,
      reference_book: 'Discrete Mathematics and Its Applications (Kenneth Rosen) & Higher Engineering Mathematics (B.S. Grewal)',
      citation_info: 'Discrete math, linear algebra, calculus, and probability distributions.'
    },
    {
      id: 'digital_logic',
      name: 'Digital Logic',
      tier: 1,
      priority_weight: 0.9,
      reference_book: 'Digital Logic and Computer Design (M. Morris Mano)',
      citation_info: 'Ch 1 (Number Systems), Ch 2 (Boolean Algebra), Ch 3 (K-maps), Ch 4 (Combinational), Ch 5 (Sequential).'
    },
    {
      id: 'dbms',
      name: 'Database Management Systems',
      tier: 1,
      priority_weight: 0.95,
      reference_book: 'Database System Concepts (Silberschatz, Korth, Sudarshan)',
      citation_info: 'Ch 2 (Relational Model), Ch 6 (Formal Relational Query Languages), Ch 7 (Relational Database Design & Normalization), Ch 14 (Transactions).'
    },
    {
      id: 'prog_ds',
      name: 'Programming & Data Structures',
      tier: 1,
      priority_weight: 1.0,
      reference_book: 'Data Structures and Algorithms Made Easy (Narasimha Karumanchi) & The C Programming Language (K&R)',
      citation_info: 'Ch 2 (Analysis of Algorithms), Ch 3 (Linked Lists), Ch 4 (Stacks), Ch 5 (Queues), Ch 6 (Trees), Ch 14 (Hashing).'
    },

    // Tier 2 (Fundamentals Only, Weight 0.6)
    {
      id: 'os',
      name: 'Operating Systems',
      tier: 2,
      priority_weight: 0.65,
      reference_book: 'Operating System Concepts (Silberschatz, Galvin, Gagne)',
      citation_info: 'Ch 3 (Processes), Ch 5 (CPU Scheduling), Ch 7 (Deadlocks), Ch 8 (Main Memory & Paging).'
    },
    {
      id: 'cn',
      name: 'Computer Networks',
      tier: 2,
      priority_weight: 0.65,
      reference_book: 'Computer Networking: A Top-Down Approach (Kurose and Ross)',
      citation_info: 'Ch 1 (Architecture & Layers), Ch 2 (Application: HTTP, DNS), Ch 3 (Transport: TCP/UDP), Ch 4 (Network: IP Addressing & Subnetting).'
    },
    {
      id: 'coa',
      name: 'Computer Organization & Architecture',
      tier: 2,
      priority_weight: 0.6,
      reference_book: 'Computer System Architecture (M. Morris Mano)',
      citation_info: 'Ch 3 (Data Representation), Ch 5 (Basic Computer Organization), Ch 9 (Pipelining), Ch 12 (Memory Hierarchy & Cache).'
    },

    // Tier 3 (Light-Touch Only, Weight 0.3)
    {
      id: 'toc',
      name: 'Theory of Computation',
      tier: 3,
      priority_weight: 0.35,
      reference_book: 'Introduction to Automata Theory, Languages, and Computation (Hopcroft, Motwani, Ullman)',
      citation_info: 'Ch 2 (Finite Automata - DFA/NFA), Ch 3 (Regular Expressions and Properties).'
    },
    {
      id: 'algorithms',
      name: 'Algorithms (Beyond Basics)',
      tier: 3,
      priority_weight: 0.35,
      reference_book: 'Introduction to Algorithms (CLRS)',
      citation_info: 'Ch 2-4 (Divide and Conquer & Sorting basics), Ch 16 (Greedy Algorithms fundamentals).'
    },
    {
      id: 'compiler',
      name: 'Compiler Design',
      tier: 3,
      priority_weight: 0.25,
      reference_book: 'Compilers: Principles, Techniques, and Tools (Aho, Lam, Sethi, Ullman - Dragon Book)',
      citation_info: 'Ch 1 (Overview of Compilation Phases: Lexical, Syntax, Semantic, Intermediate Code Generation).'
    }
  ];

  const subjectStmts = subjects.map(s => ({
    sql: `INSERT INTO subjects (id, name, tier, priority_weight, reference_book, citation_info)
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [s.id, s.name, s.tier, s.priority_weight, s.reference_book, s.citation_info]
  }));
  await db.batch(subjectStmts);

  // 2. High-Yield & Standard Topics
  const topics = [
    // General Aptitude (Tier 1)
    { id: 'apt_quant_arithmetic', subject_id: 'aptitude', name: 'Percentages, Profit & Loss, Ratios', order_index: 1, is_high_yield: 1, estimated_study_mins: 25 },
    { id: 'apt_quant_tsd', subject_id: 'aptitude', name: 'Time, Speed & Distance, Work', order_index: 2, is_high_yield: 1, estimated_study_mins: 30 },
    { id: 'apt_quant_perm_prob', subject_id: 'aptitude', name: 'Permutations, Combinations & Probability', order_index: 3, is_high_yield: 1, estimated_study_mins: 30 },
    { id: 'apt_verbal_grammar', subject_id: 'aptitude', name: 'Grammar, Sentence Completion & Vocabulary', order_index: 4, is_high_yield: 0, estimated_study_mins: 20 },
    { id: 'apt_analytical_reasoning', subject_id: 'aptitude', name: 'Logical Deduction & Data Interpretation', order_index: 5, is_high_yield: 1, estimated_study_mins: 25 },

    // Engineering Math (Tier 1)
    { id: 'math_linear_algebra_eigen', subject_id: 'engg_math', name: 'Matrices, Determinants & Eigenvalues', order_index: 1, is_high_yield: 1, estimated_study_mins: 35 },
    { id: 'math_discrete_logic', subject_id: 'engg_math', name: 'Propositional & First-Order Logic', order_index: 2, is_high_yield: 1, estimated_study_mins: 30 },
    { id: 'math_discrete_graphs', subject_id: 'engg_math', name: 'Graph Theory (Eulerian, Hamiltonian, Trees)', order_index: 3, is_high_yield: 1, estimated_study_mins: 35 },
    { id: 'math_calculus_limits', subject_id: 'engg_math', name: 'Limits, Continuity & Maxima/Minima', order_index: 4, is_high_yield: 0, estimated_study_mins: 25 },
    { id: 'math_prob_bayes', subject_id: 'engg_math', name: 'Conditional Probability & Bayes Theorem', order_index: 5, is_high_yield: 1, estimated_study_mins: 30 },

    // Digital Logic (Tier 1)
    { id: 'dl_number_systems', subject_id: 'digital_logic', name: 'Number Systems & 2s Complement Arithmetic', order_index: 1, is_high_yield: 0, estimated_study_mins: 20 },
    { id: 'dl_kmaps_boolean', subject_id: 'digital_logic', name: 'Boolean Minimization & K-Maps', order_index: 2, is_high_yield: 1, estimated_study_mins: 30 },
    { id: 'dl_combinational_mux', subject_id: 'digital_logic', name: 'Multiplexers, Decoders & Adders', order_index: 3, is_high_yield: 1, estimated_study_mins: 30 },
    { id: 'dl_sequential_flipflops', subject_id: 'digital_logic', name: 'Flip-Flops, Counters & Registers', order_index: 4, is_high_yield: 1, estimated_study_mins: 35 },

    // DBMS (Tier 1)
    { id: 'dbms_relational_keys', subject_id: 'dbms', name: 'Relational Model, Candidate Keys & Super Keys', order_index: 1, is_high_yield: 1, estimated_study_mins: 25 },
    { id: 'dbms_normalization', subject_id: 'dbms', name: 'Functional Dependencies & Normal Forms (1NF–BCNF)', order_index: 2, is_high_yield: 1, estimated_study_mins: 40 },
    { id: 'dbms_sql_rel_algebra', subject_id: 'dbms', name: 'SQL Queries, Joins & Relational Algebra', order_index: 3, is_high_yield: 1, estimated_study_mins: 35 },
    { id: 'dbms_transactions_acid', subject_id: 'dbms', name: 'Transactions, ACID & Conflict Serializability', order_index: 4, is_high_yield: 1, estimated_study_mins: 35 },
    { id: 'dbms_indexing_btrees', subject_id: 'dbms', name: 'Indexing Fundamentals & B/B+ Trees', order_index: 5, is_high_yield: 0, estimated_study_mins: 25 },

    // Programming & Data Structures (Tier 1)
    { id: 'prog_c_fundamentals', subject_id: 'prog_ds', name: 'C Pointers, Arrays & Recursion', order_index: 1, is_high_yield: 1, estimated_study_mins: 30 },
    { id: 'ds_complexity_asymptotics', subject_id: 'prog_ds', name: 'Asymptotic Notations & Recurrence Relations', order_index: 2, is_high_yield: 1, estimated_study_mins: 25 },
    { id: 'ds_stacks_queues', subject_id: 'prog_ds', name: 'Stacks, Queues & Evaluation of Expressions', order_index: 3, is_high_yield: 1, estimated_study_mins: 25 },
    { id: 'ds_trees_bst', subject_id: 'prog_ds', name: 'Binary Trees, BST & Tree Traversals', order_index: 4, is_high_yield: 1, estimated_study_mins: 35 },
    { id: 'ds_hashing', subject_id: 'prog_ds', name: 'Hash Tables & Collision Resolution Techniques', order_index: 5, is_high_yield: 0, estimated_study_mins: 20 },

    // Operating Systems (Tier 2 - Fundamentals Only)
    { id: 'os_cpu_scheduling', subject_id: 'os', name: 'Process Scheduling (FCFS, SJF, SRTF, Round Robin)', order_index: 1, is_high_yield: 1, estimated_study_mins: 30 },
    { id: 'os_memory_paging', subject_id: 'os', name: 'Memory Management, Paging & TLB Hit Calculations', order_index: 2, is_high_yield: 1, estimated_study_mins: 35 },
    { id: 'os_synchronization', subject_id: 'os', name: 'Basic Synchronization & Critical Section Problems', order_index: 3, is_high_yield: 0, estimated_study_mins: 25 },
    { id: 'os_deadlocks', subject_id: 'os', name: 'Deadlock Necessary Conditions & Banker Algorithm', order_index: 4, is_high_yield: 1, estimated_study_mins: 25 },

    // Computer Networks (Tier 2 - Fundamentals Only)
    { id: 'cn_ip_subnetting', subject_id: 'cn', name: 'IPv4 Addressing, Subnetting & CIDR Masks', order_index: 1, is_high_yield: 1, estimated_study_mins: 35 },
    { id: 'cn_tcp_udp', subject_id: 'cn', name: 'TCP 3-Way Handshake, Flow Control & UDP vs TCP', order_index: 2, is_high_yield: 1, estimated_study_mins: 30 },
    { id: 'cn_protocols_dns_http', subject_id: 'cn', name: 'Key Application Protocols: HTTP, DNS, DHCP', order_index: 3, is_high_yield: 0, estimated_study_mins: 20 },

    // COA (Tier 2 - Fundamentals Only)
    { id: 'coa_cache_memory', subject_id: 'coa', name: 'Cache Memory Mapping (Direct, Set-Associative) & Hits', order_index: 1, is_high_yield: 1, estimated_study_mins: 35 },
    { id: 'coa_pipelining', subject_id: 'coa', name: 'Instruction Pipelining, Hazards & Speedup Factor', order_index: 2, is_high_yield: 1, estimated_study_mins: 30 },
    { id: 'coa_instruction_cycle', subject_id: 'coa', name: 'Instruction Cycle & Addressing Modes Overview', order_index: 3, is_high_yield: 0, estimated_study_mins: 20 },

    // TOC (Tier 3 - Light Touch)
    { id: 'toc_regular_languages', subject_id: 'toc', name: 'Finite Automata (DFA/NFA) & Regular Expressions', order_index: 1, is_high_yield: 0, estimated_study_mins: 25 },
    { id: 'toc_properties', subject_id: 'toc', name: 'Closure Properties of Regular Languages', order_index: 2, is_high_yield: 0, estimated_study_mins: 20 },

    // Algorithms (Tier 3 - Light Touch)
    { id: 'algo_sorting_searching', subject_id: 'algorithms', name: 'Standard Sorting & Searching (MergeSort, QuickSort, Binary Search)', order_index: 1, is_high_yield: 0, estimated_study_mins: 25 },
    { id: 'algo_greedy_basics', subject_id: 'algorithms', name: 'Greedy Strategy (Fractional Knapsack & Huffman Basics)', order_index: 2, is_high_yield: 0, estimated_study_mins: 20 },

    // Compiler Design (Tier 3 - Light Touch)
    { id: 'comp_phases_overview', subject_id: 'compiler', name: 'Overview of 6 Phases of Compiler & Symbol Table', order_index: 1, is_high_yield: 0, estimated_study_mins: 20 }
  ];

  const topicStmts = topics.map(t => ({
    sql: `INSERT INTO topics (id, subject_id, name, order_index, is_high_yield, estimated_study_mins)
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [t.id, t.subject_id, t.name, t.order_index, t.is_high_yield, t.estimated_study_mins]
  }));
  await db.batch(topicStmts);

  // 3. Rich Lessons with Citations and 3 Quick Checks each
  const lessons = [
    {
      id: 'lesson_linear_eigen',
      topic_id: 'math_linear_algebra_eigen',
      title: 'Eigenvalues, Eigenvectors & Matrix Invariants',
      citation: 'Higher Engineering Mathematics (B.S. Grewal) Ch 2.7 / Kreyszig Ch 8.1',
      content_markdown: `### High-Yield Concept: Eigenvalues & Matrix Invariants

In GATE CSE, questions on eigenvalues appear almost every year because they test deep properties through fast algebraic shortcuts.

#### 1. Fundamental Definition
For a square matrix $A_{n \\times n}$, a non-zero vector $X$ is an eigenvector and scalar $\\lambda$ is its eigenvalue if:
$$A X = \\lambda X \\iff (A - \\lambda I) X = 0$$

To find eigenvalues, solve the characteristic equation:
$$\\det(A - \\lambda I) = 0$$

#### 2. Golden Properties (Saves 80% calculation time in GATE):
1. **Sum of Eigenvalues = Trace of Matrix**:
   $$\\sum_{i=1}^n \\lambda_i = \\text{tr}(A) = \\sum_{i=1}^n a_{ii}$$
2. **Product of Eigenvalues = Determinant of Matrix**:
   $$\\prod_{i=1}^n \\lambda_i = \\det(A)$$
3. **Triangular / Diagonal Matrix Shortcut**:
   The eigenvalues of upper-triangular, lower-triangular, or diagonal matrices are **strictly the main diagonal elements**.
4. **Transformations**:
   - If $\\lambda$ is an eigenvalue of $A$, then $\\lambda^k$ is an eigenvalue of $A^k$.
   - If $A$ is invertible, $1/\\lambda$ is an eigenvalue of $A^{-1}$.
   - $\\lambda + c$ is an eigenvalue of $A + cI$.
   - Eigenvalues of $A$ and $A^T$ are identical.
5. **Symmetric Matrices**:
   All eigenvalues of a real symmetric matrix are **purely real**. If skew-symmetric, eigenvalues are either zero or purely imaginary.

#### Efficiency Strategy for 35+ Target:
Never expand full polynomials unless necessary. Immediately sum the diagonal elements to get trace, compute determinant, and match against the options!`,
      quick_check_questions: JSON.stringify([
        {
          id: 'qc_eigen_1',
          question: 'The trace of a 3x3 matrix A is 9 and its determinant is 24. Two of its eigenvalues are 2 and 3. What is the third eigenvalue?',
          options: ['3', '4', '6', '8'],
          correct_index: 1,
          explanation: 'Sum of eigenvalues = trace(A) -> 2 + 3 + λ3 = 9 => λ3 = 4. Check product: 2 * 3 * 4 = 24 = det(A). Both hold!'
        },
        {
          id: 'qc_eigen_2',
          question: 'If λ is an eigenvalue of an invertible matrix A, what is the eigenvalue of the matrix A² + 3A - 2I?',
          options: ['λ² + 3λ', 'λ² + 3λ - 2', '2λ² + 3λ - 1', 'λ² - 3λ + 2'],
          correct_index: 1,
          explanation: 'By the spectral mapping theorem for polynomials of matrices, if λ is an eigenvalue of A, then f(λ) = λ² + 3λ - 2 is an eigenvalue of f(A).'
        },
        {
          id: 'qc_eigen_3',
          question: 'What are the eigenvalues of an upper triangular matrix with diagonal elements 5, -2, 7?',
          options: ['0, 1, 10', '5, -2, 7', 'Root of characteristic cubic only', 'Cannot be determined without non-zero off-diagonals'],
          correct_index: 1,
          explanation: 'For any triangular (upper or lower) or diagonal matrix, the eigenvalues are simply the diagonal entries themselves: 5, -2, 7.'
        }
      ])
    },
    {
      id: 'lesson_dbms_normalization',
      topic_id: 'dbms_normalization',
      title: 'Functional Dependencies & Normal Forms (1NF through BCNF)',
      citation: 'Database System Concepts (Silberschatz, Korth, Sudarshan) Ch 7.3 - 7.5',
      content_markdown: `### Functional Dependencies & Normal Forms

Normalization eliminates insertion, deletion, and update anomalies while minimizing data redundancy. For GATE CSE, identifying the highest normal form of a schema is guaranteed marks.

#### 1. Candidate Key Determination
Given relation $R(A, B, C, D, \\dots)$ and Functional Dependencies (FDs) $F$:
1. Find attribute closures $(X)^+$ by applying reflexivity, augmentation, and transitivity.
2. An attribute that never appears on the Right-Hand Side (RHS) of any FD **must be part of every candidate key**.
3. If $(X)^+$ includes all attributes of $R$, and no proper subset of $X$ does, $X$ is a **Candidate Key**.
4. **Prime attributes**: Attributes that belong to *any* candidate key.
5. **Non-prime attributes**: Attributes not belonging to any candidate key.

#### 2. Normal Forms Hierarchy
$$\\text{BCNF} \\subset \\text{3NF} \\subset \\text{2NF} \\subset \\text{1NF}$$

| Normal Form | Condition for every non-trivial FD: $X \\to Y$ |
|---|---|
| **1NF** | All attributes contain atomic (indivisible) values. |
| **2NF** | In 1NF + **No Partial Dependency**. Non-prime attributes must depend on the *whole* candidate key, not a proper subset of it. |
| **3NF** | In 2NF + **No Transitive Dependency**. For every FD $X \\to Y$, either: <br>1. $X$ is a Super Key, **OR**<br>2. $Y$ is a Prime Attribute. |
| **BCNF** | For every non-trivial FD $X \\to Y$, **$X$ MUST be a Super Key**. |

#### Key Difference between 3NF and BCNF:
3NF allows $X \\to Y$ where $X$ is NOT a super key, provided $Y$ is a single prime attribute. BCNF strictly forbids this. Thus, every BCNF relation is in 3NF, but not vice-versa.`,
      quick_check_questions: JSON.stringify([
        {
          id: 'qc_dbms_1',
          question: 'In relation R(A, B, C, D) with candidate key AB, the dependency A -> C exists (where C is non-prime). Which normal form is violated?',
          options: ['1NF', '2NF', '3NF', 'BCNF only'],
          correct_index: 1,
          explanation: 'Since A is a proper subset of the candidate key AB and C is a non-prime attribute, A -> C represents a partial dependency. This violates 2NF.'
        },
        {
          id: 'qc_dbms_2',
          question: 'Relation R(A, B, C) has candidate keys AB and AC. The FD BC -> A holds. Is this relation in 3NF? In BCNF?',
          options: ['Neither 3NF nor BCNF', '3NF but NOT BCNF', 'Both 3NF and BCNF', 'BCNF but NOT 3NF'],
          correct_index: 2,
          explanation: 'Candidate keys are AB and AC. For BC -> A: BC is also a candidate key because (BC)+ = {B, C, A}. Since BC is a super key, it satisfies BCNF (and therefore 3NF)!'
        },
        {
          id: 'qc_dbms_3',
          question: 'Which of the following is TRUE regarding lossless join and dependency preservation?',
          options: [
            'Any relation can always be decomposed into BCNF with both lossless join and dependency preservation.',
            'Decomposition into 3NF is always guaranteed to be lossless and dependency-preserving.',
            'Dependency preservation is guaranteed in BCNF but not 3NF.',
            'Neither 3NF nor BCNF guarantees lossless join.'
          ],
          correct_index: 1,
          explanation: 'It is always possible to achieve a 3NF decomposition that is BOTH lossless join and dependency preserving. For BCNF, dependency preservation is NOT always achievable.'
        }
      ])
    },
    {
      id: 'lesson_ds_trees',
      topic_id: 'ds_trees_bst',
      title: 'Binary Trees, BST Properties & Traversal Invariants',
      citation: 'Data Structures and Algorithms Made Easy (Narasimha Karumanchi) Ch 6.1 - 6.7',
      content_markdown: `### Binary Trees & Binary Search Trees (BST)

Trees are one of the most scored areas in Tier 1 GATE CSE.

#### 1. Crucial Binary Tree Formulas
- **Handshaking Lemma applied to Trees**:
  In any binary tree, the number of leaf nodes ($n_0$) is related to the number of nodes with degree 2 ($n_2$) by:
  $$n_0 = n_2 + 1$$
  *(Guaranteed GATE 1-marker question!)*
- Maximum number of nodes at level $l$ (root at level 0): $2^l$.
- Maximum nodes in binary tree of height $h$: $2^{h+1} - 1$.
- Minimum height of a binary tree with $n$ nodes: $\\lceil \\log_2(n+1) \\rceil - 1$.

#### 2. Tree Traversals
- **Preorder**: Root $\\to$ Left $\\to$ Right
- **Inorder**: Left $\\to$ Root $\\to$ Right
- **Postorder**: Left $\\to$ Right $\\to$ Root

**Golden Rule for BST**:
The **Inorder traversal of any Binary Search Tree always produces strictly sorted ascending order**.
If given only Preorder or Postorder traversal of a BST, you automatically know the Inorder traversal (just sort the keys)! With Inorder + Preorder, you can uniquely reconstruct the BST.

#### 3. BST Search & Height
- In an unbalanced BST, worst-case search time is $O(n)$ (skewed tree).
- In an AVL / Balanced BST, worst-case search time is $O(\\log n)$.`,
      quick_check_questions: JSON.stringify([
        {
          id: 'qc_tree_1',
          question: 'A full binary tree has 25 leaf nodes. How many nodes have degree 2?',
          options: ['24', '25', '26', '50'],
          correct_index: 0,
          explanation: 'Using the fundamental theorem n0 = n2 + 1: n2 = n0 - 1 = 25 - 1 = 24.'
        },
        {
          id: 'qc_tree_2',
          question: 'The preorder traversal of a BST is: 30, 20, 10, 25, 40, 35, 50. What is its postorder traversal?',
          options: [
            '10, 20, 25, 30, 35, 40, 50',
            '10, 25, 20, 35, 50, 40, 30',
            '50, 40, 35, 30, 25, 20, 10',
            '25, 10, 20, 35, 40, 50, 30'
          ],
          correct_index: 1,
          explanation: 'For a BST, sorted order gives Inorder: 10, 20, 25, 30, 35, 40, 50. Root is 30. Left subtree is {10, 20, 25} (root 20, left 10, right 25). Right subtree is {35, 40, 50} (root 40, left 35, right 50). Postorder (Left-Right-Root): 10, 25, 20, 35, 50, 40, 30.'
        },
        {
          id: 'qc_tree_3',
          question: 'Which traversal along with Preorder is sufficient to construct any general binary tree uniquely?',
          options: ['Level-order', 'Inorder', 'Postorder', 'Euler tour'],
          correct_index: 1,
          explanation: 'Inorder is mandatory along with Preorder (or Postorder) to determine which elements belong to the left and right subtrees in a general binary tree.'
        }
      ])
    },
    {
      id: 'lesson_os_scheduling',
      topic_id: 'os_cpu_scheduling',
      title: 'CPU Scheduling Algorithms & Gantt Chart Calculations',
      citation: 'Operating System Concepts (Silberschatz, Galvin, Gagne) Ch 5.1 - 5.4',
      content_markdown: `### CPU Scheduling (Tier 2 High-Yield)

Scheduling problems in GATE test Turnaround Time (TAT) and Waiting Time (WT). Mastering these formula steps guarantees free marks.

#### 1. Core Definitions
- **Arrival Time ($AT$)**: Time at which process enters ready queue.
- **Burst Time ($BT$)**: CPU execution time required.
- **Completion Time ($CT$)**: Timestamp when process finishes execution.
- **Turnaround Time ($TAT$)**: Total elapsed time from arrival to completion.
  $$TAT = CT - AT$$
- **Waiting Time ($WT$)**: Time spent waiting in ready queue.
  $$WT = TAT - BT$$

#### 2. Key Scheduling Policies
1. **First-Come, First-Served (FCFS)**: Non-preemptive. Suffers from **Convoy Effect** (short processes wait behind long ones).
2. **Shortest Job First (SJF)**: Non-preemptive. Provably gives the **minimal average waiting time** among non-preemptive algorithms.
3. **Shortest Remaining Time First (SRTF)**: Preemptive version of SJF. Preempts current process if newly arrived process has strictly smaller remaining burst time.
4. **Round Robin (RR)**: Preemptive with Time Quantum ($TQ$).
   - If $TQ \\to \\infty$, RR degenerates to FCFS.
   - If $TQ$ is too small, context switch overhead dominates.
   - Ideal $TQ$ should be larger than 80% of typical CPU bursts.`,
      quick_check_questions: JSON.stringify([
        {
          id: 'qc_os_1',
          question: 'Processes P1 and P2 arrive at time 0 with burst times 6 and 2 ms. Under non-preemptive SJF, what is the average waiting time?',
          options: ['1 ms', '2 ms', '3 ms', '4 ms'],
          correct_index: 0,
          explanation: 'Under SJF, P2 (BT=2) runs first from 0 to 2 (WT=0). Then P1 (BT=6) runs from 2 to 8 (WT=2). Average WT = (0 + 2) / 2 = 1 ms.'
        },
        {
          id: 'qc_os_2',
          question: 'Which CPU scheduling algorithm is mathematically proven to minimize average waiting time for a given set of stationary processes?',
          options: ['Round Robin', 'FCFS', 'Shortest Job First (SJF)', 'Priority Scheduling'],
          correct_index: 2,
          explanation: 'SJF is optimal because moving a shorter process before a longer one decreases the waiting time of the shorter process more than it increases the waiting time of the longer process.'
        },
        {
          id: 'qc_os_3',
          question: 'If Turnaround Time is 14 ms and CPU Burst Time is 6 ms, what is the Waiting Time?',
          options: ['6 ms', '8 ms', '14 ms', '20 ms'],
          correct_index: 1,
          explanation: 'Waiting Time = Turnaround Time - Burst Time = 14 - 6 = 8 ms.'
        }
      ])
    },
    {
      id: 'lesson_cn_subnetting',
      topic_id: 'cn_ip_subnetting',
      title: 'IPv4 Addressing, Subnetting & CIDR Calculations',
      citation: 'Computer Networking: A Top-Down Approach (Kurose and Ross) Ch 4.3 - 4.4',
      content_markdown: `### IPv4 Subnetting & CIDR (Tier 2 High-Yield)

Subnetting questions are purely mechanical. Learn the binary mask powers and you will never lose marks here.

#### 1. IPv4 Structure & CIDR Notation
An IPv4 address has 32 bits, partitioned into **Network ID** ($n$ bits) and **Host ID** ($h = 32 - n$ bits):
$$\\text{Prefix notation: } /n$$
- Number of total IP addresses in block: $2^{32 - n} = 2^h$.
- Number of **usable host addresses**: $2^h - 2$ (Subtract 2: one for Network ID where all host bits = 0, and one for Directed Broadcast where all host bits = 1).

#### 2. Powers of 2 Quick Reference:
- $/24 \\implies 2^8 = 256$ IPs (254 usable)
- $/26 \\implies 2^6 = 64$ IPs (62 usable)
- $/28 \\implies 2^4 = 16$ IPs (14 usable)
- $/30 \\implies 2^2 = 4$ IPs (2 usable — standard point-to-point links)

#### 3. Determining the Subnet Address
To find the subnet of an IP address $A$ with mask $M$:
$$\\text{Subnet Address} = A \\text{ BITWISE-AND } M$$`,
      quick_check_questions: JSON.stringify([
        {
          id: 'qc_cn_1',
          question: 'How many usable host IP addresses are available in a subnet with prefix /27?',
          options: ['27', '30', '32', '62'],
          correct_index: 1,
          explanation: 'Host bits h = 32 - 27 = 5. Total addresses = 2^5 = 32. Usable host addresses = 32 - 2 = 30.'
        },
        {
          id: 'qc_cn_2',
          question: 'What is the subnet mask corresponding to the CIDR prefix /26?',
          options: ['255.255.255.0', '255.255.255.128', '255.255.255.192', '255.255.255.224'],
          correct_index: 2,
          explanation: '/26 has 26 ones. The last octet has 2 ones: 11000000 in binary = 128 + 64 = 192. Thus mask is 255.255.255.192.'
        },
        {
          id: 'qc_cn_3',
          question: 'For IP address 200.10.15.68/28, what is the network (subnet) address?',
          options: ['200.10.15.0', '200.10.15.64', '200.10.15.68', '200.10.15.79'],
          correct_index: 1,
          explanation: 'Block size for /28 is 2^(32-28) = 16. Subnet boundaries in the 4th octet are 0, 16, 32, 48, 64, 80... The value 68 falls between 64 and 79. So the network address is 200.10.15.64.'
        }
      ])
    },
    {
      id: 'lesson_coa_cache',
      topic_id: 'coa_cache_memory',
      title: 'Cache Memory Mapping & Hit Ratio Calculations',
      citation: 'Computer System Architecture (M. Morris Mano) Ch 12.5',
      content_markdown: `### Cache Memory Organization (Tier 2 High-Yield)

#### 1. Average Memory Access Time (AMAT)
$$\\text{AMAT} = H_c \\cdot T_c + (1 - H_c) \\cdot M_p$$
Where:
- $H_c$: Cache hit ratio ($0 \\le H_c \\le 1$)
- $T_c$: Cache access time
- $M_p$: Miss penalty (Main memory access time)

#### 2. Address Splitting in Cache Mapping
Physical Address is partitioned into bit fields:

1. **Direct Mapped**:
   $$\\text{Address} = [\\text{Tag}] \\mid [\\text{Line Index}] \\mid [\\text{Block Offset}]$$
   - Block Offset bits: $\\log_2(\\text{Block Size in bytes})$
   - Line Index bits: $\\log_2(\\text{Number of Cache Lines})$
   - Tag bits: Remaining bits.

2. **$k$-way Set Associative**:
   $$\\text{Address} = [\\text{Tag}] \\mid [\\text{Set Index}] \\mid [\\text{Block Offset}]$$
   - Number of Sets = $\\frac{\\text{Total Lines}}{k}$
   - Set Index bits: $\\log_2(\\text{Number of Sets})$`,
      quick_check_questions: JSON.stringify([
        {
          id: 'qc_coa_1',
          question: 'A system has cache hit ratio 0.9. Cache access time is 2 ns and main memory access time is 50 ns. What is the AMAT?',
          options: ['5.2 ns', '6.8 ns', '7.0 ns', '26 ns'],
          correct_index: 1,
          explanation: 'AMAT = (Hit Ratio * Cache Time) + (Miss Ratio * Memory Time) = (0.9 * 2) + (0.1 * 50) = 1.8 + 5.0 = 6.8 ns.'
        },
        {
          id: 'qc_coa_2',
          question: 'A 64 KB cache has 64-byte block size and is 4-way set associative. How many sets does the cache have?',
          options: ['256', '512', '1024', '2048'],
          correct_index: 0,
          explanation: 'Total lines = Cache Size / Block Size = 64 KB / 64 B = 1024 lines. Since it is 4-way set associative, Number of Sets = 1024 / 4 = 256 sets.'
        },
        {
          id: 'qc_coa_3',
          question: 'Which cache mapping scheme completely eliminates conflict misses?',
          options: ['Direct Mapped', '2-Way Set Associative', 'Fully Associative', 'None of these'],
          correct_index: 2,
          explanation: 'In a fully associative cache, any memory block can be placed into any cache frame. Therefore, conflict misses are 0 (only compulsory and capacity misses exist).'
        }
      ])
    }
  ];

  const lessonStmts = lessons.map(l => ({
    sql: `INSERT INTO lessons (id, topic_id, title, content_markdown, quick_check_questions, citation)
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [l.id, l.topic_id, l.title, l.content_markdown, l.quick_check_questions, l.citation]
  }));
  await db.batch(lessonStmts);

  // 4. Questions (Practice & PYQs across MCQ, MSQ, NAT)
  const questions = [
    // Aptitude Question (MCQ, PYQ 2023)
    {
      id: 'q_apt_1',
      subject_id: 'aptitude',
      topic_id: 'apt_quant_tsd',
      type: 'MCQ',
      marks: 1.0,
      difficulty: 'easy',
      question_text: 'A train 150 meters long passes a pole in 15 seconds and another train of the same length travelling in opposite direction in 10 seconds. What is the speed of the second train?',
      options: JSON.stringify(['36 km/h', '54 km/h', '72 km/h', '90 km/h']),
      correct_answer: 'C',
      explanation: 'Speed of first train = 150 m / 15 s = 10 m/s. When travelling in opposite direction, relative speed = (150 + 150) / 10 = 30 m/s. So speed of second train = 30 - 10 = 20 m/s. In km/h: 20 * (18/5) = 72 km/h. Hence Option C is correct.',
      is_pyq: 1,
      pyq_year: 2023,
      pyq_session: 'Set 1'
    },
    // Engg Math Question (NAT, PYQ 2022)
    {
      id: 'q_math_1',
      subject_id: 'engg_math',
      topic_id: 'math_linear_algebra_eigen',
      type: 'NAT',
      marks: 2.0,
      difficulty: 'medium',
      question_text: 'Consider a 3 x 3 matrix A whose eigenvalues are 1, -1, and 2. What is the determinant of the matrix B = A³ - 2A² + I ?',
      options: null,
      correct_answer: '0',
      explanation: 'Eigenvalues of matrix polynomial f(A) are f(λ). Here f(λ) = λ³ - 2λ² + 1. For λ = 1: f(1) = 1 - 2 + 1 = 0. For λ = -1: f(-1) = -1 - 2 + 1 = -2. For λ = 2: f(2) = 8 - 8 + 1 = 1. The eigenvalues of B are 0, -2, and 1. The determinant of B is the product of its eigenvalues: 0 * (-2) * 1 = 0.',
      is_pyq: 1,
      pyq_year: 2022,
      pyq_session: 'Set 2'
    },
    // Digital Logic (MCQ, PYQ 2021)
    {
      id: 'q_dl_1',
      subject_id: 'digital_logic',
      topic_id: 'dl_kmaps_boolean',
      type: 'MCQ',
      marks: 1.0,
      difficulty: 'easy',
      question_text: 'The minimal sum of products form for the Boolean function F(A, B, C) = Σm(1, 3, 5, 7) is:',
      options: JSON.stringify(['C', 'B', 'A', 'A\'C']),
      correct_answer: 'A',
      explanation: 'Min-terms 1, 3, 5, 7 all have C = 1 (A\'B\'C, A\'BC, AB\'C, ABC). Grouping all four terms forms a quad on the K-map where A and B vary, leaving only C. Thus F = C.',
      is_pyq: 1,
      pyq_year: 2021,
      pyq_session: 'Set 1'
    },
    // DBMS Question (MSQ, GATE 2024 style)
    {
      id: 'q_dbms_1',
      subject_id: 'dbms',
      topic_id: 'dbms_normalization',
      type: 'MSQ',
      marks: 2.0,
      difficulty: 'medium',
      question_text: 'Which of the following statements is/are TRUE regarding normalization in relational databases?',
      options: JSON.stringify([
        'Every relation in BCNF is also in 3NF.',
        'Lossless join decomposition is always achievable when converting to BCNF.',
        'Dependency preservation is always guaranteed in any BCNF decomposition.',
        'A relation with only two attributes is always in BCNF.'
      ]),
      correct_answer: JSON.stringify(['A', 'B', 'D']),
      explanation: 'A is true (BCNF is strictly stronger than 3NF). B is true (lossless join can always be guaranteed in BCNF). C is false (dependency preservation is NOT always achievable in BCNF). D is true (any binary relation R(A, B) is inherently in BCNF). Thus A, B, and D are correct.',
      is_pyq: 1,
      pyq_year: 2024,
      pyq_session: 'Set 1'
    },
    // Programming & DS Question (MCQ, PYQ 2020)
    {
      id: 'q_ds_1',
      subject_id: 'prog_ds',
      topic_id: 'prog_c_fundamentals',
      type: 'MCQ',
      marks: 1.0,
      difficulty: 'easy',
      question_text: 'What will be the output of the following C code snippet?\nint a[] = {10, 20, 30, 40};\nint *p = a;\nprintf("%d", *(p + 2));',
      options: JSON.stringify(['10', '20', '30', '40']),
      correct_answer: 'C',
      explanation: 'p points to base element a[0] (value 10). *(p + 2) accesses a[2], which has the value 30. Correct option is C.',
      is_pyq: 1,
      pyq_year: 2020,
      pyq_session: 'Set 1'
    },
    // OS Question (NAT, PYQ 2023)
    {
      id: 'q_os_1',
      subject_id: 'os',
      topic_id: 'os_memory_paging',
      type: 'NAT',
      marks: 2.0,
      difficulty: 'medium',
      question_text: 'In a paging system with TLB, the TLB access time is 10 ns and main memory access time is 80 ns. What is the effective memory access time (EMAT) in nanoseconds if the TLB hit ratio is 90%? (Assume single level page table)',
      options: null,
      correct_answer: '98',
      explanation: 'On TLB hit (prob 0.90): time = TLB + Memory = 10 + 80 = 90 ns.\nOn TLB miss (prob 0.10): time = TLB + Page Table lookup in Memory + Target Memory access = 10 + 80 + 80 = 170 ns.\nEMAT = 0.9 * 90 + 0.1 * 170 = 81 + 17 = 98 ns.',
      is_pyq: 1,
      pyq_year: 2023,
      pyq_session: 'Set 2'
    },
    // CN Question (MCQ, PYQ 2022)
    {
      id: 'q_cn_1',
      subject_id: 'cn',
      topic_id: 'cn_ip_subnetting',
      type: 'MCQ',
      marks: 1.0,
      difficulty: 'easy',
      question_text: 'An organization is granted the block 130.56.0.0/16. The administrator wants to create 1024 subnets. What is the subnet mask?',
      options: JSON.stringify(['255.255.255.0', '255.255.255.192', '255.255.255.240', '255.255.254.0']),
      correct_answer: 'B',
      explanation: 'Original prefix is /16. To make 1024 subnets, we need log2(1024) = 10 additional subnet bits. New prefix = 16 + 10 = 26 bits (/26). A /26 mask has 26 ones: 255.255.255.192. Option B is correct.',
      is_pyq: 1,
      pyq_year: 2022,
      pyq_session: 'Set 1'
    },
    // COA Question (MCQ, PYQ 2021)
    {
      id: 'q_coa_1',
      subject_id: 'coa',
      topic_id: 'coa_pipelining',
      type: 'MCQ',
      marks: 2.0,
      difficulty: 'medium',
      question_text: 'A 5-stage pipeline has stage delays of 150 ps, 120 ps, 160 ps, 140 ps, and 110 ps. The pipeline register delay is 10 ps. What is the clock cycle time of this pipeline?',
      options: JSON.stringify(['160 ps', '170 ps', '180 ps', '690 ps']),
      correct_answer: 'B',
      explanation: 'The clock cycle of a pipeline is bounded by the bottleneck stage delay plus the pipeline register overhead: Clock cycle = max(stage delays) + register delay = 160 ps + 10 ps = 170 ps. Option B is correct.',
      is_pyq: 1,
      pyq_year: 2021,
      pyq_session: 'Set 2'
    },
    // TOC Question (MCQ, Tier 3 Light Touch)
    {
      id: 'q_toc_1',
      subject_id: 'toc',
      topic_id: 'toc_regular_languages',
      type: 'MCQ',
      marks: 1.0,
      difficulty: 'easy',
      question_text: 'Which of the following languages over alphabet {0, 1} is REGULAR?',
      options: JSON.stringify([
        'L = {0^n 1^n | n >= 1}',
        'L = {w w^R | w in {0, 1}*}',
        'L = {0^m 1^n | m >= 1, n >= 1}',
        'L = {0^p | p is prime}'
      ]),
      correct_answer: 'C',
      explanation: '0^m 1^n can be described by regular expression 00* 11* (or 0+ 1+) requiring no counting memory. All other options require unbounded stack memory or are non-context-free.',
      is_pyq: 1,
      pyq_year: 2023,
      pyq_session: 'Set 1'
    }
  ];

  const questionStmts = questions.map(q => ({
    sql: `INSERT INTO questions (id, subject_id, topic_id, type, marks, difficulty, question_text, options, correct_answer, explanation, is_pyq, pyq_year, pyq_session)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [q.id, q.subject_id, q.topic_id, q.type, q.marks, q.difficulty, q.question_text, q.options, q.correct_answer, q.explanation, q.is_pyq, q.pyq_year, q.pyq_session]
  }));
  await db.batch(questionStmts);

  // 5. High-Yield Flashcards (Fed into SM-2)
  const flashcards = [
    {
      id: 'fc_eigen_trace',
      subject_id: 'engg_math',
      topic_id: 'math_linear_algebra_eigen',
      front: 'What is the relationship between Eigenvalues, Trace, and Determinant of matrix A?',
      back: '1. Sum of Eigenvalues = Trace(A) (sum of main diagonal entries).\n2. Product of Eigenvalues = Det(A).',
      citation: 'Higher Engg Math (Grewal) Ch 2'
    },
    {
      id: 'fc_handshake_tree',
      subject_id: 'prog_ds',
      topic_id: 'ds_trees_bst',
      front: 'In any strictly binary tree, what is the formula connecting leaves (n0) and 2-degree nodes (n2)?',
      back: 'n0 = n2 + 1\n(Always one more leaf than internal nodes with 2 children)',
      citation: 'Karumanchi Ch 6'
    },
    {
      id: 'fc_bcnf_condition',
      subject_id: 'dbms',
      topic_id: 'dbms_normalization',
      front: 'What is the strict rule for a non-trivial FD X -> Y to be in BCNF?',
      back: 'X MUST be a Super Key of the relation. No exceptions.',
      citation: 'Silberschatz Ch 7'
    },
    {
      id: 'fc_cidr_usable',
      subject_id: 'cn',
      topic_id: 'cn_ip_subnetting',
      front: 'How many usable host IP addresses exist in a /28 subnet?',
      back: 'Host bits = 32 - 28 = 4.\nTotal = 2^4 = 16.\nUsable = 16 - 2 = 14 addresses (subtract Network ID and Broadcast).',
      citation: 'Kurose & Ross Ch 4'
    },
    {
      id: 'fc_amat_formula',
      subject_id: 'coa',
      topic_id: 'coa_cache_memory',
      front: 'What is the formula for Average Memory Access Time (AMAT) with cache hit ratio H?',
      back: 'AMAT = H * T_cache + (1 - H) * T_memory',
      citation: 'Morris Mano Ch 12'
    },
    {
      id: 'fc_tat_wt',
      subject_id: 'os',
      topic_id: 'os_cpu_scheduling',
      front: 'What are the formulas for Turnaround Time (TAT) and Waiting Time (WT)?',
      back: 'TAT = Completion Time - Arrival Time\nWT = TAT - Burst Time',
      citation: 'Silberschatz Galvin Ch 5'
    }
  ];

  const nowIso = new Date().toISOString();
  const flashcardStmts = flashcards.map(fc => ({
    sql: `INSERT INTO flashcards (id, subject_id, topic_id, front, back, citation)
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [fc.id, fc.subject_id, fc.topic_id, fc.front, fc.back, fc.citation]
  }));
  await db.batch(flashcardStmts);

  const srStmts = flashcards.map(fc => ({
    sql: `INSERT INTO spaced_repetition_cards (id, user_id, item_type, item_id, repetition, interval_days, ease_factor, due_date, last_reviewed_at, last_rating)
          VALUES (?, 'guest', 'flashcard', ?, 0, 0, 2.5, ?, null, null)
          ON CONFLICT(user_id, item_type, item_id) DO NOTHING`,
    args: [`sr_guest_${fc.id}`, fc.id, nowIso]
  }));
  await db.batch(srStmts);

  // 6. Default Study Settings
  const settingStmts = [
    { sql: 'INSERT INTO study_settings (key, user_id, value) VALUES (?, ?, ?)', args: ['target_exam_date', 'guest', '2027-02-06'] },
    { sql: 'INSERT INTO study_settings (key, user_id, value) VALUES (?, ?, ?)', args: ['target_cutoff', 'guest', '35.0'] },
    { sql: 'INSERT INTO study_settings (key, user_id, value) VALUES (?, ?, ?)', args: ['current_mode', 'guest', 'full'] },
    { sql: 'INSERT INTO study_settings (key, user_id, value) VALUES (?, ?, ?)', args: ['daily_target_lessons', 'guest', '1'] },
    { sql: 'INSERT INTO study_settings (key, user_id, value) VALUES (?, ?, ?)', args: ['daily_target_reviews', 'guest', '5'] },
    { sql: 'INSERT INTO study_settings (key, user_id, value) VALUES (?, ?, ?)', args: ['busy_periods', 'guest', JSON.stringify([{ start: '2026-11-15', end: '2026-12-05', label: 'Semester End Exams (Light Mode Suggested)' }])] },
  ];
  await db.batch(settingStmts);

  try {
    await seedAllLessons();
  } catch (err) {
    console.error('Error during seedAllLessons:', err.message);
  }

  console.log('Seeding completed successfully!');
}

module.exports = { seedDatabase };
