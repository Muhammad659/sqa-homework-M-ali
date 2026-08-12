# Non-Deterministic Response Assertions

## What I assert

For the `What is Permission` suggested topic, the suite checks that:

- streaming starts: Stop appears and the ASK input becomes disabled;
- streaming finishes without a fixed sleep: Stop disappears, Send returns, and the input becomes enabled;
- exactly one assistant response is added;
- the newest response is non-empty and at least 50 characters long;
- no visible accessible error alert appears; and
- DeepEval's `AnswerRelevancyMetric` gives the answer a score of at least `0.7` using Gemini. A failure includes the score and judge explanation.

These checks work together. The browser assertions catch missing, stuck, or obviously truncated responses. DeepEval catches a response that looks complete but does not answer the selected question.

## What I do not assert

I do not assert exact response text, mandatory keywords, punctuation, capitalization, formatting, paragraph count, timestamps, or one exact length. The older keyword checks remain commented out in the code for comparison, but they do not run. I also do not treat relevance as proof that every factual claim is correct.

## Why

The agent streams different wording on each run, so exact-text and keyword-only checks can reject reasonable paraphrases. I chose DeepEval because `AnswerRelevancyMetric` directly fits this single question-and-answer check and integrates through a small Python bridge.
