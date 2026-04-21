const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

// Input constraints (from build-spec).
const HANDLE_MAX = 32;
const TITLE_MAX = 200;
const BODY_MAX = 10000;

function calendarDayDiff(later, earlier) {
  const laterStart = new Date(later.getFullYear(), later.getMonth(), later.getDate()).getTime();
  const earlierStart = new Date(earlier.getFullYear(), earlier.getMonth(), earlier.getDate()).getTime();
  return Math.round((laterStart - earlierStart) / (1000 * 60 * 60 * 24));
}

function literaryTime(tsSeconds, nowSeconds) {
  const now = nowSeconds == null ? Math.floor(Date.now() / 1000) : nowSeconds;
  const diff = now - tsSeconds;
  const tsDate = new Date(tsSeconds * 1000);
  const nowDate = new Date(now * 1000);

  if (diff < 60) return 'just now';
  if (diff < 3600) {
    const minutes = Math.floor(diff / 60);
    return minutes === 1 ? 'a minute ago' : `${minutes} minutes ago`;
  }

  const calDays = calendarDayDiff(nowDate, tsDate);

  if (calDays === 0) {
    const h = tsDate.getHours();
    if (h < 12) return 'this morning';
    if (h < 17) return 'this afternoon';
    return 'this evening';
  }
  if (calDays === 1) return 'yesterday';
  if (calDays < 7) return DAYS[tsDate.getDay()];
  if (calDays < 14) return 'last ' + DAYS[tsDate.getDay()];
  if (calDays < 31) return 'a few weeks ago';
  if (calDays < 62) return 'last month';
  if (tsDate.getFullYear() === nowDate.getFullYear()) {
    return `${tsDate.getDate()} ${MONTHS[tsDate.getMonth()]}`;
  }
  return `${MONTHS[tsDate.getMonth()]} ${tsDate.getFullYear()}`;
}

// Paragraph split: per PRD, "line breaks in the body render as paragraph
// breaks." Consecutive newlines collapse into a single split point.
function paragraphs(body) {
  return body.split(/\n+/).map(p => p.trim()).filter(p => p.length > 0);
}

// Per PRD: strip leading/trailing whitespace, normalize internal whitespace
// (including newlines) to single spaces. Unicode allowed.
function normalizeHandle(raw) {
  if (typeof raw !== 'string') return '';
  return raw.trim().replace(/\s+/g, ' ');
}

function validateHandle(raw) {
  const value = normalizeHandle(raw);
  if (value.length === 0) return { error: 'a handle is required to post.' };
  if (value.length > HANDLE_MAX) return { error: `a handle can be at most ${HANDLE_MAX} characters.` };
  return { value };
}

function validateTitle(raw) {
  const value = typeof raw === 'string' ? raw.trim() : '';
  if (value.length === 0) return { error: 'the thread needs a title.' };
  if (value.length > TITLE_MAX) return { error: `the title can be at most ${TITLE_MAX} characters.` };
  return { value };
}

function validateBody(raw) {
  const value = typeof raw === 'string' ? raw.trim() : '';
  if (value.length === 0) return { error: 'the post is empty.' };
  if (value.length > BODY_MAX) return { error: `the post is longer than ${BODY_MAX} characters.` };
  return { value };
}

module.exports = {
  literaryTime,
  paragraphs,
  normalizeHandle,
  validateHandle,
  validateTitle,
  validateBody,
  HANDLE_MAX,
  TITLE_MAX,
  BODY_MAX,
};
