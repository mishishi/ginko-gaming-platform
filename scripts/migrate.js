#!/usr/bin/env node
/**
 * Database migration runner for 银古客栈
 *
 * Usage:
 *   node scripts/migrate.js           # Run all pending migrations
 *   node scripts/migrate.js --status  # Show migration status
 *   node scripts/migrate.js --reset   # Reset and re-run all migrations (dangerous!)
 */

const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const DB_PATH = path.join(__dirname, '..', '.yinqiu.db');
const MIGRATIONS_DIR = path.join(__dirname, '..', 'migrations');

// Ensure migrations table exists
function ensureMigrationsTable(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version TEXT PRIMARY KEY,
      applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

// Get list of applied migrations
function getAppliedMigrations(db) {
  const rows = db.prepare('SELECT version FROM schema_migrations ORDER BY version').all();
  return new Set(rows.map(r => r.version));
}

// Mark migration as applied
function markMigration(db, version) {
  db.prepare('INSERT INTO schema_migrations (version) VALUES (?)').run(version);
}

// Run a single migration file
function runMigration(db, filePath) {
  const version = path.basename(filePath, '.sql');
  const sql = fs.readFileSync(filePath, 'utf8');

  console.log(`  Applying ${version}...`);

  // Use a transaction for safety
  const applyMigration = db.transaction(() => {
    db.exec(sql);
    markMigration(db, version);
  });

  applyMigration();
  console.log(`  ✓ ${version} applied`);
}

// Get list of migration files
function getMigrationFiles() {
  const files = fs.readdirSync(MIGRATIONS_DIR)
    .filter(f => f.endsWith('.sql'))
    .sort();
  return files.map(f => path.join(MIGRATIONS_DIR, f));
}

// Show status
function showStatus(db) {
  const applied = getAppliedMigrations(db);
  const files = getMigrationFiles();

  console.log('\nMigration Status:\n');
  console.log('  File                    Status');
  console.log('  ─────────────────────── ─────────');

  for (const file of files) {
    const version = path.basename(file, '.sql');
    const status = applied.has(version) ? '✓ applied' : '○ pending';
    console.log(`  ${version.padEnd(24)} ${status}`);
  }

  const pending = files.length - applied.size;
  console.log(`\n  ${pending} migration(s) pending\n`);
}

// Main
function main() {
  const args = process.argv.slice(2);

  if (args.includes('--status')) {
    const db = new Database(DB_PATH);
    ensureMigrationsTable(db);
    showStatus(db);
    db.close();
    return;
  }

  if (args.includes('--reset')) {
    console.log('⚠️  Resetting all migrations...\n');
    const db = new Database(DB_PATH);
    ensureMigrationsTable(db);
    db.exec('DELETE FROM schema_migrations');
    console.log('  Migration history cleared.\n');
    db.close();

    // Re-run all migrations
    console.log('Re-running all migrations:\n');
  }

  console.log('Running migrations...\n');

  const db = new Database(DB_PATH);
  ensureMigrationsTable(db);

  const applied = getAppliedMigrations(db);
  const files = getMigrationFiles();

  let ran = 0;
  for (const file of files) {
    const version = path.basename(file, '.sql');
    if (!applied.has(version)) {
      try {
        runMigration(db, file);
        ran++;
      } catch (err) {
        console.error(`  ✗ ${version} failed: ${err.message}`);
        db.close();
        process.exit(1);
      }
    }
  }

  if (ran === 0) {
    console.log('  No pending migrations (database is up to date)');
  } else {
    console.log(`\n  ✓ ${ran} migration(s) applied successfully`);
  }

  db.close();
}

main();
