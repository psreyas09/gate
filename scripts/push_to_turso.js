#!/usr/bin/env node

/**
 * Push local SQLite database (data/gate_study.db) to remote Turso database
 * Usage:
 *   TURSO_DATABASE_URL="libsql://..." TURSO_AUTH_TOKEN="..." npm run turso:push
 * or:
 *   node scripts/push_to_turso.js <database_url> <auth_token>
 */

const { createClient } = require('@libsql/client');
const path = require('node:path');
const fs = require('node:fs');

const localDbPath = path.join(__dirname, '..', 'data', 'gate_study.db');

const tursoUrl = process.env.TURSO_DATABASE_URL || process.argv[2];
const tursoToken = process.env.TURSO_AUTH_TOKEN || process.argv[3];

if (!tursoUrl) {
  console.error('\n❌ Error: TURSO_DATABASE_URL is not set.');
  console.log('\nUsage:');
  console.log('  TURSO_DATABASE_URL="libsql://<your-db>.turso.io" TURSO_AUTH_TOKEN="<token>" npm run turso:push');
  console.log('or:');
  console.log('  node scripts/push_to_turso.js libsql://<your-db>.turso.io <token>\n');
  process.exit(1);
}

if (!fs.existsSync(localDbPath)) {
  console.error(`\n❌ Error: Local database file not found at: ${localDbPath}`);
  process.exit(1);
}

async function main() {
  console.log('\n======================================================');
  console.log('🚀 PUSHING LOCAL GATE STUDY DATABASE TO TURSO CLOUD');
  console.log('======================================================\n');

  console.log(`Connecting to local SQLite: ${localDbPath}`);
  const localClient = createClient({ url: `file:${localDbPath}` });

  console.log(`Connecting to remote Turso: ${tursoUrl}`);
  const tursoClient = createClient({
    url: tursoUrl,
    authToken: tursoToken,
  });

  // Verify connection
  try {
    await tursoClient.execute('SELECT 1');
    console.log('✓ Successfully connected to Turso database!');
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
  }

  // Ensure remote schema
  console.log('Synchronizing schema on Turso...');
  const { initSchema } = require('../server/db');
  // Temporarily execute schema via tursoClient
  const fs = require('node:fs');
  const dbFileContent = fs.readFileSync(path.join(__dirname, '..', 'server', 'db.js'), 'utf-8');
  const schemaMatch = dbFileContent.match(/const SCHEMA_SQL = `([\s\S]*?)`;/);
  if (schemaMatch) {
    await tursoClient.executeMultiple(schemaMatch[1]);
    console.log('✓ Schema applied successfully on Turso!');
  }

  const tables = [
    'subjects',
    'topics',
    'lessons',
    'questions',
    'flashcards',
    'spaced_repetition_cards',
    'study_settings',
  ];

  for (const table of tables) {
    process.stdout.write(`Syncing table '${table}'... `);
    const localRows = await localClient.execute(`SELECT * FROM ${table}`);
    if (localRows.rows.length === 0) {
      console.log('0 rows (skipped)');
      continue;
    }

    const columns = Object.keys(localRows.rows[0]);
    const colsStr = columns.join(', ');
    const placeholders = columns.map(() => '?').join(', ');
    const insertSql = `INSERT OR REPLACE INTO ${table} (${colsStr}) VALUES (${placeholders})`;

    // Batch in chunks of 50 to respect packet size limits
    const CHUNK_SIZE = 50;
    let synced = 0;
    for (let i = 0; i < localRows.rows.length; i += CHUNK_SIZE) {
      const chunk = localRows.rows.slice(i, i + CHUNK_SIZE);
      const stmts = chunk.map((row) => ({
        sql: insertSql,
        args: columns.map((col) => row[col]),
      }));
      await tursoClient.batch(stmts);
      synced += chunk.length;
    }

    console.log(`✓ ${synced} rows synced!`);
  }

  console.log('\n======================================================');
  console.log('🎉 ALL TABLES SYNCED TO TURSO SUCCESSFULLY!');
  console.log('Your Vercel deployment will now share this exact state across all devices.');
  console.log('======================================================\n');
}

main().catch((err) => {
  console.error('\n❌ Migration failed:', err);
  process.exit(1);
});
