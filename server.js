const express = require('express');
const path = require('path');
const db = require('./db');
const { literaryTime, paragraphs } = require('./helpers');
const { seedIfEmpty } = require('./seed');

const INSTANCE_NAME = process.env.INSTANCE_NAME || 'magic circle';
const PORT = process.env.PORT || 3000;

const seeded = seedIfEmpty();
if (seeded) console.log('seeded dev data');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

const listThreads = db.prepare(`
  SELECT
    t.id,
    t.title,
    (SELECT p.handle FROM posts p WHERE p.thread_id = t.id ORDER BY p.created_at ASC, p.id ASC LIMIT 1) AS author,
    (SELECT MAX(p.created_at) FROM posts p WHERE p.thread_id = t.id) AS last_activity
  FROM threads t
  ORDER BY last_activity DESC, t.id DESC
`);

const getThread = db.prepare('SELECT * FROM threads WHERE id = ?');
const getThreadPosts = db.prepare(
  'SELECT * FROM posts WHERE thread_id = ? ORDER BY created_at ASC, id ASC'
);

app.get('/', (req, res) => {
  const rows = listThreads.all();
  const threads = rows.map(r => ({
    ...r,
    last_activity_literary: r.last_activity ? literaryTime(r.last_activity) : '',
  }));

  res.render('layout', {
    view: 'index',
    pageTitle: INSTANCE_NAME,
    instanceName: INSTANCE_NAME,
    threads,
  });
});

app.get('/threads/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(404).send('thread not found');
  }

  const thread = getThread.get(id);
  if (!thread) return res.status(404).send('thread not found');

  const posts = getThreadPosts.all(id).map(p => ({
    ...p,
    paragraphs: paragraphs(p.body),
    timestamp_literary: literaryTime(p.created_at),
  }));

  res.render('layout', {
    view: 'thread',
    pageTitle: `${thread.title} • ${INSTANCE_NAME}`,
    instanceName: INSTANCE_NAME,
    thread,
    posts,
  });
});

app.listen(PORT, () => {
  console.log(`${INSTANCE_NAME} listening on http://localhost:${PORT}`);
  console.log(`database: ${process.env.DATABASE_PATH || './magic-circle.db'}`);
});
