import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDb() {
  const host = process.env.DB_HOST || 'localhost';
  const port = parseInt(process.env.DB_PORT, 10) || 3306;
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';

  console.log(`\nConnecting to MySQL at ${host}:${port} as user '${user}'...`);

  let connection;
  try {
    connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
      multipleStatements: true,
    });
    console.log('✓ Connected to MySQL successfully!');
  } catch (err) {
    console.error('\n❌ Could not connect to MySQL:');
    console.error(err.message);
    console.error('\n👉 Please check `backend/.env` and make sure `DB_PASSWORD` matches your MySQL root password.');
    process.exit(1);
  }

  try {
    const projectRoot = path.resolve(__dirname, '../../../');
    const schemaPath = path.join(projectRoot, 'database', 'schema.sql');
    const seedPath = path.join(projectRoot, 'database', 'seed.sql');

    console.log('Running database/schema.sql...');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await connection.query(schemaSql);
    console.log('✓ Schema created (users, stores, ratings tables ready).');

    console.log('Running database/seed.sql...');
    const seedSql = fs.readFileSync(seedPath, 'utf8');
    await connection.query(seedSql);
    console.log('✓ Seed data inserted (Admin: admin@example.com / Admin@123).');

    console.log('\n🎉 Database setup is 100% complete!\n');
  } catch (err) {
    console.error('\n❌ Error executing SQL script:');
    console.error(err.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

initDb();
