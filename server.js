const express = require('express');
const path = require('path');
const db = require('./db');
const {
  literaryTime,
  paragraphs,
  validateHandle,
  validateTitle,
  validateBody,
} = require('./helpers');
const { seedIfEmpty } = require('./seed');

const INSTANCE_NAME = process.env.INSTANCE_NAME || 'magic circle';
const PORT = process.env.PORT || 3000;

// Seeding is opt-in via env var. Local dev sets SEED_DEV_DATA=1 in .env.
// Production (Railway) leaves it unset so a freshly-deployed instance opens
// empty and the founding gesture — the drawn-circle evocation — has its
// proper first-visit moment.
if (process.env.SEED_DEV_DATA === '1') {
  const seeded = seedIfEmpty();
  if (seeded) console.log('seeded dev data');
}

const app = express();
app.disable('x-powered-by');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// --- Containment -----------------------------------------------------------
// PRD: the room is closed to outsiders. Search engines don't index it;
// link-sharing tools don't unfurl it.
app.use((req, res, next) => {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
  next();
});

app.get('/robots.txt', (req, res) => {
  res.type('text/plain').send('User-agent: *\nDisallow: /\n');
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false, limit: '64kb' }));

// --- Prepared statements ---------------------------------------------------

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

const insertThreadStmt = db.prepare(
  'INSERT INTO threads (title, created_at) VALUES (?, ?)'
);
const insertPostStmt = db.prepare(
  'INSERT INTO posts (thread_id, body, handle, created_at) VALUES (?, ?, ?, ?)'
);

// A single transaction that creates a thread and its first post atomically,
// so no thread can exist without at least one post.
const createThread = db.transaction((title, body, handle) => {
  const now = Math.floor(Date.now() / 1000);
  const info = insertThreadStmt.run(title, now);
  const threadId = info.lastInsertRowid;
  insertPostStmt.run(threadId, body, handle, now);
  return threadId;
});

// --- Helpers ---------------------------------------------------------------

function renderThread(res, { thread, status = 200, composer }) {
  const posts = getThreadPosts.all(thread.id).map(p => ({
    ...p,
    paragraphs: paragraphs(p.body),
    timestamp_literary: literaryTime(p.created_at),
  }));
  res.status(status).render('layout', {
    view: 'thread',
    pageTitle: `${thread.title} • ${INSTANCE_NAME}`,
    instanceName: INSTANCE_NAME,
    thread,
    posts,
    composer: composer || { body: '', handle: '', error: null },
  });
}

function renderNewThread(res, { status = 200, composer }) {
  res.status(status).render('layout', {
    view: 'new-thread',
    pageTitle: `new thread • ${INSTANCE_NAME}`,
    instanceName: INSTANCE_NAME,
    composer: composer || { title: '', body: '', handle: '', error: null },
  });
}

// --- Routes ----------------------------------------------------------------

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

// Register /threads/new BEFORE /threads/:id so "new" doesn't match as an id.
app.get('/threads/new', (req, res) => {
  renderNewThread(res, {});
});

app.post('/threads', (req, res) => {
  const submitted = {
    title: typeof req.body.title === 'string' ? req.body.title : '',
    body: typeof req.body.body === 'string' ? req.body.body : '',
    handle: typeof req.body.handle === 'string' ? req.body.handle : '',
  };

  const titleResult = validateTitle(submitted.title);
  if (titleResult.error) {
    return renderNewThread(res, {
      status: 400,
      composer: { ...submitted, error: titleResult.error },
    });
  }
  const bodyResult = validateBody(submitted.body);
  if (bodyResult.error) {
    return renderNewThread(res, {
      status: 400,
      composer: { ...submitted, error: bodyResult.error },
    });
  }
  const handleResult = validateHandle(submitted.handle);
  if (handleResult.error) {
    return renderNewThread(res, {
      status: 400,
      composer: { ...submitted, error: handleResult.error },
    });
  }

  const threadId = createThread(titleResult.value, bodyResult.value, handleResult.value);
  res.redirect(`/threads/${threadId}`);
});

app.get('/threads/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(404).send('thread not found');
  }
  const thread = getThread.get(id);
  if (!thread) return res.status(404).send('thread not found');
  renderThread(res, { thread });
});

app.post('/threads/:id/reply', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(404).send('thread not found');
  }
  const thread = getThread.get(id);
  if (!thread) return res.status(404).send('thread not found');

  const submitted = {
    body: typeof req.body.body === 'string' ? req.body.body : '',
    handle: typeof req.body.handle === 'string' ? req.body.handle : '',
  };

  const bodyResult = validateBody(submitted.body);
  if (bodyResult.error) {
    return renderThread(res, {
      thread,
      status: 400,
      composer: { ...submitted, error: bodyResult.error },
    });
  }
  const handleResult = validateHandle(submitted.handle);
  if (handleResult.error) {
    return renderThread(res, {
      thread,
      status: 400,
      composer: { ...submitted, error: handleResult.error },
    });
  }

  const now = Math.floor(Date.now() / 1000);
  const info = insertPostStmt.run(id, bodyResult.value, handleResult.value, now);
  res.redirect(`/threads/${id}#post-${info.lastInsertRowid}`);
});

app.listen(PORT, () => {
  console.log(`${INSTANCE_NAME} listening on http://localhost:${PORT}`);
  console.log(`database: ${process.env.DATABASE_PATH || './magic-circle.db'}`);
});
