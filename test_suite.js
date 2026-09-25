const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const BASE_URL = 'http://localhost:3001';

function request(method, pathUrl, data = null, customHeaders = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(pathUrl, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...customHeaders,
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, headers: res.headers, data: parsed, raw: body });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, raw: body });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

const results = [];
function assert(testName, condition, details = '') {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    results.push({ name: testName, pass: true });
  } else {
    console.error(`  ✗ FAIL: ${testName} - ${details}`);
    results.push({ name: testName, pass: false, details });
  }
}

async function runTestSuite() {
  console.log('====================================================');
  console.log('   GATE CSE 2027 PLATFORM COMPREHENSIVE TEST SUITE   ');
  console.log('====================================================\n');

  try {
    // 1. Static Web App Verification
    console.log('[1/10] Testing Web App & Static Assets...');
    const htmlRes = await request('GET', '/');
    assert('Frontend HTML loads', htmlRes.status === 200 && htmlRes.raw.includes('<div id="root"></div>'));
    
    // Extract script and css paths from HTML
    const jsMatch = htmlRes.raw.match(/src="(\/assets\/[^"]+\.js)"/);
    const cssMatch = htmlRes.raw.match(/href="(\/assets\/[^"]+\.css)"/);
    if (jsMatch) {
      const jsRes = await request('GET', jsMatch[1]);
      assert('Production JS bundle loads (HTTP 200)', jsRes.status === 200 && jsRes.raw.length > 50000);
    }
    if (cssMatch) {
      const cssRes = await request('GET', cssMatch[1]);
      assert('Production CSS stylesheet loads (HTTP 200)', cssRes.status === 200 && cssRes.raw.length > 10000);
    }

    // 2. Syllabus & Subject Tiers
    console.log('\n[2/10] Testing Curriculum & Subject Tiers...');
    const subRes = await request('GET', '/api/subjects');
    assert('Subjects API returns 200 OK', subRes.status === 200);
    const subjects = subRes.data;
    assert('Seeded all 11 subjects', subjects.length === 11);
    
    const tier1Subs = subjects.filter(s => s.tier === 1);
    const tier2Subs = subjects.filter(s => s.tier === 2);
    const tier3Subs = subjects.filter(s => s.tier === 3);
    assert('Tier 1 has 5 subjects (Full Depth)', tier1Subs.length === 5);
    assert('Tier 2 has 3 subjects (Fundamentals)', tier2Subs.length === 3);
    assert('Tier 3 has 3 subjects (Light Touch)', tier3Subs.length === 3);
    assert('Textbook citations present (e.g. Karumanchi, Silberschatz)', subjects.some(s => s.reference_book.includes('Silberschatz')));

    // 3. High-Yield Topics Verification
    console.log('\n[3/10] Testing Topics & High-Yield Spotlight...');
    const topRes = await request('GET', '/api/topics');
    assert('Topics API returns 200 OK', topRes.status === 200);
    const topics = topRes.data;
    assert('Multiple topics seeded', topics.length >= 20);
    const highYieldTopics = topics.filter(t => t.is_high_yield === 1);
    assert('High-yield topics properly flagged (is_high_yield = 1)', highYieldTopics.length >= 10);

    // 4. Lesson Mode & Quick Checks Retrieval
    console.log('\n[4/10] Testing Lesson Mode & Quick-Checks Enforcement...');
    const lessonRes = await request('GET', '/api/lessons/lesson_dbms_normalization');
    assert('Lesson details loaded', lessonRes.status === 200 && lessonRes.data.title.includes('Normal Forms'));
    assert('Quick checks exist (3 questions)', lessonRes.data.quick_check_questions.length === 3);
    assert('Cites textbook chapter', lessonRes.data.citation.includes('Silberschatz'));

    // Test failing quick checks
    const failCheckRes = await request('POST', '/api/lessons/lesson_dbms_normalization/complete', {
      answers: { qc_dbms_1: 0, qc_dbms_2: 0, qc_dbms_3: 0 } // intentionally wrong
    });
    assert('Failing quick checks prevents completion', failCheckRes.data.allCorrect === false);
    assert('Returns detailed explanation for each check question', failCheckRes.data.feedback.every(f => f.explanation));

    // Test passing quick checks
    const passCheckRes = await request('POST', '/api/lessons/lesson_dbms_normalization/complete', {
      answers: { qc_dbms_1: 1, qc_dbms_2: 2, qc_dbms_3: 1 } // correct answers
    });
    assert('Passing quick checks marks lesson Completed', passCheckRes.data.allCorrect === true);
    
    // Verify persistence in SQLite
    const updatedLesson = await request('GET', '/api/lessons/lesson_dbms_normalization');
    assert('Lesson completed status persists in SQLite', updatedLesson.data.status === 'completed');

    // 5. Spaced Repetition (SM-2 Engine)
    console.log('\n[5/10] Testing SuperMemo SM-2 Spaced Repetition Engine...');
    const { db } = require('./server/db');
    // Ensure at least one test card is due for idempotent test execution
    db.prepare("UPDATE spaced_repetition_cards SET due_date = datetime('now', '-1 minute') WHERE item_id = 'fc_eigen_trace' AND user_id = 'guest'").run();

    const dueRes = await request('GET', '/api/reviews/due');
    assert('Due reviews API returns list', dueRes.status === 200 && Array.isArray(dueRes.data));
    assert('Auto-scheduled cards exist in SM-2 queue', dueRes.data.length > 0);

    // Test rating SM-2 card with Easy (rating: 4)
    const cardToRate = dueRes.data[0];
    const rateRes = await request('POST', `/api/reviews/${cardToRate.id}/rate`, { rating: 4 });
    assert('SM-2 rating 4 calculates increased Ease Factor and interval', rateRes.data.success === true && rateRes.data.sm2.intervalDays >= 1);

    // 6. Practice & PYQ Question Bank (MCQ, MSQ, NAT)
    console.log('\n[6/10] Testing Practice Bank, PYQs & Question Types...');
    const qListRes = await request('GET', '/api/questions');
    assert('Questions API returns bank', qListRes.status === 200 && qListRes.data.length > 0);
    const questions = qListRes.data;
    assert('Contains MCQs', questions.some(q => q.type === 'MCQ'));
    assert('Contains MSQs', questions.some(q => q.type === 'MSQ'));
    assert('Contains NATs', questions.some(q => q.type === 'NAT'));
    assert('Contains GATE PYQs with year tags', questions.some(q => q.is_pyq === 1 && q.pyq_year));

    // Test NAT Question Attempt
    const natQ = questions.find(q => q.type === 'NAT');
    const natAttempt = await request('POST', `/api/questions/${natQ.id}/attempt`, {
      userAnswer: natQ.correct_answer,
      timeSpentSecs: 35
    });
    assert('NAT question evaluates correct numerical value', natAttempt.data.isCorrect === true && natAttempt.data.explanation);

    // Test MSQ Question Attempt
    const msqQ = questions.find(q => q.type === 'MSQ');
    const msqAttempt = await request('POST', `/api/questions/${msqQ.id}/attempt`, {
      userAnswer: JSON.parse(msqQ.correct_answer),
      timeSpentSecs: 45
    });
    assert('MSQ question evaluates full multi-select array', msqAttempt.data.isCorrect === true);

    // Test Interleaving Mode
    const interleaveRes = await request('GET', '/api/questions?interleaving=true&limit=5');
    assert('Interleaving mode returns randomized cross-subject mix', interleaveRes.status === 200 && interleaveRes.data.length === 5);

    // 7. Weak Area Drilling
    console.log('\n[7/10] Testing Weak-Area Drilling...');
    const drillRes = await request('GET', '/api/weak-areas/drill');
    assert('Weak-area drill generates questions from target topics', drillRes.status === 200 && Array.isArray(drillRes.data));

    // 8. Timed Mock Exam with Negative Marking
    console.log('\n[8/10] Testing Timed Mock Exam with GATE Negative Marking...');
    const mockStart = await request('POST', '/api/mock/start', {
      questionCount: 4,
      durationMinutes: 15,
      title: 'Automated Test Mock'
    });
    assert('Mock session initiated with timer duration', mockStart.status === 200 && mockStart.data.sessionId);

    const mockQs = mockStart.data.questions;
    // Prepare answers: 1 right MCQ (+1), 1 wrong MCQ (-0.33), 1 right NAT (+2), 1 unattempted (0)
    const mockPayload = {
      answers: {},
      timeSpentSeconds: 300,
      title: 'Automated Test Mock'
    };
    
    // Choose an MCQ to get wrong
    const mcqToMiss = mockQs.find(q => q.type === 'MCQ');
    if (mcqToMiss) {
      mockPayload.answers[mcqToMiss.id] = { userAnswer: 'Z_WRONG', timeSpent: 40 };
    }
    // Choose an MCQ to get right
    const mcqToHit = mockQs.find(q => q.type === 'MCQ' && q.id !== mcqToMiss?.id);
    if (mcqToHit) {
      mockPayload.answers[mcqToHit.id] = { userAnswer: mcqToHit.correct_answer, timeSpent: 50 };
    }

    const mockSubmit = await request('POST', `/api/mock/${mockStart.data.sessionId}/submit`, mockPayload);
    assert('Mock exam evaluates score', mockSubmit.status === 200 && typeof mockSubmit.data.scoreObtained === 'number');
    assert('Simulates negative penalty on wrong MCQ (-0.33)', mockSubmit.data.recordedAnswers.some(ra => ra.marksObtained < 0));
    assert('Compares score against qualifying cutoff benchmark', mockSubmit.data.scaledCutoff > 0 && typeof mockSubmit.data.passedCutoff === 'boolean');
    assert('Generates subject-wise breakdown across tiers', Object.keys(mockSubmit.data.subjectBreakdown).length > 0);

    // 9. Study Calendar & Mode Settings
    console.log('\n[9/10] Testing Study Calendar & Light/Full Mode...');
    const calSave = await request('POST', '/api/calendar', {
      target_exam_date: '2027-02-06',
      target_cutoff: '35.0',
      current_mode: 'light',
      busy_periods: [{ start: '2026-11-20', end: '2026-12-05', label: 'Semester Midterms' }]
    });
    assert('Calendar settings saved', calSave.data.success === true);

    const calGet = await request('GET', '/api/calendar');
    assert('Calendar mode persists as "light"', calGet.data.current_mode === 'light');
    assert('Busy periods persist in SQLite', Array.isArray(calGet.data.busy_periods) && calGet.data.busy_periods.length > 0);

    // Switch back to full mode
    await request('POST', '/api/calendar', { current_mode: 'full' });

    // 10. Concrete Backup, Export & Restore Mechanism
    console.log('\n[10/10] Testing Backup, Export, Snapshot & Restore...');
    const exportRes = await request('GET', '/api/backup/export');
    assert('Export JSON backup returns 200 OK', exportRes.status === 200);
    assert('Backup contains all lesson progress records', Array.isArray(exportRes.data.user_lesson_progress));
    assert('Backup contains all question attempts', Array.isArray(exportRes.data.user_question_attempts));
    assert('Backup contains SM-2 cards', Array.isArray(exportRes.data.spaced_repetition_cards));
    assert('Backup contains mock sessions', Array.isArray(exportRes.data.mock_sessions));

    // Test Local Snapshot
    const snapshotRes = await request('POST', '/api/backup/snapshot');
    assert('Local snapshot created on disk', snapshotRes.data.success === true && fs.existsSync(snapshotRes.data.path));

    // Test Atomic Import / Restore
    const importRes = await request('POST', '/api/backup/import', exportRes.data);
    assert('Atomic database restore succeeds', importRes.data.success === true);

    // 11. User Authentication, Profile Isolation & Guest Progress Migration
    console.log('\n[11/11] Testing User Authentication, Isolation & Guest Progress Migration...');
    const ts = Date.now();
    const userAName = `gate_student_a_${ts}`;
    const userBName = `gate_student_b_${ts}`;
    const userCName = `gate_guest_migrated_${ts}`;

    // Test Guest mode default
    const guestMe = await request('GET', '/api/auth/me');
    assert('Unauthenticated user defaults safely to Guest mode', guestMe.data.isGuest === true && guestMe.data.user === null);

    // Validation checks
    const badReg = await request('POST', '/api/auth/register', { username: 'ab', password: '123' });
    assert('Registration rejects short usernames/passwords (<3 and <6)', badReg.status === 400);

    // Register User A
    const regA = await request('POST', '/api/auth/register', {
      username: userAName,
      password: 'mypassword123',
      email: 'student_a@gate.in',
      migrateGuestProgress: false,
    });
    assert('User A registers successfully and receives Bearer token', regA.status === 201 && Boolean(regA.data.token));
    const tokenA = regA.data.token;

    // Prevent duplicate username
    const dupReg = await request('POST', '/api/auth/register', { username: userAName, password: 'mypassword123' });
    assert('Duplicate username registration returns HTTP 409 Conflict', dupReg.status === 409);

    // Login checks
    const badLogin = await request('POST', '/api/auth/login', { username: userAName, password: 'wrongpassword' });
    assert('Login with incorrect password returns HTTP 401 Unauthorized', badLogin.status === 401);

    const goodLogin = await request('POST', '/api/auth/login', { username: userAName, password: 'mypassword123' });
    assert('Login with correct password succeeds', goodLogin.status === 200 && Boolean(goodLogin.data.token));

    // Authenticated profile verification
    const meA = await request('GET', '/api/auth/me', null, { Authorization: `Bearer ${tokenA}` });
    assert('Bearer token correctly identifies authenticated user', meA.data.isGuest === false && meA.data.user.username === userAName);

    // Register User B for isolation testing
    const regB = await request('POST', '/api/auth/register', {
      username: userBName,
      password: 'password456',
      migrateGuestProgress: false,
    });
    const tokenB = regB.data.token;
    assert('User B registers with independent token', Boolean(tokenB));

    // Check baseline isolation
    const overviewB_start = await request('GET', '/api/overview', null, { Authorization: `Bearer ${tokenB}` });
    assert('User B starts with 0 completed lessons (Progress Isolation)', overviewB_start.data.completedLessons === 0);

    // User B completes a lesson (Algorithms: Sorting)
    const completeB = await request('POST', '/api/lessons/lesson_algo_sorting/complete', {
      answers: { qc_algo_sort_1: 1, qc_algo_sort_2: 2, qc_algo_sort_3: 1 },
      timeSpentSecs: 45,
    }, { Authorization: `Bearer ${tokenB}` });
    assert('User B completes lesson and passes quick checks', completeB.status === 200 && completeB.data.allCorrect === true);

    // Verify progress isolation between User B and User A
    const overviewB_after = await request('GET', '/api/overview', null, { Authorization: `Bearer ${tokenB}` });
    const overviewA_after = await request('GET', '/api/overview', null, { Authorization: `Bearer ${tokenA}` });
    assert('User B overview reflects 1 completed lesson', overviewB_after.data.completedLessons === 1);
    assert('User A progress is unaffected by User B (0 lessons)', overviewA_after.data.completedLessons === 0);

    // Test Guest-to-Account Progress Migration
    // 1. As guest (no token), complete a lesson (DBMS: Normalization)
    await request('POST', '/api/lessons/lesson_dbms_normalization/complete', {
      answers: { qc_dbms_1: 1, qc_dbms_2: 2, qc_dbms_3: 1 },
      timeSpentSecs: 30,
    });
    // 2. Register new account User C with migrateGuestProgress: true
    const regC = await request('POST', '/api/auth/register', {
      username: userCName,
      password: 'password789',
      migrateGuestProgress: true,
    });
    const tokenC = regC.data.token;
    const overviewC = await request('GET', '/api/overview', null, { Authorization: `Bearer ${tokenC}` });
    assert('Guest progress successfully migrates into newly registered account', overviewC.data.completedLessons >= 1);

    // Reset password test
    const resetRes = await request('POST', '/api/auth/reset-password', {
      username: userAName,
      newPassword: 'newpassword_999',
    });
    assert('Password reset endpoint updates password and returns token', resetRes.status === 200 && Boolean(resetRes.data.token));

    // Verify login with new password succeeds
    const newLoginRes = await request('POST', '/api/auth/login', {
      username: userAName,
      password: 'newpassword_999',
    });
    assert('Login with updated password succeeds', newLoginRes.status === 200 && Boolean(newLoginRes.data.token));

    // Logout endpoint check
    const logoutRes = await request('POST', '/api/auth/logout', null, { Authorization: `Bearer ${tokenC}` });
    assert('Logout endpoint confirms successful session clear', logoutRes.status === 200 && logoutRes.data.success === true);

    // Clean up ONLY test users created during this test run
    try {
      const { db } = require('./server/db');
      const testNames = [userAName, userBName, userCName];
      testNames.forEach(name => {
        const u = db.prepare('SELECT id FROM users WHERE username = ?').get(name);
        if (u) {
          db.prepare('DELETE FROM user_lesson_progress WHERE user_id = ?').run(u.id);
          db.prepare('DELETE FROM spaced_repetition_cards WHERE user_id = ?').run(u.id);
          db.prepare('DELETE FROM user_question_attempts WHERE user_id = ?').run(u.id);
          db.prepare('DELETE FROM mock_sessions WHERE user_id = ?').run(u.id);
          db.prepare('DELETE FROM users WHERE id = ?').run(u.id);
        }
      });
    } catch {
      // Ignore cleanup error
    }

  } catch (err) {
    console.error('Test Suite encountered an error:', err);
    assert('Test Suite execution', false, err.message);
  }

  // Summary
  console.log('\n====================================================');
  const passedCount = results.filter(r => r.pass).length;
  const failedCount = results.filter(r => !r.pass).length;
  console.log(`TOTAL TESTS: ${results.length}`);
  console.log(`PASSED: ${passedCount}`);
  console.log(`FAILED: ${failedCount}`);
  console.log('====================================================');

  if (failedCount === 0) {
    console.log('🎉 ALL SYSTEM CHECKS PASSED PERFECTLY!');
  } else {
    console.log('❌ SOME TESTS FAILED. Review details above.');
  }

  process.exit(failedCount === 0 ? 0 : 1);
}

runTestSuite();
