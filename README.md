# Magic Circle

A single-room forum. One instance is one room.

See `PRD.md` for what v0 is and why, `build-spec.md` for how it's built, and `design-decisions.md` for the resolved visual system.

## Run locally

Requires Node 20+.

```
npm install
npm start
```

Then open http://localhost:3000.

## Configuration

Environment variables (see `.env.example`):

- `DATABASE_PATH` — where the SQLite file lives. Defaults to `./magic-circle.db` for local dev. In production, point this at a file on a mounted persistent volume (e.g. `/data/magic-circle.db`).
- `INSTANCE_NAME` — what the wordmark displays. Defaults to `magic circle`.
- `PORT` — Express listen port. Defaults to `3000`. Railway sets this automatically.

## Database

SQLite via `better-sqlite3`. The package shipped a prebuilt binary on this machine, so no Visual Studio build tools were needed. If a future install on another machine fails to compile `better-sqlite3`, the build-spec's fallback is to swap to the `sqlite3` package (which ships prebuilt binaries) and port the database code to its callback API.

## Status

Milestone 1: Hello World Deploy — in progress. The app currently renders a single smoke-test row as `<h1>` on `/`, to prove the local → Railway → persistent-volume path before any real features are built.
