import { test, expect } from "../fixtures/prelogin.fixture";
import { evaluateResponseRelevance } from "../evaluators/deepeval-evaluator";
import {
  EMPTY_INPUT_VALUE,
  FREE_TEXT_QUESTION,
  MINIMUM_RESPONSE_LENGTH,
  MULTILINE_INPUT,
  // RELATED_PERMISSION_KEYWORDS,
  // REQUIRED_PERMISSION_KEYWORD,
  SUGGESTED_TOPIC_NAMES,
  TEST_TIMEOUTS,
  WHAT_IS_PERMISSION_QUESTION,
  WHAT_IS_PERMISSION_TOPIC,
} from "../test-data/prelogin.data";

test("shows suggested topics when the page loads", async ({ preLoginPage }) => {
  test.fail(
    true,
    "Known product defect: topic pills are missing on a fresh visit",
  );

  const visibleTopicNames = await preLoginPage.getVisibleSuggestedTopicNames(
    SUGGESTED_TOPIC_NAMES,
  );

  expect(visibleTopicNames).toEqual(SUGGESTED_TOPIC_NAMES);
});

test("shows suggested topics after reloading an initialized anonymous session", async ({
  preLoginPage,
}) => {
  await preLoginPage.reload();

  const visibleTopicNames = await preLoginPage.getVisibleSuggestedTopicNames(
    SUGGESTED_TOPIC_NAMES,
  );

  expect(visibleTopicNames).toEqual(SUGGESTED_TOPIC_NAMES);
});

test("returns an agent response after submitting a free-text question", async ({
  preLoginPage,
}) => {
  await expect(preLoginPage.chatInput).toBeEnabled({
    timeout: TEST_TIMEOUTS.inputReady,
  });

  const responseCountBefore = await preLoginPage.getAssistantResponseCount();

  await preLoginPage.submitQuestion(FREE_TEXT_QUESTION);

  // Confirm that streaming started.
  await expect(preLoginPage.stopButton).toBeVisible({
    timeout: TEST_TIMEOUTS.streamingStart,
  });
  await expect(preLoginPage.chatInput).toBeDisabled();

  // Wait for streaming to finish.
  await preLoginPage.waitForStreamingToComplete();

  // Confirm that the chat is ready again.
  await expect(preLoginPage.sendButton).toBeVisible();
  await expect(preLoginPage.chatInput).toBeEnabled();

  // Confirm that exactly one assistant response was added.
  await expect(preLoginPage.assistantMessages).toHaveCount(
    responseCountBefore + 1,
  );

  await expect(preLoginPage.latestAssistantMessage).not.toBeEmpty();

  const responseText = await preLoginPage.getLatestAssistantResponseText();

  expect(responseText.length).toBeGreaterThanOrEqual(MINIMUM_RESPONSE_LENGTH);

  await expect(preLoginPage.visibleErrorAlerts).toHaveCount(0);
});

test("returns a complete relevant response after selecting What is Permission", async ({
  preLoginPage,
}) => {
  test.setTimeout(TEST_TIMEOUTS.semanticResponseTest);

  await preLoginPage.reload();

  const responseCountBefore = await preLoginPage.getAssistantResponseCount();

  await preLoginPage.selectSuggestedTopic(WHAT_IS_PERMISSION_TOPIC);

  // Confirm that streaming started.
  await expect(preLoginPage.stopButton).toBeVisible({
    timeout: TEST_TIMEOUTS.streamingStart,
  });
  await expect(preLoginPage.chatInput).toBeDisabled();

  // Wait for streaming to finish.
  await preLoginPage.waitForStreamingToComplete();

  // Confirm that the chat is ready again.
  await expect(preLoginPage.sendButton).toBeVisible();
  await expect(preLoginPage.chatInput).toBeEnabled();

  // Confirm that exactly one assistant response was added.
  await expect(preLoginPage.assistantMessages).toHaveCount(
    responseCountBefore + 1,
  );

  await expect(preLoginPage.latestAssistantMessage).not.toBeEmpty();

  const responseText = await preLoginPage.getLatestAssistantResponseText();

  expect(responseText.length).toBeGreaterThanOrEqual(MINIMUM_RESPONSE_LENGTH);

  // expect(responseText).toMatch(REQUIRED_PERMISSION_KEYWORD);
  // expect(responseText).toMatch(RELATED_PERMISSION_KEYWORDS);

  await expect(preLoginPage.visibleErrorAlerts).toHaveCount(0);

  const relevanceEvaluation = await evaluateResponseRelevance({
    question: WHAT_IS_PERMISSION_QUESTION,
    response: responseText,
  });

  expect(
    relevanceEvaluation.passed,
    `DeepEval score: ${relevanceEvaluation.score}. Reason: ${relevanceEvaluation.reason}`,
  ).toBe(true);
});

test("inserts a newline without submitting when Shift+Enter is pressed", async ({
  preLoginPage,
}) => {
  await expect(preLoginPage.chatInput).toBeEnabled({
    timeout: TEST_TIMEOUTS.inputReady,
  });

  const responseCountBefore = await preLoginPage.getAssistantResponseCount();

  await preLoginPage.enterMultiline(
    MULTILINE_INPUT.firstLine,
    MULTILINE_INPUT.secondLine,
  );

  await expect(preLoginPage.chatInput).toHaveValue(
    MULTILINE_INPUT.expectedValue,
  );
  await expect(preLoginPage.sendButton).toBeEnabled();
  await expect(preLoginPage.assistantMessages).toHaveCount(responseCountBefore);
  await expect(preLoginPage.stopButton).toBeHidden();
});

/* Additional test for extra coverage: an empty input disables Send. */
test("keeps the send button disabled when the ASK input is empty", async ({
  preLoginPage,
}) => {
  await expect(preLoginPage.chatInput).toBeEnabled({
    timeout: TEST_TIMEOUTS.inputReady,
  });

  await expect(preLoginPage.chatInput).toHaveValue(EMPTY_INPUT_VALUE);
  await expect(preLoginPage.sendButton).toBeDisabled();
});
