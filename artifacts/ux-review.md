# UX Review

## Method

I reviewed the product manually in desktop Chrome and used Chrome DevTools responsive mode for mobile. I compared the pre-login experience on both form factors and explored signup and the post-signup experience on desktop.

## What Works and

The pre-login chat worked well on desktop and mobile: the ASK input and controls were usable, responses were readable, and I found no other obvious mobile layout problems.

## What Is Rough

On a fresh visit, the suggested-topic pills were missing on both form factors. They appeared only after the anonymous session was initialized and the page was reloaded. This is an initial-state problem, not a mobile-specific layout issue.

Post-signup adds an ASK balance and email verification, but both introduce clarity and continuity problems which are explained in the improvements section below.

## Prioritized Improvements

1. **Render topics on the first visit.** Missing pills remove the guided examples that help new users understand what the agent can answer. Make sure to render the topics as soon as the initial anonymous session and suggestion data are ready, without requiring a reload.

2. **Keep verification in sync.** After registration, selecting **Verify now** in the email opened a second Permission tab, left the original tab stale, and required another sign-in. This interrupts a critical onboarding step. Synchronize verification across open Permission tabs so the original page updates and the user is automatically logged in.

3. **Clarify the ASK requirement.** A new account had 100 ASK, shown as 2% progress. The page said at least 4,900 ASK was needed, while the progress bar ended at 5,000. The intended calculation appears to be 5,000 total and 4,900 more. Label both values explicitly: **5,000 ASK required; 4,900 ASK remaining**.
