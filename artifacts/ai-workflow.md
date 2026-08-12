# AI Workflow

I used ChatGPT/Codex because it could inspect the repository, explain Playwright and DeepEval decisions, edit the files, and run focused checks in one workflow. I did not combine it with Copilot or Claude because a second assistant would add conflicting suggestions without adding useful coverage for this small suite.

AI helped draft the fixture/page-helper structure, test-data separation, DeepEval bridge, and early documentation. I reviewed those changes against the live Permission AI behavior and rewrote the selector rationale, expected-failure explanation, and final submission documents.

AI was assuming suggested-topic pills will render on the first load. They actually require a page reload to appear. I identified this by inspecting the live page. This led me updating the test to fully load the landing page once and then performing a reload.

I did not trust AI to choose the final selectors from the page HTML alone. Its first assistant-message selector depended on styling and structure that could change in different layouts. I manually inspected the live DOM in the browser console, selected the response element, and moved through its parent elements. This revealed the complete assistant-message row and led to the centralized `#root div.flex.justify-start` fallback.
