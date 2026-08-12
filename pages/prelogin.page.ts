import type { Locator, Page } from "@playwright/test";
import { TEST_TIMEOUTS } from "../test-data/prelogin.data";

export class PreLoginPage {
  readonly page: Page;
  readonly cookieNotice: Locator;
  readonly chatInput: Locator;
  readonly sendButton: Locator;
  readonly stopButton: Locator;
  readonly assistantMessages: Locator;
  readonly visibleErrorAlerts: Locator;
  private readonly rejectAllCookiesButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.cookieNotice = page.getByRole("dialog", {
      name: "Cookie Notice",
    });

    this.rejectAllCookiesButton = this.cookieNotice.getByRole("button", {
      name: "Reject All",
      exact: true,
    });

    this.chatInput = page.getByTestId("agent-chat-input");
    this.sendButton = page.getByTestId("agent-chat-input-send-button");
    this.stopButton = page.getByTestId("agent-chat-input-stop-button");

    // The external application exposes no semantic role or test attribute for
    // chat messages. DevTools inspection confirmed that assistant message rows
    // use justify-start, while user message rows use justify-end.
    this.assistantMessages = page.locator("#root div.flex.justify-start");

    this.visibleErrorAlerts = page.getByRole("alert").filter({
      visible: true,
    });
  }

  async open(): Promise<void> {
    await this.page.goto("/");
  }

  async dismissCookieNotice(): Promise<void> {
    if (!(await this.cookieNotice.isVisible())) {
      return;
    }

    await this.rejectAllCookiesButton.click();
    await this.cookieNotice.waitFor({ state: "hidden" });
  }

  async reload(): Promise<void> {
    await this.page.reload();
  }

  suggestedTopicButton(topicName: string): Locator {
    return this.page.getByRole("button", {
      name: topicName,
      exact: true,
    });
  }

  getSuggestedTopicButtons(topicNames: readonly string[]): Locator[] {
    return topicNames.map((topicName) => this.suggestedTopicButton(topicName));
  }

  async getVisibleSuggestedTopicNames(
    topicNames: readonly string[],
  ): Promise<string[]> {
    const topicButtons = this.getSuggestedTopicButtons(topicNames);

    await Promise.all(
      topicButtons.map((topicButton) =>
        topicButton.waitFor({
          state: "visible",
          timeout: TEST_TIMEOUTS.suggestedTopicsVisible,
        }),
      ),
    );

    return Promise.all(
      topicButtons.map((topicButton) => topicButton.innerText()),
    );
  }

  async selectSuggestedTopic(topicName: string): Promise<void> {
    await this.suggestedTopicButton(topicName).click();
  }

  async submitQuestion(question: string): Promise<void> {
    await this.chatInput.fill(question);
    await this.chatInput.press("Enter");
  }

  async enterMultiline(firstLine: string, secondLine: string): Promise<void> {
    await this.chatInput.fill(firstLine);
    await this.chatInput.press("Shift+Enter");
    await this.chatInput.pressSequentially(secondLine);
  }

  async getAssistantResponseCount(): Promise<number> {
    return this.assistantMessages.count();
  }

  get latestAssistantMessage(): Locator {
    return this.assistantMessages.last();
  }

  async getLatestAssistantResponseText(): Promise<string> {
    return (await this.latestAssistantMessage.innerText()).trim();
  }

  async waitForStreamingToComplete(): Promise<void> {
    await this.stopButton.waitFor({
      state: "hidden",
      timeout: TEST_TIMEOUTS.streamingComplete,
    });
  }
}
