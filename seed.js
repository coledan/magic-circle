const db = require('./db');

const HOUR = 3600;
const DAY = 86400;

const SEED = [
  {
    title: 'the comment section, what we were really doing there',
    posts: [
      {
        handle: 'anders',
        secondsAgo: 30 * HOUR,
        body:
`I keep coming back to the question of what we were actually doing in the comment section of a 2004 Slate article or a Talking Points Memo blog. The official answer was discussion. The actual answer was something stranger. Most of us weren't there to debate the article — we were there because the article gave us a pretext to think out loud near other people who were also thinking out loud, and the article was the campfire we'd all gathered around.

When the comment section died — first to Disqus, then to social, then to nothing — what we lost was that pretext. Twitter offered the same nominal activity (talk about the news) but the structure was wrong. There was no campfire. Just a dispersed crowd shouting toward an algorithm.

I'm not arguing for bringing back comment sections under articles. That ship sailed and the writers were right to want it gone. But I think there's something worth recovering in the campfire form — a bounded space, attached to a thing worth thinking about, where the goal is the thinking-together more than any particular conclusion.`,
      },
      {
        handle: 'jules',
        secondsAgo: 18 * HOUR,
        body:
`There's a McLuhan-shaped argument lurking in here, which is that the medium of the comment section produced something the medium of the social feed cannot. The comment section was bounded, slow (relative to feeds), and contextually anchored. Posts referred to the article and to each other, in that order. The feed inverts this — the feed is the context, posts refer to other posts in the feed, and the originating thing becomes incidental.

What killed comment sections wasn't moderation cost. It was the migration of the impulse to elsewhere. By 2014 the people who would have been in a Slate comment thread were on Twitter, and the comment section died of attrition before it died of policy.`,
      },
      {
        handle: 'minor.thirds',
        secondsAgo: 6 * HOUR,
        body:
`the campfire framing is doing work for me, but i want to push on it. the campfires that worked, in my memory, weren't general — they were the ones with a specific community already half-formed around them. talking points memo comments worked because the readership was self-selected. slate comments worked less well because the readership was less coherent. the worst comment sections, anywhere by 2010, were on sites with national traffic and no community.

so maybe the campfire requires the kindling of a community that was already going to gather, and the article is the occasion, not the cause.`,
      },
      {
        handle: 'f.reed',
        secondsAgo: 2 * HOUR,
        body:
`agreed, but the asymmetry cuts the other way too — there were things that only worked on general-readership sites, because the people who showed up brought stuff the community didn't have. the campfire sometimes needs the stranger.

what I miss most isn't the comment thread per se but the specific pleasure of opening an article by someone you trust, scrolling to the bottom, and finding three or four real responses from people you'd come to recognize. it was a smaller thing than we make it out to be, and it was good.`,
      },
    ],
  },
  {
    title: "what's the right unit of attention in 2026",
    posts: [
      {
        handle: 'nightingale',
        secondsAgo: 40 * HOUR,
        body:
`A question that won't leave me alone: what's the default unit of attention now? An article, a tweet, an episode, a scroll session? Whatever it is, it seems shorter and more interruptible than it used to be, and I'm not convinced anyone chose it deliberately.

The book and the essay were both products of a reading economy where you expected to spend an hour, uninterrupted, with a single author's thinking. That reading economy is largely gone outside of specific pockets. What replaced it isn't one thing — it's a distribution of micro-attentions aggregated by platforms, which is a different shape entirely.`,
      },
      {
        handle: 'jules',
        secondsAgo: 32 * HOUR,
        body:
`The thing I want to defend is the hour-with-one-author unit. Not because it's prestigious but because certain kinds of thinking only become possible at that length. An essay that needs to earn its conclusion by walking you through three reversals cannot be extracted into a pullquote without destroying the shape of the argument.

We've optimized for excerption, and the excerpt became the default unit, and now people argue about the excerpts.`,
      },
      {
        handle: 'anders',
        secondsAgo: 26 * HOUR,
        body:
`Maybe attention and presence are different axes that we've been collapsing. You can be attentive without being present (reading a book on the subway), and present without being attentive (half-listening at dinner). The unit that's dying isn't attention, it's presence. Presence is the thing that gets fragmented.`,
      },
    ],
  },
  {
    title: 'old letterboxd reviews, read like field notes',
    posts: [
      {
        handle: 'jules',
        secondsAgo: 5 * DAY,
        body:
`Been going back through Letterboxd reviews of movies I saw a decade ago. The short ones, written by strangers, at 2am after a screening. They read like field notes — unselfconscious, contextually specific, not written for a future reader.

There is a thing about writing that isn't performing for anyone in particular that I think we've mostly lost, and the Letterboxd review circa 2014 is one of the few corpora of it we still have.`,
      },
      {
        handle: 'minor.thirds',
        secondsAgo: Math.floor(4.6 * DAY),
        body:
`this works only because the writer didn't know anyone would read it years later. as soon as review sites became platforms with followers, the unselfconsciousness died.

worth naming that the good stuff is almost always written by people who don't think of themselves as writers. the moment you start thinking of yourself as a writer the field notes become essays and they lose what made them good.`,
      },
      {
        handle: 'nightingale',
        secondsAgo: Math.floor(4.3 * DAY),
        body:
`Something we haven't fully reckoned with: there are thousands of people who left journals in public, unknowingly, on Goodreads, Letterboxd, RateYourMusic, old LiveJournals, obscure forums. A whole private literature of the 2000s-2010s sitting in semi-public archives. Someone should be reading it as a body of work.`,
      },
    ],
  },
  {
    title: 'a small rant about typography in fintech',
    posts: [
      {
        handle: 'f.reed',
        secondsAgo: 10 * DAY,
        body:
`Why does every fintech use the same neutral geometric sans? Inter, a little Circular, a dash of Aeonik if they're feeling bold. Pick a bank app at random and half the time you can't tell which one it is without reading the logo.

This isn't a neutral choice. It's signaling. The signal is "we are institutionally serious, we will not make a typographic commitment that could be read as character." But at some point the total absence of character becomes the character.`,
      },
      {
        handle: 'anders',
        secondsAgo: Math.floor(9.6 * DAY),
        body:
`I think it's downstream of B2B SaaS dictating the visual defaults for everything adjacent. Fintech inherited its typography from Stripe, Stripe inherited it from the rationalist design aesthetic of the late-2010s, and here we are.

What's striking is how many products that have nothing in common with a payments API have adopted payments-API typography. You can feel it in banking apps, mortgage portals, even investment platforms that should probably signal "old money, considered" instead.`,
      },
    ],
  },
  {
    title: 'the case against discoverability',
    posts: [
      {
        handle: 'minor.thirds',
        secondsAgo: 20 * DAY,
        body:
`discoverability is a default assumption that deserves to be questioned. the assumption is: more people finding the thing is better than fewer. but it's made certain kinds of writing functionally impossible, because anything you write in public is written under the implicit gaze of whoever could eventually find it.

what's the alternative, honestly, besides explicit containment. a space where search doesn't work, og tags aren't set, the URL is the entry mechanic. that's what i keep coming back to.`,
      },
      {
        handle: 'f.reed',
        secondsAgo: Math.floor(19.3 * DAY),
        body:
`this is kind of what private newsletters have been for the past five years — substack's initial appeal wasn't monetization, it was the fact that the piece wasn't indexed and the audience was self-selected.

but even substack is drifting toward discoverability now. so the question is how to do it without the drift. which i think is mostly a question of keeping the mechanics small and anti-growth.`,
      },
    ],
  },
  {
    title: 'books for thinking about institutions, slow ones',
    posts: [
      {
        handle: 'anders',
        secondsAgo: 45 * DAY,
        body:
`I'm looking for recommendations about institutions that last centuries — monasteries, universities, courts, long-lived scholarly societies. Most institutional theory I've encountered is about organizations on human timescales. I want the opposite: how does a thing stay recognizably itself across generations of people who have never met.`,
      },
      {
        handle: 'nightingale',
        secondsAgo: Math.floor(44.4 * DAY),
        body:
`Mary Douglas's *How Institutions Think* is the short version of this question done well. She's mostly concerned with how institutions shape cognition, but the mechanics she describes are exactly the ones that let an institution persist past the people in it.

For the long version: there's a literature on the Benedictine order that's surprisingly readable. The rule itself is a document about durability more than spirituality if you read it that way.`,
      },
      {
        handle: 'jules',
        secondsAgo: Math.floor(43.8 * DAY),
        body:
`Axelrod's *The Evolution of Cooperation* is adjacent but worth it. The core mechanism — tit-for-tat on iterated interactions — is what lets small long-lived institutions (monasteries, guilds, scholarly communities) hold together without needing centralized enforcement.

The thing nobody admits is that most surviving ancient institutions survived by being small enough that everyone inside knew everyone else.`,
      },
    ],
  },
];

function seedIfEmpty() {
  const count = db.prepare('SELECT COUNT(*) AS n FROM threads').get().n;
  if (count > 0) return false;

  const now = Math.floor(Date.now() / 1000);
  const insertThread = db.prepare('INSERT INTO threads (title, created_at) VALUES (?, ?)');
  const insertPost = db.prepare('INSERT INTO posts (thread_id, body, handle, created_at) VALUES (?, ?, ?, ?)');

  const tx = db.transaction(() => {
    for (const t of SEED) {
      const firstPostAt = now - t.posts[0].secondsAgo;
      const info = insertThread.run(t.title, firstPostAt);
      const threadId = info.lastInsertRowid;
      for (const p of t.posts) {
        insertPost.run(threadId, p.body, p.handle, now - p.secondsAgo);
      }
    }
  });
  tx();
  return true;
}

module.exports = { seedIfEmpty };
