const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const DATABASE_PATH = process.env.DATABASE_PATH || './magic-circle.db';
const db = new Database(DATABASE_PATH);

db.pragma('foreign_keys = ON');

const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
db.exec(schema);

db.exec('DROP TABLE IF EXISTS smoke_test;');

module.exports = db;
