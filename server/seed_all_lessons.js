const { db } = require('./db');

const allLessons = [
  // 1. General Aptitude
  {
    id: 'lesson_apt_quant_arithmetic',
    topic_id: 'apt_quant_arithmetic',
    title: 'Percentages, Profit & Loss, and Ratio Proportions',
    citation: 'Quantitative Aptitude for Competitive Examinations (R.S. Aggarwal) Ch 10 - 12',
    content_markdown: `### Percentages, Profit & Loss, and Ratios (Aptitude High-Yield)

General Aptitude accounts for **15 marks** in GATE CSE. Questions in arithmetic are straightforward if you use multiplier ratios rather than long algebraic equations.

#### 1. Multiplier Method for Percentages
- A percentage increase of $x\\%$ corresponds to multiplying by $(1 + \\frac{x}{100})$.
  - Example: A $25\\%$ increase is multiplying by $1.25$ or $\\frac{5}{4}$.
- A percentage decrease of $x\\%$ corresponds to multiplying by $(1 - \\frac{x}{100})$.
  - Example: A $20\\%$ discount is multiplying by $0.80$ or $\\frac{4}{5}$.
- **Successive Changes**: If a value changes by $+a\\%$ and then $+b\\%$, net change is:
  $$\\text{Net Change} = a + b + \\frac{a \\cdot b}{100} \\quad (\\%)$$

#### 2. Profit and Loss Shortcuts
- $\\text{Cost Price (CP)}$ is always the $100\\%$ base.
- $\\text{Selling Price (SP)} = \\text{CP} \\times (1 + \\frac{P\\%}{100})$
- **Marked Price & Discount**:
  $$\\text{SP} = \\text{MP} \\times (1 - \\frac{D\\%}{100})$$
  $$\\frac{\\text{MP}}{\\text{CP}} = \\frac{100 + P\\%}{100 - D\\%}$$

#### 3. Ratios & Compounding
- If $A:B = 2:3$ and $B:C = 4:5$, make $B$ common:
  $$A:B = 8:12, \\quad B:C = 12:15 \\implies A:B:C = 8:12:15$$`,
    quick_check_questions: [
      {
        id: 'qc_apt_arith_1',
        question: 'If the price of petrol increases by 25%, by what percentage must a driver reduce consumption to keep total expenditure constant?',
        options: ['20%', '25%', '16.67%', '30%'],
        correct_index: 0,
        explanation: 'Price becomes 1.25 = 5/4. Consumption must become 4/5 = 0.80, which is a reduction of 1/5 = 20%.'
      },
      {
        id: 'qc_apt_arith_2',
        question: 'A shopkeeper marks an item 40% above cost price and allows a discount of 20%. What is his profit percentage?',
        options: ['12%', '15%', '20%', '24%'],
        correct_index: 0,
        explanation: 'Net change = a + b + (ab/100) = 40 - 20 - (40*20)/100 = 20 - 8 = 12% profit.'
      },
      {
        id: 'qc_apt_arith_3',
        question: 'If A:B = 3:4 and B:C = 8:9, what is A:C?',
        options: ['1:2', '2:3', '3:2', '4:3'],
        correct_index: 1,
        explanation: 'A/C = (A/B) * (B/C) = (3/4) * (8/9) = 24/36 = 2/3.'
      }
    ]
  },
  {
    id: 'lesson_apt_quant_tsd',
    topic_id: 'apt_quant_tsd',
    title: 'Time, Speed, Distance & Work Calculations',
    citation: 'Quantitative Aptitude (R.S. Aggarwal) Ch 17 & Ch 21',
    content_markdown: `### Time, Speed, Distance & Work

#### 1. Core Speed Relationships
$$\\text{Distance} = \\text{Speed} \\times \\text{Time}$$
$$\\text{Conversion: } 1 \\text{ km/h} = \\frac{5}{18} \\text{ m/s}, \\quad 1 \\text{ m/s} = \\frac{18}{5} \\text{ km/h}$$

- **Average Speed**:
  $$\\text{Average Speed} = \\frac{\\text{Total Distance}}{\\text{Total Time}}$$
  *If distances are equal for speeds $v_1$ and $v_2$, harmonic mean applies:*
  $$\\text{Avg Speed} = \\frac{2 v_1 v_2}{v_1 + v_2}$$

#### 2. Relative Speed
- Opposite directions: $v_{\\text{rel}} = v_1 + v_2$
- Same direction: $v_{\\text{rel}} = |v_1 - v_2|$

#### 3. Time & Work Invariants
- If worker $A$ takes $a$ days and $B$ takes $b$ days:
  $$\\text{Combined Time} = \\frac{a \\cdot b}{a + b} \\text{ days}$$`,
    quick_check_questions: [
      {
        id: 'qc_apt_tsd_1',
        question: 'A car travels from A to B at 60 km/h and returns from B to A at 40 km/h. What is the average speed for the round trip?',
        options: ['48 km/h', '50 km/h', '52 km/h', '45 km/h'],
        correct_index: 0,
        explanation: 'Average speed for equal distances = 2*v1*v2 / (v1 + v2) = (2 * 60 * 40) / 100 = 4800 / 100 = 48 km/h.'
      },
      {
        id: 'qc_apt_tsd_2',
        question: 'A pipe can fill a tank in 12 hours while another empties it in 18 hours. If both open together, how long to fill the tank?',
        options: ['24 hours', '30 hours', '36 hours', '48 hours'],
        correct_index: 2,
        explanation: 'Net rate = 1/12 - 1/18 = (3 - 2)/36 = 1/36. Thus it takes 36 hours.'
      },
      {
        id: 'qc_apt_tsd_3',
        question: 'Convert 72 km/h into m/s:',
        options: ['15 m/s', '20 m/s', '25 m/s', '30 m/s'],
        correct_index: 1,
        explanation: '72 * (5/18) = 4 * 5 = 20 m/s.'
      }
    ]
  },
  {
    id: 'lesson_apt_perm_prob',
    topic_id: 'apt_quant_perm_prob',
    title: 'Permutations, Combinations & Classical Probability',
    citation: 'Quantitative Aptitude (R.S. Aggarwal) Ch 30 & Ch 31',
    content_markdown: `### Permutations, Combinations & Probability

#### 1. Fundamental Principles
- **Product Rule (AND)**: If task 1 has $m$ ways and task 2 has $n$ ways, combined = $m \\times n$.
- **Sum Rule (OR)**: If mutually exclusive, combined = $m + n$.

#### 2. Permutations vs Combinations
- **Permutations (Order matters)**:
  $$P(n, r) = \\frac{n!}{(n - r)!}$$
- **Combinations (Selection only, order does not matter)**:
  $$C(n, r) = \\binom{n}{r} = \\frac{n!}{r!(n - r)!}$$

#### 3. Classical Probability
$$P(E) = \\frac{n(E)}{n(S)}$$
- Complement Rule: $P(E') = 1 - P(E)$
- Independent events: $P(A \\cap B) = P(A) \\cdot P(B)$`,
    quick_check_questions: [
      {
        id: 'qc_apt_pc_1',
        question: 'In how many ways can 5 people be arranged in a straight line?',
        options: ['24', '60', '120', '720'],
        correct_index: 2,
        explanation: '5! = 5 * 4 * 3 * 2 * 1 = 120 ways.'
      },
      {
        id: 'qc_apt_pc_2',
        question: 'How many different committees of 3 members can be selected from 6 candidates?',
        options: ['18', '20', '30', '120'],
        correct_index: 1,
        explanation: 'C(6, 3) = (6 * 5 * 4) / (3 * 2 * 1) = 20.'
      },
      {
        id: 'qc_apt_pc_3',
        question: 'Two dice are rolled simultaneously. What is the probability of getting a sum of 7?',
        options: ['1/6', '1/12', '5/36', '7/36'],
        correct_index: 0,
        explanation: 'Pairs giving sum 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) -> 6 outcomes. Total outcomes = 36. Probability = 6/36 = 1/6.'
      }
    ]
  },
  {
    id: 'lesson_apt_grammar',
    topic_id: 'apt_verbal_grammar',
    title: 'Grammar, Subject-Verb Agreement & Vocabulary',
    citation: 'High School English Grammar & Composition (Wren & Martin) Ch 15 - 18',
    content_markdown: `### Verbal Ability: Grammar & Sentence Correction

GATE verbal questions typically include 1–2 questions on subject-verb agreement, prepositions, and logical sentence completion.

#### 1. Crucial Subject-Verb Agreement Rules
1. **Intervening prepositional phrases** do not affect the verb:
   - *The quality of these mangoes **is** (not are) good.*
2. **Neither / Either / Each / Everyone** takes a singular verb:
   - *Neither of the two candidates **has** received an offer.*
3. When subjects are joined by *either... or* or *neither... nor*, the verb agrees with the **nearest subject**:
   - *Neither the teacher nor the students **were** present.*
   - *Neither the students nor the teacher **was** present.*
4. Words joined with *as well as, along with, in addition to* follow the **first subject**:
   - *The principal, along with the staff, **is** attending.*`,
    quick_check_questions: [
      {
        id: 'qc_apt_v_1',
        question: 'Select the grammatically correct sentence:',
        options: [
          'The group of students were very enthusiastic.',
          'The group of students was very enthusiastic.',
          'The group of students are very enthusiastic.',
          'The group of students have been enthusiastic.'
        ],
        correct_index: 1,
        explanation: 'The subject is the collective noun "group" (singular), so the singular verb "was" is required.'
      },
      {
        id: 'qc_apt_v_2',
        question: 'Neither the manager nor his employees _______ aware of the security breach.',
        options: ['was', 'were', 'is', 'has been'],
        correct_index: 1,
        explanation: 'In "neither... nor", the verb agrees with the closer subject "his employees" (plural), so "were" is correct.'
      },
      {
        id: 'qc_apt_v_3',
        question: 'Choose the antonym of "EPHEMERAL":',
        options: ['Transient', 'Fleeting', 'Permanent', 'Short-lived'],
        correct_index: 2,
        explanation: 'Ephemeral means lasting for a very short time. Its antonym is permanent.'
      }
    ]
  },
  {
    id: 'lesson_apt_analytical',
    topic_id: 'apt_analytical_reasoning',
    title: 'Analytical Reasoning & Logical Deductions',
    citation: 'A Modern Approach to Verbal & Non-Verbal Reasoning (R.S. Aggarwal) Ch 4 - 6',
    content_markdown: `### Analytical & Logical Reasoning

Analytical questions test your ability to structure facts into tables or Venn diagrams.

#### 1. Syllogisms & Venn Diagrams
- **All A are B**: Circle A is completely inside circle B ($A \\subseteq B$).
- **Some A are B**: Circles A and B overlap ($A \\cap B \\neq \\emptyset$).
- **No A are B**: Circles A and B are completely disjoint ($A \\cap B = \\emptyset$).

#### 2. Deduction Strategy
1. Avoid real-world assumptions; follow strictly what the premises state.
2. A conclusion is valid **if and only if** it holds true in *all* possible Venn diagram configurations.`,
    quick_check_questions: [
      {
        id: 'qc_apt_ana_1',
        question: 'Premises: All cats are animals. All animals are living beings. Conclusion: All cats are living beings.',
        options: ['Valid conclusion', 'Invalid conclusion', 'Cannot be determined', 'True only if cats exist'],
        correct_index: 0,
        explanation: 'By transitivity of subsets: Cats ⊆ Animals ⊆ Living Beings => Cats ⊆ Living Beings. Valid!'
      },
      {
        id: 'qc_apt_ana_2',
        question: 'If "Some doctors are painters" and "All painters are musicians", which conclusion is DEFINITELY TRUE?',
        options: [
          'All doctors are musicians',
          'Some doctors are musicians',
          'No doctors are musicians',
          'All musicians are doctors'
        ],
        correct_index: 1,
        explanation: 'The doctors that are painters are also musicians. Hence, some doctors are definitely musicians.'
      },
      {
        id: 'qc_apt_ana_3',
        question: 'In a class of 50 students, 30 like tea, 25 like coffee, and 10 like both. How many like neither?',
        options: ['5', '10', '15', '20'],
        correct_index: 0,
        explanation: 'n(T ∪ C) = n(T) + n(C) - n(T ∩ C) = 30 + 25 - 10 = 45. Neither = 50 - 45 = 5 students.'
      }
    ]
  },

  // 2. Engineering Mathematics
  {
    id: 'lesson_math_logic',
    topic_id: 'math_discrete_logic',
    title: 'Propositional & First-Order Predicate Logic',
    citation: 'Discrete Mathematics and Its Applications (Kenneth Rosen) Ch 1.1 - 1.4',
    content_markdown: `### Propositional & First-Order Predicate Logic

Guaranteed 2-3 marks in GATE Engineering Math.

#### 1. Truth Table Rules
- Implication: $p \\to q \\equiv \\neg p \\lor q$
  *Only FALSE when $p$ is TRUE and $q$ is FALSE.*
- Biconditional: $p \\leftrightarrow q \\equiv (p \\to q) \\land (q \\to p)$
- Contrapositive: The contrapositive of $p \\to q$ is $\\neg q \\to \\neg p$, and they are **logically equivalent**!

#### 2. De Morgan's Laws & Quantifiers
$$\\neg (p \\land q) \\equiv \\neg p \\lor \\neg q$$
$$\\neg (p \\lor q) \\equiv \\neg p \\land \\neg q$$
$$\\neg (\\forall x P(x)) \\equiv \\exists x \\neg P(x)$$
$$\\neg (\\exists x P(x)) \\equiv \\forall x \\neg P(x)$$

#### 3. Validity & Satisfiability
- **Tautology**: True under all interpretations.
- **Contradiction**: False under all interpretations.
- **Contingency**: True for some, false for others.`,
    quick_check_questions: [
      {
        id: 'qc_math_log_1',
        question: 'Which of the following is logically equivalent to the implication p -> q?',
        options: ['q -> p', '¬p -> ¬q', '¬q -> ¬p', 'p ∧ ¬q'],
        correct_index: 2,
        explanation: 'The contrapositive of p -> q is ¬q -> ¬p, which is always logically equivalent.'
      },
      {
        id: 'qc_math_log_2',
        question: 'What is the negation of the statement: "Every student in the class passed the exam"?',
        options: [
          'Every student failed the exam.',
          'No student passed the exam.',
          'There is at least one student who failed the exam.',
          'Most students failed the exam.'
        ],
        correct_index: 2,
        explanation: '¬(∀x P(x)) ≡ ∃x ¬P(x): There exists at least one student who did not pass.'
      },
      {
        id: 'qc_math_log_3',
        question: 'Under what condition is the proposition p -> q evaluated to FALSE?',
        options: ['p is F, q is T', 'p is F, q is F', 'p is T, q is F', 'p is T, q is T'],
        correct_index: 2,
        explanation: 'An implication is false only when the hypothesis is true and the conclusion is false.'
      }
    ]
  },
  {
    id: 'lesson_math_graphs',
    topic_id: 'math_discrete_graphs',
    title: 'Graph Theory: Degrees, Trees & Euler Paths',
    citation: 'Discrete Mathematics and Its Applications (Kenneth Rosen) Ch 10.1 - 10.5',
    content_markdown: `### Graph Theory Fundamentals

#### 1. Handshaking Theorem
In any undirected graph $G = (V, E)$:
$$\\sum_{v \\in V} \\deg(v) = 2 |E|$$
**Immediate Corollary**: The number of vertices of odd degree in any graph is always **EVEN**.

#### 2. Trees Invariants
A tree with $n$ vertices:
- Has exactly $n - 1$ edges.
- Is minimally connected (removing any edge disconnects it).
- Is maximally acyclic (adding any edge creates a unique cycle).

#### 3. Euler vs Hamiltonian Graphs
- **Eulerian Circuit** (traverses every *edge* exactly once and returns):
  *A connected graph has an Eulerian circuit if and only if **every vertex has an EVEN degree**.*
- **Eulerian Path**:
  *Exists if and only if **exactly 0 or 2 vertices have odd degree**.*`,
    quick_check_questions: [
      {
        id: 'qc_math_gr_1',
        question: 'An undirected graph has 10 vertices each of degree 3. How many edges does the graph have?',
        options: ['15', '30', '10', '20'],
        correct_index: 0,
        explanation: 'By Handshaking Theorem: 2*E = sum(deg) = 10 * 3 = 30 => E = 15.'
      },
      {
        id: 'qc_math_gr_2',
        question: 'How many edges are there in a tree with 28 vertices?',
        options: ['27', '28', '29', '54'],
        correct_index: 0,
        explanation: 'In any tree with n vertices, number of edges is always n - 1 = 28 - 1 = 27.'
      },
      {
        id: 'qc_math_gr_3',
        question: 'A connected graph has an Euler circuit if and only if:',
        options: [
          'All vertices have odd degree',
          'All vertices have even degree',
          'Exactly two vertices have odd degree',
          'The graph is bipartite'
        ],
        correct_index: 1,
        explanation: 'Euler circuit requires every vertex to have an even degree so every entry has an exit.'
      }
    ]
  },
  {
    id: 'lesson_math_calc',
    topic_id: 'math_calculus_limits',
    title: 'Calculus: Limits, Continuity & Maxima/Minima',
    citation: 'Higher Engineering Mathematics (B.S. Grewal) Ch 3 & Ch 4',
    content_markdown: `### Calculus: Limits, L'Hôpital's Rule & Extrema

#### 1. L'Hôpital's Rule
When evaluating $\\lim_{x \\to a} \\frac{f(x)}{g(x)}$ producing indeterminate forms $\\frac{0}{0}$ or $\\frac{\\infty}{\\infty}$:
$$\\lim_{x \\to a} \\frac{f(x)}{g(x)} = \\lim_{x \\to a} \\frac{f'(x)}{g'(x)}$$

#### 2. Maxima and Minima Test
For a differentiable function $f(x)$:
1. Find critical points by setting $f'(x) = 0$.
2. Second derivative test at critical point $c$:
   - If $f''(c) < 0 \\implies$ **Local Maximum**.
   - If $f''(c) > 0 \\implies$ **Local Minimum**.
   - If $f''(c) = 0 \\implies$ Inconclusive (inflection point candidate).`,
    quick_check_questions: [
      {
        id: 'qc_calc_1',
        question: 'Evaluate lim (x -> 0) of sin(3x) / x:',
        options: ['0', '1', '3', 'Does not exist'],
        correct_index: 2,
        explanation: 'Using L\'Hopital or standard limit: lim (x->0) [3*cos(3x) / 1] = 3*1 = 3.'
      },
      {
        id: 'qc_calc_2',
        question: 'At a critical point x = c, if f\'(c) = 0 and f\'\'(c) = -6, what occurs at c?',
        options: ['Local minimum', 'Local maximum', 'Point of inflection', 'Discontinuity'],
        correct_index: 1,
        explanation: 'When f\'\'(c) < 0, the curve is concave down, corresponding to a local maximum.'
      },
      {
        id: 'qc_calc_3',
        question: 'What is the derivative of f(x) = x * ln(x)?',
        options: ['1 / x', 'ln(x) + 1', 'x + ln(x)', '1 + x'],
        correct_index: 1,
        explanation: 'By product rule: (1)*ln(x) + x*(1/x) = ln(x) + 1.'
      }
    ]
  },
  {
    id: 'lesson_math_bayes',
    topic_id: 'math_prob_bayes',
    title: 'Conditional Probability & Bayes\' Theorem',
    citation: 'Higher Engineering Mathematics (B.S. Grewal) Ch 26 / Kreyszig Ch 24',
    content_markdown: `### Conditional Probability & Bayes' Theorem

#### 1. Conditional Probability
$$P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}$$

#### 2. Total Probability Theorem
If events $B_1, B_2, \\dots, B_k$ partition the sample space $S$:
$$P(A) = \\sum_{i=1}^k P(A \\mid B_i) P(B_i)$$

#### 3. Bayes' Theorem
Calculates the posterior probability of cause $B_j$ given observed effect $A$:
$$P(B_j \\mid A) = \\frac{P(A \\mid B_j) P(B_j)}{\\sum_{i=1}^k P(A \\mid B_i) P(B_i)}$$`,
    quick_check_questions: [
      {
        id: 'qc_bayes_1',
        question: 'If P(A) = 0.5, P(B) = 0.4, and P(A ∩ B) = 0.2, what is P(A | B)?',
        options: ['0.25', '0.40', '0.50', '0.80'],
        correct_index: 2,
        explanation: 'P(A | B) = P(A ∩ B) / P(B) = 0.2 / 0.4 = 0.50.'
      },
      {
        id: 'qc_bayes_2',
        question: 'If events A and B are independent, what is P(A | B)?',
        options: ['P(B)', 'P(A)', 'P(A) * P(B)', '0'],
        correct_index: 1,
        explanation: 'For independent events, occurrence of B does not alter probability of A, so P(A | B) = P(A).'
      },
      {
        id: 'qc_bayes_3',
        question: 'Machine A produces 60% of items (1% defective) and Machine B produces 40% (2% defective). What is total probability of a defective item?',
        options: ['0.014', '0.015', '0.018', '0.020'],
        correct_index: 0,
        explanation: 'Total P(D) = (0.60 * 0.01) + (0.40 * 0.02) = 0.006 + 0.008 = 0.014.'
      }
    ]
  },

  // 3. Digital Logic
  {
    id: 'lesson_dl_numbers',
    topic_id: 'dl_number_systems',
    title: 'Number Systems & 2\'s Complement Arithmetic',
    citation: 'Digital Logic and Computer Design (M. Morris Mano) Ch 1',
    content_markdown: `### Number Systems & 2's Complement Representation

#### 1. Range of Signed Numbers in $n$ Bits
- **Sign-Magnitude**: $-(2^{n-1} - 1)$ to $+(2^{n-1} - 1)$
- **1's Complement**: $-(2^{n-1} - 1)$ to $+(2^{n-1} - 1)$
- **2's Complement**: $-2^{n-1}$ to $+(2^{n-1} - 1)$
  *Notice 2's complement has NO negative zero and has one extra negative number!*

#### 2. Quick 2's Complement Rule
Starting from the Least Significant Bit (LSB):
1. Keep all zeros and the first '1' unchanged.
2. Invert all subsequent bits to the left!
- Example: $2$'s complement of $0101100$:
  *First 1 is at pos 2 -> keep "100", invert "0101" to "1010" -> $1010100$.*`,
    quick_check_questions: [
      {
        id: 'qc_dl_num_1',
        question: 'What is the range of integers representable in 8-bit 2\'s complement form?',
        options: ['-128 to +127', '-127 to +127', '-256 to +255', '-128 to +128'],
        correct_index: 0,
        explanation: 'For n = 8 bits: -2^(8-1) to +(2^(8-1) - 1) = -128 to +127.'
      },
      {
        id: 'qc_dl_num_2',
        question: 'What is the 8-bit 2\'s complement representation of the decimal number -5?',
        options: ['11111010', '11111011', '10000101', '11111101'],
        correct_index: 1,
        explanation: '+5 in 8 bits is 00000101. 1\'s complement is 11111010. Adding 1 gives 11111011.'
      },
      {
        id: 'qc_dl_num_3',
        question: 'How many distinct representations of zero exist in 2\'s complement?',
        options: ['1', '2', '3', '0'],
        correct_index: 0,
        explanation: '2\'s complement has only a single unique representation for zero (all 0s).'
      }
    ]
  },
  {
    id: 'lesson_dl_kmaps',
    topic_id: 'dl_kmaps_boolean',
    title: 'Boolean Algebra & K-Map Minimization',
    citation: 'Digital Logic and Computer Design (M. Morris Mano) Ch 2 & Ch 3',
    content_markdown: `### Boolean Algebra & Karnaugh Maps (K-Maps)

#### 1. Crucial Boolean Properties
- Involution: $(A')' = A$
- Absorption: $A + AB = A$, $A(A + B) = A$
- Redundancy Rule (Consensus Theorem):
  $$AB + A'C + BC = AB + A'C$$
  *(The term $BC$ is redundant and can be dropped!)*

#### 2. K-Map Grouping Rules
- Group sizes must be powers of 2 ($1, 2, 4, 8, 16$).
- Always prioritize largest possible groups to eliminate the maximum number of variables.
- Don't care conditions ($d$ or $X$) can be treated as 1 if they help make a larger group, or 0 if they don't.`,
    quick_check_questions: [
      {
        id: 'qc_dl_km_1',
        question: 'Simplify the Boolean expression: A + A\'B',
        options: ['A', 'B', 'A + B', 'AB'],
        correct_index: 2,
        explanation: 'A + A\'B = (A + A\')(A + B) = 1 * (A + B) = A + B.'
      },
      {
        id: 'qc_dl_km_2',
        question: 'In a 4-variable K-map, grouping 8 adjacent minterms eliminates how many variables?',
        options: ['1', '2', '3', '4'],
        correct_index: 2,
        explanation: 'Number of eliminated variables = log2(group size) = log2(8) = 3 variables.'
      },
      {
        id: 'qc_dl_km_3',
        question: 'What is the dual of the Boolean expression A + B\'C?',
        options: ['A * (B\' + C)', 'A\' * (B + C\')', 'A + B + C', 'A\'B\'C'],
        correct_index: 0,
        explanation: 'To obtain the dual, swap AND with OR (+ with *) and keep literals unchanged: A * (B\' + C).'
      }
    ]
  },
  {
    id: 'lesson_dl_mux',
    topic_id: 'dl_combinational_mux',
    title: 'Multiplexers, Decoders & Arithmetic Circuits',
    citation: 'Digital Logic and Computer Design (M. Morris Mano) Ch 4',
    content_markdown: `### Multiplexers & Decoders (Combinational Circuits)

#### 1. Multiplexers (Data Selectors)
A $2^n \\times 1$ MUX has $2^n$ data input lines, $n$ select lines, and 1 output line.
- Any Boolean function of $n$ variables can be implemented using a $2^{n-1} \\times 1$ MUX without extra logic gates by connecting one variable to inputs.

#### 2. Decoders
An $n \\times 2^n$ decoder produces all $2^n$ minterms of its $n$ input variables.
- Any function expressed in canonical Sum-of-Minterms (SOP) can be implemented by connecting the corresponding minterm outputs of a decoder to an OR gate.`,
    quick_check_questions: [
      {
        id: 'qc_dl_mx_1',
        question: 'How many select lines are required for an 8-to-1 Multiplexer?',
        options: ['2', '3', '4', '8'],
        correct_index: 1,
        explanation: 'Number of select lines s = log2(inputs) = log2(8) = 3.'
      },
      {
        id: 'qc_dl_mx_2',
        question: 'How many 2-to-1 MUXes are needed to build a 16-to-1 MUX?',
        options: ['8', '15', '16', '31'],
        correct_index: 1,
        explanation: 'Tree construction: 8 + 4 + 2 + 1 = 15 MUXes.'
      },
      {
        id: 'qc_dl_mx_3',
        question: 'A full adder requires which minimum components?',
        options: [
          'Two half adders and one OR gate',
          'Two half adders and one AND gate',
          'One half adder and two OR gates',
          'Three half adders'
        ],
        correct_index: 0,
        explanation: 'A full adder can be constructed from two half adders and one OR gate to combine the carry terms.'
      }
    ]
  },
  {
    id: 'lesson_dl_sequential',
    topic_id: 'dl_sequential_flipflops',
    title: 'Flip-Flops, Registers & Counter Calculations',
    citation: 'Digital Logic and Computer Design (M. Morris Mano) Ch 5 & Ch 6',
    content_markdown: `### Sequential Logic & Flip-Flops

#### 1. Characteristic Equations
- **SR Flip-Flop**: $Q_{next} = S + R'Q$ (with constraint $S \\cdot R = 0$)
- **JK Flip-Flop**: $Q_{next} = JQ' + K'Q$ (solves $S=R=1$ race condition by toggling)
- **D Flip-Flop**: $Q_{next} = D$ (transparent delay)
- **T Flip-Flop**: $Q_{next} = T \\oplus Q$ (toggle when $T=1$)

#### 2. Counters & Modulus
- A counter built from $n$ flip-flops has maximum modulus $2^n$ ($2^n$ unique states).
- To count up to number $N$, minimum flip-flops required is $\\lceil \\log_2 N \\rceil$.`,
    quick_check_questions: [
      {
        id: 'qc_dl_seq_1',
        question: 'What is the next state of a JK flip-flop when J = 1 and K = 1?',
        options: ['0', '1', 'Q\' (Toggle)', 'Indeterminate'],
        correct_index: 2,
        explanation: 'When J=1 and K=1, Q_next = JQ\' + K\'Q = Q\' + 0 = Q\'. The state toggles.'
      },
      {
        id: 'qc_dl_seq_2',
        question: 'What is the minimum number of flip-flops required to design a MOD-12 counter?',
        options: ['3', '4', '6', '12'],
        correct_index: 1,
        explanation: '2^(n-1) < N <= 2^n. For N = 12: 2^3 = 8 < 12 <= 2^4 = 16. Hence 4 flip-flops are needed.'
      },
      {
        id: 'qc_dl_seq_3',
        question: 'How is a T flip-flop obtained from a JK flip-flop?',
        options: ['Connecting J and K together as T', 'Connecting J=T and K=0', 'Inverting K', 'Grounding J'],
        correct_index: 0,
        explanation: 'Connecting J and K together produces a T flip-flop: when T=0, J=K=0 (hold); when T=1, J=K=1 (toggle).'
      }
    ]
  },

  // 4. DBMS
  {
    id: 'lesson_dbms_keys',
    topic_id: 'dbms_relational_keys',
    title: 'Relational Model, Candidate Keys & Super Keys',
    citation: 'Database System Concepts (Silberschatz, Korth, Sudarshan) Ch 2 & Ch 6',
    content_markdown: `### Relational Keys & Attribute Closures

#### 1. Definitions
- **Super Key**: Any set of attributes whose closure determines all attributes in the relation.
- **Candidate Key**: A **minimal** super key (no proper subset is a super key).
- **Primary Key**: One candidate key chosen by the database designer.
- **Foreign Key**: An attribute referencing a candidate/primary key of another relation.`,
    quick_check_questions: [
      {
        id: 'qc_dbms_k_1',
        question: 'Can a candidate key contain redundant attributes?',
        options: ['Yes', 'No, by definition it is minimal', 'Only in 1NF', 'Only if foreign key'],
        correct_index: 1,
        explanation: 'A candidate key is defined as a minimal super key; removing any attribute destroys its uniqueness.'
      },
      {
        id: 'qc_dbms_k_2',
        question: 'In relation R(A, B, C) with FD: A -> B, B -> C, what is the candidate key?',
        options: ['A', 'B', 'C', 'AB'],
        correct_index: 0,
        explanation: '(A)+ = {A, B, C}. Since A derives all attributes and is minimal, A is the candidate key.'
      },
      {
        id: 'qc_dbms_k_3',
        question: 'What is the maximum number of primary keys a relation can have?',
        options: ['1', '2', 'Equal to number of candidate keys', 'Unlimited'],
        correct_index: 0,
        explanation: 'A relation can have multiple candidate keys, but exactly one is chosen as the Primary Key.'
      }
    ]
  },
  {
    id: 'lesson_dbms_sql',
    topic_id: 'dbms_sql_rel_algebra',
    title: 'SQL Queries, Joins & Relational Algebra Operators',
    citation: 'Database System Concepts (Silberschatz, Korth, Sudarshan) Ch 3 & Ch 6',
    content_markdown: `### Relational Algebra & SQL Joins

#### 1. Basic Operators
- Selection ($\\sigma_p$): Horizontal filtering of tuples.
- Projection ($\\pi_L$): Vertical selection of columns (eliminates duplicates).
- Cartesian Product ($\\times$): Combines each tuple of $R$ with every tuple of $S$.
- Natural Join ($\\bowtie$): Equi-join over common attributes followed by projection.

#### 2. SQL Group By & Having Rules
- Any attribute in the \`SELECT\` clause that is NOT an aggregate function **must appear in the \`GROUP BY\` clause**.
- \`WHERE\` filters rows *before* grouping; \`HAVING\` filters groups *after* aggregation.`,
    quick_check_questions: [
      {
        id: 'qc_dbms_sql_1',
        question: 'Which clause is used in SQL to filter grouped records after aggregation?',
        options: ['WHERE', 'HAVING', 'ORDER BY', 'GROUP BY'],
        correct_index: 1,
        explanation: 'HAVING filters aggregated groups, whereas WHERE filters individual rows prior to grouping.'
      },
      {
        id: 'qc_dbms_sql_2',
        question: 'If relation R has 4 tuples and relation S has 5 tuples, how many tuples does R × S have?',
        options: ['9', '20', '1', '4'],
        correct_index: 1,
        explanation: 'The Cartesian product contains |R| * |S| = 4 * 5 = 20 tuples.'
      },
      {
        id: 'qc_dbms_sql_3',
        question: 'Which relational algebra operator selects specific columns from a relation?',
        options: ['Selection (σ)', 'Projection (π)', 'Join (⋈)', 'Rename (ρ)'],
        correct_index: 1,
        explanation: 'Projection (π) selects columns vertically.'
      }
    ]
  },
  {
    id: 'lesson_dbms_acid',
    topic_id: 'dbms_transactions_acid',
    title: 'Transactions, ACID Properties & Serializability',
    citation: 'Database System Concepts (Silberschatz, Korth, Sudarshan) Ch 14 & Ch 15',
    content_markdown: `### Transactions & Conflict Serializability

#### 1. ACID Properties
- **Atomicity**: All or nothing (managed by Transaction Manager via log recovery).
- **Consistency**: Preserves database integrity constraints.
- **Isolation**: Concurrent executions don't interfere (Concurrency Control).
- **Durability**: Committed changes persist even after system crashes.

#### 2. Conflict Serializability Test
Two operations conflict if they:
1. Belong to different transactions.
2. Access the same data item.
3. At least one is a **WRITE** operation.

**Precedence Graph Algorithm**:
- Draw directed edge $T_i \\to T_j$ if an operation of $T_i$ conflicts with and precedes an operation of $T_j$.
- If the graph has **NO CYCLES**, the schedule is **Conflict Serializable**!`,
    quick_check_questions: [
      {
        id: 'qc_dbms_tx_1',
        question: 'Which property guarantees that all operations of a transaction complete or none do?',
        options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
        correct_index: 0,
        explanation: 'Atomicity ensures all-or-nothing execution.'
      },
      {
        id: 'qc_dbms_tx_2',
        question: 'A schedule is conflict serializable if and only if its precedence graph:',
        options: ['Is connected', 'Is acyclic', 'Has a Hamiltonian cycle', 'Is complete'],
        correct_index: 1,
        explanation: 'A cycle in the precedence graph indicates conflicting dependencies that cannot be topologically sorted.'
      },
      {
        id: 'qc_dbms_tx_3',
        question: 'Which of the following operation pairs on the same item X conflicts?',
        options: [
          'Read(X) and Read(X)',
          'Read(X) and Write(X)',
          'Commit and Read(X)',
          'Abort and Read(X)'
        ],
        correct_index: 1,
        explanation: 'Read and Write on the same item from different transactions constitute a conflict.'
      }
    ]
  },
  {
    id: 'lesson_dbms_indexing',
    topic_id: 'dbms_indexing_btrees',
    title: 'Indexing & B / B+ Tree Fundamentals',
    citation: 'Database System Concepts (Silberschatz, Korth, Sudarshan) Ch 11',
    content_markdown: `### Indexing & B+ Trees

#### 1. Index Types
- **Primary Index**: Ordered by primary key on a sorted data file.
- **Clustering Index**: Ordered by non-key field on a sorted data file.
- **Secondary Index**: Created on an unsorted data file.

#### 2. B+ Tree Properties (Order $p$)
- All data records/pointers reside **strictly in the leaf nodes**.
- All leaf nodes are linked together as a singly or doubly linked list for fast range queries.
- All leaf nodes are at the **exact same depth** (perfectly balanced).
- Maximum keys in a node of order $p$: $p - 1$.
- Minimum keys in an internal node: $\\lceil p/2 \\rceil - 1$.`,
    quick_check_questions: [
      {
        id: 'qc_dbms_idx_1',
        question: 'Where are the actual record pointers stored in a B+ tree?',
        options: ['In all nodes', 'Only in root', 'Exclusively in leaf nodes', 'In internal nodes'],
        correct_index: 2,
        explanation: 'In a B+ tree, data pointers are exclusively stored in the leaves, allowing internal nodes to store more search keys.'
      },
      {
        id: 'qc_dbms_idx_2',
        question: 'What is the maximum number of keys in a B-tree node of order 5?',
        options: ['4', '5', '6', '10'],
        correct_index: 0,
        explanation: 'A node of order p can hold at most p - 1 keys = 5 - 1 = 4 keys.'
      },
      {
        id: 'qc_dbms_idx_3',
        question: 'What makes B+ trees superior to B trees for range queries (e.g. BETWEEN 20 AND 50)?',
        options: [
          'Fewer leaf nodes',
          'Leaf nodes are linked in a sequential list',
          'Smaller tree height only',
          'Better hashing'
        ],
        correct_index: 1,
        explanation: 'Leaves form a linked list, enabling sequential traversal without re-traversing the tree.'
      }
    ]
  },

  // 5. Programming & Data Structures
  {
    id: 'lesson_prog_c',
    topic_id: 'prog_c_fundamentals',
    title: 'C Pointers, Arrays & Parameter Passing',
    citation: 'The C Programming Language (Kernighan & Ritchie) Ch 5',
    content_markdown: `### C Pointers & Array Arithmetic

#### 1. Pointer Arithmetic
If \`p\` is a pointer of type \`T*\`:
$$\\text{Value of } (p + k) = \\text{Address}(p) + k \\times \\text{sizeof}(T)$$

#### 2. Array Names as Pointers
- \`a[i]\` is syntactically equivalent to \`*(a + i)\` and \`i[a]\`!
- \`&a\` is the address of the entire array (type \`int (*)[N]\`).
- \`a\` decays to pointer to first element (type \`int*\`).`,
    quick_check_questions: [
      {
        id: 'qc_prog_c_1',
        question: 'In C, what is the value of 2[a] if a[] = {5, 10, 15, 20}?',
        options: ['Compilation error', '10', '15', '20'],
        correct_index: 2,
        explanation: '2[a] is identical to *(2 + a) = *(a + 2) = a[2] = 15.'
      },
      {
        id: 'qc_prog_c_2',
        question: 'What is printed by: int x = 10; int *p = &x; (*p)++; printf("%d", x);?',
        options: ['10', '11', 'Address of x', 'Undefined'],
        correct_index: 1,
        explanation: '(*p)++ dereferences p and increments the value of x directly from 10 to 11.'
      },
      {
        id: 'qc_prog_c_3',
        question: 'In C, how are function arguments passed by default?',
        options: ['Pass by reference', 'Pass by value', 'Pass by name', 'Pass by pointer'],
        correct_index: 1,
        explanation: 'C always uses pass-by-value. Pointers simulate pass-by-reference by passing pointer values.'
      }
    ]
  },
  {
    id: 'lesson_ds_asymptotics',
    topic_id: 'ds_complexity_asymptotics',
    title: 'Asymptotic Notations & Recurrence Relations',
    citation: 'Data Structures and Algorithms Made Easy (Narasimha Karumanchi) Ch 2',
    content_markdown: `### Asymptotic Complexity & Master Theorem

#### 1. Notations
- $O(g(n))$: Upper bound (asymptotic worst case)
- $\\Omega(g(n))$: Lower bound (asymptotic best case)
- $\\Theta(g(n))$: Tight bound ($f(n)$ is both $O(g(n))$ and $\\Omega(g(n))$)

#### 2. Master Theorem for Divide-and-Conquer
$$T(n) = a T(n/b) + \\Theta(n^k \\log^p n)$$
Compare $a$ with $b^k$:
1. If $a > b^k \\implies T(n) = \\Theta(n^{\\log_b a})$
2. If $a = b^k$:
   - If $p > -1 \\implies T(n) = \\Theta(n^{\\log_b a} \\log^{p+1} n)$
3. If $a < b^k \\implies T(n) = \\Theta(n^k \\log^p n)$`,
    quick_check_questions: [
      {
        id: 'qc_ds_asym_1',
        question: 'What is the solution to recurrence T(n) = 2T(n/2) + O(n)?',
        options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
        correct_index: 1,
        explanation: 'a = 2, b = 2, k = 1. a = b^k (2 = 2^1). Case 2 of Master Theorem gives Θ(n log n).'
      },
      {
        id: 'qc_ds_asym_2',
        question: 'Which of the following growth rates is the FASTEST asymptotically?',
        options: ['O(n²)', 'O(n log n)', 'O(2ⁿ)', 'O(n³)', ],
        correct_index: 2,
        explanation: 'Exponential growth O(2^n) dominates all polynomial growth rates.'
      },
      {
        id: 'qc_ds_asym_3',
        question: 'If f(n) = Θ(g(n)), which of the following MUST hold?',
        options: ['f(n) = O(g(n)) only', 'f(n) = Ω(g(n)) only', 'Both f(n) = O(g(n)) and f(n) = Ω(g(n))', 'f(n) = o(g(n))'],
        correct_index: 2,
        explanation: 'By definition of theta (tight bound), f(n) is bounded both above and below.'
      }
    ]
  },
  {
    id: 'lesson_ds_stacks',
    topic_id: 'ds_stacks_queues',
    title: 'Stacks, Queues & Infix to Postfix Conversion',
    citation: 'Data Structures and Algorithms Made Easy (Narasimha Karumanchi) Ch 4 & Ch 5',
    content_markdown: `### Stacks & Queues

#### 1. Stacks (LIFO)
- Applications: Function call stack, recursion, undo mechanisms, parenthesis balance, expression evaluation.
- **Infix to Postfix**: Operators are pushed to stack and popped when an operator of lower or equal precedence arrives.

#### 2. Queues (FIFO)
- Queue implemented with array: requires **Circular Queue** to prevent false overflow.
  $$\\text{next} = (\\text{rear} + 1) \\% N$$
- A queue can be implemented using **two stacks** with $O(1)$ amortized cost.`,
    quick_check_questions: [
      {
        id: 'qc_ds_stk_1',
        question: 'What is the postfix evaluation of the expression: 6 3 2 + * 5 - ?',
        options: ['25', '30', '35', '40'],
        correct_index: 0,
        explanation: '6, 3, 2: 3+2=5. Stack: 6, 5. *: 6*5=30. Stack: 30. 5: Stack 30, 5. -: 30 - 5 = 25.'
      },
      {
        id: 'qc_ds_stk_2',
        question: 'What is the minimum number of queues needed to implement a stack?',
        options: ['1', '2', '3', 'Cannot be done'],
        correct_index: 1,
        explanation: 'Two queues are needed to simulate LIFO behavior using FIFO queues.'
      },
      {
        id: 'qc_ds_stk_3',
        question: 'Which data structure is used to implement Breadth-First Search (BFS) on a graph?',
        options: ['Stack', 'Queue', 'Heap', 'Binary Search Tree'],
        correct_index: 1,
        explanation: 'BFS explores vertices level-by-level, which requires a FIFO Queue.'
      }
    ]
  },
  {
    id: 'lesson_ds_hashing',
    topic_id: 'ds_hashing',
    title: 'Hash Tables & Collision Resolution Techniques',
    citation: 'Data Structures and Algorithms Made Easy (Narasimha Karumanchi) Ch 14',
    content_markdown: `### Hashing & Collision Resolution

#### 1. Collision Resolution
1. **Separate Chaining**: Keys are placed into linked lists at each bucket. Worst case search $O(n)$, average $O(1 + \\alpha)$ where load factor $\\alpha = n/m$.
2. **Open Addressing**:
   - **Linear Probing**: $h(k, i) = (h(k) + i) \\% m$. Suffers from **Primary Clustering**.
   - **Quadratic Probing**: $h(k, i) = (h(k) + c_1 i + c_2 i^2) \\% m$. Suffers from Secondary Clustering.
   - **Double Hashing**: $h(k, i) = (h_1(k) + i \\cdot h_2(k)) \\% m$. Best open addressing performance.`,
    quick_check_questions: [
      {
        id: 'qc_ds_hsh_1',
        question: 'Which collision resolution method suffers from primary clustering?',
        options: ['Separate Chaining', 'Linear Probing', 'Quadratic Probing', 'Double Hashing'],
        correct_index: 1,
        explanation: 'Linear probing searches consecutive slots, creating long clusters of filled slots.'
      },
      {
        id: 'qc_ds_hsh_2',
        question: 'What is the average time complexity of searching in a hash table with good hash function?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        correct_index: 0,
        explanation: 'With uniform distribution and low load factor, search is O(1) on average.'
      },
      {
        id: 'qc_ds_hsh_3',
        question: 'In a hash table of size 10 using h(k) = k % 10 and linear probing, insert 23, 43. Where is 43 placed?',
        options: ['Slot 3', 'Slot 4', 'Slot 5', 'Slot 0'],
        correct_index: 1,
        explanation: '23 goes to 23 % 10 = slot 3. 43 hashes to 3 (occupied), next slot is (3+1)%10 = slot 4.'
      }
    ]
  },

  // 6. Operating Systems
  {
    id: 'lesson_os_paging',
    topic_id: 'os_memory_paging',
    title: 'Paging, TLB Hit Calculations & Inverted Page Tables',
    citation: 'Operating System Concepts (Silberschatz, Galvin, Gagne) Ch 8 & Ch 9',
    content_markdown: `### Paging & Effective Memory Access Time (EMAT)

#### 1. Address Translation
Logical address is divided into **Page Number ($p$)** and **Offset ($d$)**.
- Page size determines offset bits: $d = \\log_2(\\text{Page Size})$.
- Physical Address = $\\text{Frame Number } f \\mid \\text{Offset } d$.

#### 2. Effective Memory Access Time with TLB
$$\\text{EMAT} = H_{\\text{TLB}} \\cdot (T_{\\text{TLB}} + M) + (1 - H_{\\text{TLB}}) \\cdot (T_{\\text{TLB}} + k \\cdot M + M)$$
Where:
- $H_{\\text{TLB}}$: TLB hit ratio
- $T_{\\text{TLB}}$: TLB lookup time
- $M$: Main memory access time
- $k$: Number of levels of page table ($k=1$ for single-level paging)`,
    quick_check_questions: [
      {
        id: 'qc_os_pg_1',
        question: 'In a 32-bit virtual address system with 4 KB page size, how many bits are used for the page offset?',
        options: ['10 bits', '12 bits', '16 bits', '20 bits'],
        correct_index: 1,
        explanation: 'Page size = 4 KB = 2^12 bytes. Therefore offset requires 12 bits.'
      },
      {
        id: 'qc_os_pg_2',
        question: 'TLB hit ratio is 0.8, TLB time is 10 ns, memory time is 100 ns (1-level paging). What is EMAT?',
        options: ['110 ns', '130 ns', '150 ns', '210 ns'],
        correct_index: 1,
        explanation: 'EMAT = 0.8 * (10 + 100) + 0.2 * (10 + 100 + 100) = 0.8 * 110 + 0.2 * 210 = 88 + 42 = 130 ns.'
      },
      {
        id: 'qc_os_pg_3',
        question: 'Which of the following problems does paging solve completely?',
        options: ['Internal fragmentation', 'External fragmentation', 'Page faults', 'TLB misses'],
        correct_index: 1,
        explanation: 'Paging allows non-contiguous allocation in physical memory frames, eliminating external fragmentation.'
      }
    ]
  },
  {
    id: 'lesson_os_sync',
    topic_id: 'os_synchronization',
    title: 'Process Synchronization & Semaphores',
    citation: 'Operating System Concepts (Silberschatz, Galvin, Gagne) Ch 6',
    content_markdown: `### Synchronization & Critical Section Problem

#### 1. Three Mandatory Criteria for Critical Section
1. **Mutual Exclusion**: Only one process can execute in its critical section at a time.
2. **Progress**: If no process is in CS and some wish to enter, only those not in remainder section can participate in the decision, and this decision cannot be postponed indefinitely.
3. **Bounded Waiting**: There must be a limit on the number of times other processes can enter CS after a process has requested entry.

#### 2. Counting & Binary Semaphores
- \`wait(S)\` / \`P(S)\`: Decrements $S$. If $S < 0$, process is blocked.
- \`signal(S)\` / \`V(S)\`: Increments $S$. If $S \\le 0$, wakes up a blocked process.`,
    quick_check_questions: [
      {
        id: 'qc_os_syn_1',
        question: 'A counting semaphore S is initialized to 7. Then 20 P operations and 15 V operations are performed. What is final S?',
        options: ['2', '7', '12', '-2'],
        correct_index: 0,
        explanation: 'Final value = Initial + V - P = 7 + 15 - 20 = 2.'
      },
      {
        id: 'qc_os_syn_2',
        question: 'Which of the following is NOT a mandatory requirement for a valid critical section solution?',
        options: ['Mutual Exclusion', 'Progress', 'Bounded Waiting', 'Equal CPU Share'],
        correct_index: 3,
        explanation: 'Equal CPU Share is not a requirement; only Mutual Exclusion, Progress, and Bounded Waiting are required.'
      },
      {
        id: 'qc_os_syn_3',
        question: 'What type of semaphore can take only values 0 and 1?',
        options: ['Counting semaphore', 'Binary semaphore / Mutex', 'Timed semaphore', 'Monitor'],
        correct_index: 1,
        explanation: 'Binary semaphores are restricted to values 0 and 1.'
      }
    ]
  },
  {
    id: 'lesson_os_deadlocks',
    topic_id: 'os_deadlocks',
    title: 'Deadlocks: 4 Necessary Conditions & Banker\'s Algorithm',
    citation: 'Operating System Concepts (Silberschatz, Galvin, Gagne) Ch 7',
    content_markdown: `### Deadlocks: Conditions & Banker's Algorithm

#### 1. Coffman's 4 Necessary Conditions
All 4 must hold simultaneously for a deadlock to occur:
1. **Mutual Exclusion**: At least one resource is held in non-shareable mode.
2. **Hold and Wait**: A process holds resources while waiting for additional ones.
3. **No Preemption**: Resources cannot be forcibly confiscated.
4. **Circular Wait**: A closed chain of processes each waiting for a resource held by the next.

#### 2. Banker's Algorithm for Avoidance
$$\\text{Need Matrix} = \\text{Max Matrix} - \\text{Allocation Matrix}$$
A state is **SAFE** if there exists a safe sequence $\\langle P_1, P_2, \\dots, P_n \\rangle$ such that for each $P_i$:
$$\\text{Need}_i \\le \\text{Available}$$`,
    quick_check_questions: [
      {
        id: 'qc_os_dl_1',
        question: 'If a system has 3 processes and each requires 2 resources of type R, what is the minimum number of resources to guarantee NO deadlock?',
        options: ['3', '4', '5', '6'],
        correct_index: 1,
        explanation: 'Minimum resources to avoid deadlock = sum(Max_i - 1) + 1 = 3 * (2 - 1) + 1 = 4 resources.'
      },
      {
        id: 'qc_os_dl_2',
        question: 'Which deadlock handling strategy does Banker\'s algorithm implement?',
        options: ['Deadlock prevention', 'Deadlock avoidance', 'Deadlock detection', 'Deadlock recovery'],
        correct_index: 1,
        explanation: 'Banker\'s algorithm dynamically checks for safe states to avoid deadlocks.'
      },
      {
        id: 'qc_os_dl_3',
        question: 'If a system is in an UNSAFE state, does this mean a deadlock has occurred?',
        options: [
          'Yes, deadlock is already present',
          'Not necessarily, but deadlock may occur depending on future requests',
          'No, unsafe state guarantees no deadlock',
          'Only if preemption is enabled'
        ],
        correct_index: 1,
        explanation: 'An unsafe state is not a deadlock, but it means the system cannot guarantee avoidance of future deadlocks.'
      }
    ]
  },

  // 7. Computer Networks
  {
    id: 'lesson_cn_tcp',
    topic_id: 'cn_tcp_udp',
    title: 'TCP 3-Way Handshake, Flow Control vs Congestion Control',
    citation: 'Computer Networking: A Top-Down Approach (Kurose and Ross) Ch 3',
    content_markdown: `### Transport Layer: TCP vs UDP

#### 1. TCP 3-Way Handshake
1. Client $\\to$ Server: \`SYN=1, seq=x\`
2. Server $\\to$ Client: \`SYN=1, ACK=1, seq=y, ack=x+1\`
3. Client $\\to$ Server: \`ACK=1, ack=y+1, seq=x+1\`

#### 2. Flow Control vs Congestion Control
- **Flow Control**: Prevents sender from overwhelming the **receiver buffer** using the Receiver Window (\`rwnd\`).
- **Congestion Control**: Prevents sender from overwhelming the **network links** using Congestion Window (\`cwnd\`).
- Effective Sending Window:
  $$\\text{Send Window} = \\min(\\text{rwnd}, \\text{cwnd})$$`,
    quick_check_questions: [
      {
        id: 'qc_cn_tcp_1',
        question: 'Which flag is NOT set during the second segment of the TCP 3-way handshake?',
        options: ['SYN', 'ACK', 'FIN', 'None of these'],
        correct_index: 2,
        explanation: 'The second segment sends SYN and ACK. FIN is used for connection termination.'
      },
      {
        id: 'qc_cn_tcp_2',
        question: 'If rwnd = 32 KB and cwnd = 16 KB, what is the maximum window size the sender can transmit?',
        options: ['16 KB', '32 KB', '48 KB', '2 KB'],
        correct_index: 0,
        explanation: 'Send window = min(rwnd, cwnd) = min(32, 16) = 16 KB.'
      },
      {
        id: 'qc_cn_tcp_3',
        question: 'Which transport protocol is connectionless and does not guarantee delivery?',
        options: ['TCP', 'UDP', 'SCTP', 'BGP'],
        correct_index: 1,
        explanation: 'UDP provides connectionless, best-effort unreliable datagram delivery.'
      }
    ]
  },
  {
    id: 'lesson_cn_app',
    topic_id: 'cn_protocols_dns_http',
    title: 'Application Layer: HTTP, DNS & DHCP',
    citation: 'Computer Networking: A Top-Down Approach (Kurose and Ross) Ch 2',
    content_markdown: `### Key Application Layer Protocols

#### 1. Protocol Port Numbers & Transport Protocols
- **HTTP**: Port 80 (TCP)
- **HTTPS**: Port 443 (TCP)
- **DNS**: Port 53 (Uses **UDP** for queries, TCP for zone transfers)
- **DHCP**: Ports 67 & 68 (UDP)
- **SMTP**: Port 25 (TCP)

#### 2. HTTP Persistent vs Non-Persistent
- Non-persistent: 1 TCP connection per object (2 RTT per object).
- Persistent HTTP: Multiple objects reused over single TCP connection.`,
    quick_check_questions: [
      {
        id: 'qc_cn_app_1',
        question: 'Which transport protocol does standard DNS query lookup use?',
        options: ['TCP', 'UDP', 'ICMP', 'IGMP'],
        correct_index: 1,
        explanation: 'DNS uses UDP port 53 for fast single-packet queries and responses.'
      },
      {
        id: 'qc_cn_app_2',
        question: 'What is the default port number for HTTPS?',
        options: ['80', '8080', '443', '22'],
        correct_index: 2,
        explanation: 'HTTPS default port is 443; HTTP is 80.'
      },
      {
        id: 'qc_cn_app_3',
        question: 'Which protocol dynamically assigns IP addresses to client hosts on boot?',
        options: ['DNS', 'DHCP', 'ARP', 'ICMP'],
        correct_index: 1,
        explanation: 'Dynamic Host Configuration Protocol (DHCP) assigns IP addresses automatically.'
      }
    ]
  },

  // 8. COA
  {
    id: 'lesson_coa_pipe',
    topic_id: 'coa_pipelining',
    title: 'Instruction Pipelining, Hazards & Speedup',
    citation: 'Computer System Architecture (M. Morris Mano) Ch 9',
    content_markdown: `### Pipelining & Speedup Calculations

#### 1. Speedup Factor ($S$)
For a $k$-stage pipeline executing $n$ instructions:
$$\\text{Non-pipelined time } t_{np} = n \\cdot k \\cdot \\tau$$
$$\\text{Ideal Pipelined time } t_p = (k + n - 1) \\cdot \\tau$$
$$\\text{Ideal Speedup } S = \\frac{n \\cdot k \\cdot \\tau}{(k + n - 1) \\cdot \\tau} \\xrightarrow{n \\to \\infty} k$$
*The theoretical maximum speedup equals the number of pipeline stages $k$.*

#### 2. Pipeline Hazards
1. **Structural Hazard**: Hardware resource conflict (e.g. single memory for instructions and data).
2. **Data Hazard**: Instruction depends on result of preceding instruction (RAW, WAR, WAW).
3. **Control Hazard**: Caused by branch and jump instructions.`,
    quick_check_questions: [
      {
        id: 'qc_coa_pip_1',
        question: 'In an ideal 5-stage pipeline with no stalls, what is the maximum speedup as n -> ∞?',
        options: ['1', '4', '5', '10'],
        correct_index: 2,
        explanation: 'Speedup as n -> ∞ approaches the number of stages k = 5.'
      },
      {
        id: 'qc_coa_pip_2',
        question: 'Which technique is used to resolve data hazards without inserting stall bubbles?',
        options: ['Branch prediction', 'Operand forwarding (bypassing)', 'Increasing clock cycle', 'Disabling cache'],
        correct_index: 1,
        explanation: 'Operand forwarding routes the computed result directly from ALU output back to ALU input.'
      },
      {
        id: 'qc_coa_pip_3',
        question: 'If a 4-stage pipeline executes 100 instructions with no stalls, how many clock cycles are needed?',
        options: ['100', '103', '104', '400'],
        correct_index: 1,
        explanation: 'Clock cycles = k + n - 1 = 4 + 100 - 1 = 103 cycles.'
      }
    ]
  },
  {
    id: 'lesson_coa_cycle',
    topic_id: 'coa_instruction_cycle',
    title: 'Instruction Cycle & Addressing Modes Overview',
    citation: 'Computer System Architecture (M. Morris Mano) Ch 5 & Ch 8',
    content_markdown: `### Instruction Cycle & Addressing Modes

#### 1. The Instruction Cycle
1. **Fetch**: PC $\\to$ MAR; Memory $\\to$ MDR $\\to$ IR; $\\text{PC} \\leftarrow \\text{PC} + 1$.
2. **Decode**: Control unit decodes opcode and addressing mode.
3. **Execute**: Memory read / ALU operation.

#### 2. Common Addressing Modes
- **Immediate**: Operand is specified in the instruction itself (\`ADD #5\`).
- **Direct**: Address field points directly to memory operand.
- **Indirect**: Address field points to memory location containing the effective address.
- **Register Indirect**: Register contains the memory address of the operand.
- **Indexed / Base Register**: $\\text{Effective Address} = \\text{Base Register} + \\text{Offset}$.`,
    quick_check_questions: [
      {
        id: 'qc_coa_cyc_1',
        question: 'Which register holds the memory address of the next instruction to be fetched?',
        options: ['Instruction Register (IR)', 'Program Counter (PC)', 'Memory Buffer Register (MBR)', 'Accumulator'],
        correct_index: 1,
        explanation: 'The Program Counter (PC) stores the address of the next instruction.'
      },
      {
        id: 'qc_coa_cyc_2',
        question: 'In which addressing mode is the operand explicitly present within the instruction itself?',
        options: ['Direct', 'Indirect', 'Immediate', 'Register'],
        correct_index: 2,
        explanation: 'Immediate addressing embeds the constant operand value directly in the instruction code.'
      },
      {
        id: 'qc_coa_cyc_3',
        question: 'How many memory references are required to fetch an operand in Indirect Addressing mode?',
        options: ['0', '1', '2', '3'],
        correct_index: 2,
        explanation: 'First reference to read the address pointer, second reference to read the actual operand.'
      }
    ]
  },

  // 9. TOC
  {
    id: 'lesson_toc_regular',
    topic_id: 'toc_regular_languages',
    title: 'Finite Automata (DFA / NFA) & Regular Expressions',
    citation: 'Introduction to Automata Theory, Languages, and Computation (Hopcroft, Motwani, Ullman) Ch 2 & Ch 3',
    content_markdown: `### Finite Automata & Regular Expressions (Tier 3 Light Touch)

#### 1. Equivalence of DFA and NFA
- Every NFA with $n$ states can be converted to an equivalent DFA with at most **$2^n$ states** (Subset Construction).
- Both DFA and NFA recognize the **exact same family of languages**: Regular Languages.

#### 2. Key Regular Expression Identities
- $(r^*)^* = r^*$
- $(r + s)^* = (r^* s^*)^* = (r^* + s^*)^*$
- $r(s + t) = rs + rt$`,
    quick_check_questions: [
      {
        id: 'qc_toc_reg_1',
        question: 'If an NFA has 4 states, what is the maximum number of states in its equivalent minimal DFA?',
        options: ['4', '8', '16', '32'],
        correct_index: 2,
        explanation: 'Power set construction has at most 2^n = 2^4 = 16 states.'
      },
      {
        id: 'qc_toc_reg_2',
        question: 'Which of the following is equivalent to (a + b)*?',
        options: ['(a* b*)*', 'a* + b*', 'ab*', 'a*b'],
        correct_index: 0,
        explanation: '(a* b*)* matches any arbitrary combination of a\'s and b\'s, exactly like (a + b)*.'
      },
      {
        id: 'qc_toc_reg_3',
        question: 'Can a DFA have multiple start states?',
        options: ['Yes', 'No, strictly one start state', 'Only if converted from NFA', 'Only in Moore machines'],
        correct_index: 1,
        explanation: 'By definition, a DFA has exactly one start state q0.'
      }
    ]
  },
  {
    id: 'lesson_toc_closure',
    topic_id: 'toc_properties',
    title: 'Closure Properties of Regular Languages',
    citation: 'Introduction to Automata Theory, Languages, and Computation (Hopcroft, Motwani, Ullman) Ch 4',
    content_markdown: `### Closure Properties of Regular Languages

Regular languages are the most well-behaved class of languages in the Chomsky hierarchy.

#### 1. Closed Under Almost All Operations:
Regular languages are **CLOSED** under:
- Union ($L_1 \\cup L_2$)
- Intersection ($L_1 \\cap L_2$)
- Complement ($L'$)
- Concatenation ($L_1 \\cdot L_2$)
- Kleene Star ($L^*$)
- Set Difference ($L_1 - L_2$)
- Reversal ($L^R$)
- Homomorphism & Inverse Homomorphism

#### 2. Decision Properties
- Emptiness ($L = \\emptyset$): **Decidable** (Check if any final state is reachable from start state).
- Finiteness: **Decidable** (Check for cycles on paths to final states).
- Equivalence ($L_1 = L_2$): **Decidable** (Check if $(L_1 \\cap L_2') \\cup (L_1' \\cap L_2) = \\emptyset$).`,
    quick_check_questions: [
      {
        id: 'qc_toc_clo_1',
        question: 'If L1 and L2 are regular languages, is L1 ∩ L2 guaranteed to be regular?',
        options: ['Yes, always', 'No, never', 'Only if finite', 'Only if deterministic'],
        correct_index: 0,
        explanation: 'Regular languages are closed under intersection.'
      },
      {
        id: 'qc_toc_clo_2',
        question: 'Is the problem of determining whether a given DFA accepts an empty language decidable?',
        options: ['Decidable', 'Undecidable', 'Semi-decidable only', 'NP-complete'],
        correct_index: 0,
        explanation: 'Decidable by performing BFS/DFS from start state to see if any accept state is reachable.'
      },
      {
        id: 'qc_toc_clo_3',
        question: 'Which machine model recognizes regular languages?',
        options: ['Turing Machine only', 'Pushdown Automaton only', 'Finite Automaton', 'Linear Bounded Automaton'],
        correct_index: 2,
        explanation: 'Finite Automata (DFA/NFA) recognize regular languages.'
      }
    ]
  },

  // 10. Algorithms
  {
    id: 'lesson_algo_sorting',
    topic_id: 'algo_sorting_searching',
    title: 'Standard Sorting & Searching (MergeSort & QuickSort)',
    citation: 'Introduction to Algorithms (CLRS) Ch 2 & Ch 7',
    content_markdown: `### Standard Sorting & Searching (Tier 3 Light Touch)

#### 1. Sorting Algorithms Comparison
| Algorithm | Best Time | Average Time | Worst Time | Space | Stable? |
|---|---|---|---|---|---|
| **MergeSort** | $\\Theta(n \\log n)$ | $\\Theta(n \\log n)$ | $\\Theta(n \\log n)$ | $O(n)$ | **Yes** |
| **QuickSort** | $\\Theta(n \\log n)$ | $\\Theta(n \\log n)$ | $\\Theta(n^2)$ | $O(\\log n)$ | **No** |
| **HeapSort** | $\\Theta(n \\log n)$ | $\\Theta(n \\log n)$ | $\\Theta(n \\log n)$ | $O(1)$ | **No** |
| **CountingSort** | $\\Theta(n + k)$ | $\\Theta(n + k)$ | $\\Theta(n + k)$ | $O(k)$ | **Yes** |

#### 2. Key Insights
- **MergeSort** is the textbook choice when stability and guaranteed $O(n \\log n)$ worst-case performance is required.
- **QuickSort** worst case $O(n^2)$ occurs when the pivot chosen is consistently the smallest or largest element (already sorted array with first element as pivot).`,
    quick_check_questions: [
      {
        id: 'qc_algo_sort_1',
        question: 'What is the worst-case time complexity of MergeSort?',
        options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
        correct_index: 1,
        explanation: 'MergeSort is always O(n log n) in all cases (best, average, worst).'
      },
      {
        id: 'qc_algo_sort_2',
        question: 'Which of the following sorting algorithms is STABLE by default?',
        options: ['QuickSort', 'HeapSort', 'MergeSort', 'SelectionSort'],
        correct_index: 2,
        explanation: 'MergeSort preserves the relative order of equal elements.'
      },
      {
        id: 'qc_algo_sort_3',
        question: 'When does standard QuickSort (first element as pivot) exhibit worst-case O(n²) behavior?',
        options: ['When array elements are randomly ordered', 'When array is already sorted', 'When all elements are negative', 'Never'],
        correct_index: 1,
        explanation: 'An already sorted array causes highly unbalanced partitions (0 and n-1), resulting in O(n²).'
      }
    ]
  },
  {
    id: 'lesson_algo_greedy',
    topic_id: 'algo_greedy_basics',
    title: 'Greedy Strategy & Fractional Knapsack',
    citation: 'Introduction to Algorithms (CLRS) Ch 16',
    content_markdown: `### Greedy Algorithms Fundamentals

A greedy algorithm makes the locally optimal choice at each step hoping it leads to a globally optimal solution.

#### 1. Classical Examples
- **Fractional Knapsack**: Greedy by $\\frac{\\text{value}}{\\text{weight}}$ ratio gives **optimal solution** ($O(n \\log n)$).
- **0/1 Knapsack**: Greedy does **NOT** work; requires Dynamic Programming ($O(n W)$).
- **Huffman Coding**: Uses greedy tree merging to construct optimal prefix codes.
- **Minimum Spanning Tree (Kruskal / Prim)**: Greedy edge selection provably yields global minimum cost.`,
    quick_check_questions: [
      {
        id: 'qc_algo_grd_1',
        question: 'Does the greedy approach by value/weight ratio yield the optimal solution for 0/1 Knapsack?',
        options: ['Yes, always', 'No, only for Fractional Knapsack', 'Only if weights are equal', 'Yes, in O(n)'],
        correct_index: 1,
        explanation: '0/1 knapsack items cannot be divided; greedy fails and dynamic programming is required.'
      },
      {
        id: 'qc_algo_grd_2',
        question: 'What type of code does Huffman algorithm generate?',
        options: ['Fixed-length code', 'Optimal prefix code', 'Error correcting code', 'Cyclic code'],
        correct_index: 1,
        explanation: 'Huffman algorithm produces an optimal prefix-free variable-length code.'
      },
      {
        id: 'qc_algo_grd_3',
        question: 'Which two algorithms use the greedy paradigm to find a Minimum Spanning Tree?',
        options: ['Kruskal and Prim', 'Dijkstra and Bellman-Ford', 'Floyd-Warshall and Johnson', 'DFS and BFS'],
        correct_index: 0,
        explanation: 'Kruskal and Prim are standard greedy algorithms for MST.'
      }
    ]
  },

  // 11. Compiler Design
  {
    id: 'lesson_comp_phases',
    topic_id: 'comp_phases_overview',
    title: '6 Phases of Compiler & Symbol Table Overview',
    citation: 'Compilers: Principles, Techniques, and Tools (Aho, Lam, Sethi, Ullman) Ch 1',
    content_markdown: `### The 6 Phases of a Compiler (Tier 3 Light Touch)

#### 1. Sequential Pipeline of Phases
1. **Lexical Analysis (Scanner)**: Reads characters $\\to$ generates stream of **Tokens**. Uses regular expressions and DFA.
2. **Syntax Analysis (Parser)**: Takes tokens $\\to$ builds **Parse Tree / AST**. Uses Context-Free Grammars (CFG) and pushdown automata.
3. **Semantic Analysis (Type Checker)**: Checks types, scope, and semantic consistency.
4. **Intermediate Code Generation (ICG)**: Generates machine-independent representation (e.g. Three-Address Code / Quadruples).
5. **Code Optimization**: Eliminates dead code, common subexpressions, loop unrolling.
6. **Code Generation**: Translates into target machine assembly/machine code.

#### 2. Cross-Phase Components
- **Symbol Table**: Stores identifiers, data types, scope, and memory offsets. Accessed by ALL phases.
- **Error Handler**: Reports syntax errors, lexical errors, and type mismatches.`,
    quick_check_questions: [
      {
        id: 'qc_comp_ph_1',
        question: 'Which phase of the compiler groups characters into tokens?',
        options: ['Lexical Analysis', 'Syntax Analysis', 'Semantic Analysis', 'Code Generation'],
        correct_index: 0,
        explanation: 'The Lexical Analyzer (Scanner) reads input characters and outputs tokens.'
      },
      {
        id: 'qc_comp_ph_2',
        question: 'Which data structure is shared across all phases of compilation to store variable types and scopes?',
        options: ['Parse Tree', 'Symbol Table', 'Activation Record', 'Syntax Tree'],
        correct_index: 1,
        explanation: 'The Symbol Table is maintained and queried across all compiler phases.'
      },
      {
        id: 'qc_comp_ph_3',
        question: 'Type checking and operator-operand compatibility are verified during which phase?',
        options: ['Lexical Analysis', 'Syntax Analysis', 'Semantic Analysis', 'Target Code Generation'],
        correct_index: 2,
        explanation: 'Semantic analysis is responsible for type checking and semantic validity.'
      }
    ]
  }
];

async function seedAllLessons() {
  const stmts = allLessons.map(l => ({
    sql: `INSERT INTO lessons (id, topic_id, title, content_markdown, quick_check_questions, citation)
          VALUES (?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            title = excluded.title,
            content_markdown = excluded.content_markdown,
            quick_check_questions = excluded.quick_check_questions,
            citation = excluded.citation`,
    args: [l.id, l.topic_id, l.title, l.content_markdown, JSON.stringify(l.quick_check_questions), l.citation]
  }));
  if (stmts.length > 0) {
    await db.batch(stmts);
    console.log(`Successfully seeded ${allLessons.length} lessons with complete quick-checks!`);
  }
}

module.exports = { allLessons, seedAllLessons };
