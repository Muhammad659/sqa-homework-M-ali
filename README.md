# Permission AI Pre-Login Tests

Pre-login QA suite for the agent at [ask.permission.ai](https://ask.permission.ai). Six tests, one DeepEval/Gemini relevance check.

# Setup

Windows (PowerShell). Requires Node.js 20+, Python 3.9+ (`py` launcher), Git, and a Gemini API key.

```powershell
git clone https://github.com/Muhammad659/sqa-homework-M-ali.git
Set-Location sqa-homework-M-ali
npm ci
py -3 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
Copy-Item .env.example .env
npx playwright install
```

Open `.env`, replace only the placeholder. Other values are preset; `.env` is Git-ignored.

```dotenv
GOOGLE_API_KEY=your_real_gemini_api_key
```

Run and view the report:

```powershell
npm test
npm run report
```

Useful during development:

```powershell
npm run test:list          # list executions without running
npm run test:chromium      # one browser only (conserves Gemini quota)
npm test -- --headed       # all browsers, visible
npm test -- -g "returns an agent response after submitting"
```

macOS/Linux: use `python3 -m venv .venv` and `.venv/bin/python` in steps 4–5.

# Test strategy (TL;DR)

Covers all 4 required behaviors plus 2 of my own: pill visibility on first load and after an initialized session reloads, free-text reply, topic-click reply with semantic scoring, Shift+Enter newline, and send-disabled-on-empty. All 6 run in Chromium, Firefox, and WebKit — 18 executions, one worker, no retries. The first-load pill failure is a live defect kept visible via `test.fail()` rather than reloaded away. Skipped: post-login automation (out of scope per the brief), mobile-viewport layout (covered in the UX review), and exact-text assertions (the flaky trap the brief calls out).

# Key decisions

- `test.fail()` **on the first-load pill defect, not a silent reload** — keeps the bug in the report and self-flags if it's ever fixed.
- **A second test proves the contrast** — pills render once the session is initialized and reloaded, so the defect is demonstrated, not just claimed.
- **Waits on UI state, never a sleep** — streaming starts when the stop button appears, ends when it disappears. Named timeouts live in `test-data/prelogin.data.ts`.
- `getByTestId`**/**`getByRole` **first** — input, send, and stop use test IDs; topics and the cookie dialog use accessible roles. Restyling doesn't break them.
- **One documented CSS fallback** — the site exposes no role or test ID for message rows, so assistant rows match on layout class. It lives only in `pages/prelogin.page.ts`, making a markup change a one-line edit, not a rewrite.
- **Real DeepEval in Python over the npm package** — the Python `AnswerRelevancyMetric` scores locally against a judge model; the npm package has no equivalent offline metric. TypeScript calls it via a short subprocess bridge.
- **Judge pinned to `temperature=0`, threshold 0.7** — the same answer should score the same way twice.
- **Structural checks always run alongside the score** — response count, non-empty text, 50-character minimum, zero visible error alerts. Catches fluent-but-broken output a relevance score alone would pass.
- **One worker, no retries** — this hits a live public endpoint, and retries would mask real failures as flakes.

# AI disclosure

See [artifacts/ai-workflow.md](./artifacts/ai-workflow.md).

# Next steps

With 1–2 more days: wire this into GitHub Actions on push, gated on the 4 required behaviors; restrict the judge to one browser so a run can't exhaust the Gemini free tier (20/day, several calls per measurement); run a golden-question set nightly to catch relevance regressions; add a mobile-viewport test; and push for a `data-testid` on message rows to retire the CSS fallback.

# Submission checklist

- [✅] Repo renamed to `sqa-homework-muhammad-ali`, default branch `main`
- [✅] README Setup commands verified from a clean clone
- [✅] README ≤ 500 words (excluding commands/checkboxes)
- [✅] Max 8 tests; all 4 required behaviors covered
- [✅] `artifacts/assertions.md` filled in, ≤ 300 words
- [✅] `artifacts/ux-review.md` filled in from real exploration, ≤ 400 words
- [✅] `artifacts/data-checks.md` filled in, ≤ 300 words + SQL
- [✅] `artifacts/ai-workflow.md` filled in, ≤ 300 words
- [✅] `artifacts/report/` generated
- [✅] `artifacts/demo.mp4` recorded, 60-90s narrated
- [✅] Commit history shows real progression, not one giant commit
