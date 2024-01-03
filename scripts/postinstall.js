const { readdirSync, readFileSync, existsSync, lstatSync } = require('fs');
const { resolve, join } = require('path');
const { Pool } = require('pg');
require('dotenv').config();

let pool;
try {
  const sqlPath = resolve('./db/sql');
  pool = new Pool();

  if (!existsSync(sqlPath)) {
    throw new Error(`Directory ${sqlPath} not found.`);
  }

  const fileNames = readdirSync(sqlPath);
  for (const fileName of fileNames) {
    if (!fileName.endsWith('.sql')) continue;
    console.info(`Processing ${fileName}...`);
    const filePath = join(sqlPath, fileName);
    const fileStat = lstatSync(filePath);
    if (fileStat.isFile()) {
      const sqlContent = readFileSync(filePath, 'utf8');
      pool.query(sqlContent);
    }
  }
} catch (error) {
  console.error(error.message);
  exit - 1;
} finally {
  pool && pool.end();
}