const express = require('express');
const Database = require('better-sqlite3');

const DATABASE_PATH = process.env.DATABASE_PATH || './magic-circle.db';
const INSTANCE_NAME = process.env.INSTANCE_NAME || 'magic circle';
const PORT = process.env.PORT || 3000;

const db = new Database(DATABASE_PATH);
db.exec(`
  CREATE TABLE IF NOT EXISTS smoke_test (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message TEXT NOT NULL
  );
`);

const count = db.prepare('SELECT COUNT(*) AS n FROM smoke_test').get().n;
if (count === 0) {
  db.prepare('INSERT INTO smoke_test (message) VALUES (?)').run('magic circle');
}

const app = express();

app.get('/', (req, res) => {
  const row = db.prepare('SELECT message FROM smoke_test ORDER BY id LIMIT 1').get();
  const message = row ? row.message : '(no message)';
  res.type('html').send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${INSTANCE_NAME}</title>
</head>
<body>
  <h1>${message}</h1>
</body>
</html>
`);
});

app.listen(PORT, () => {
  console.log(`${INSTANCE_NAME} listening on http://localhost:${PORT}`);
  console.log(`database: ${DATABASE_PATH}`);
});
