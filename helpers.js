const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

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

function paragraphs(body) {
  return body.split(/\n{2,}/).map(p => p.trim()).filter(p => p.length > 0);
}

module.exports = { literaryTime, paragraphs };
