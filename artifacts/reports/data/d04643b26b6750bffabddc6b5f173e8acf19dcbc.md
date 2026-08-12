# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: prelogin.spec.ts >> shows suggested topics when the page loads
- Location: tests\prelogin.spec.ts:16:5

# Error details

```
TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'What is Permission', exact: true }) to be visible

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e6]:
    - generic [ref=e7]:
      - link "Permission" [ref=e10] [cursor=pointer]:
        - /url: /
        - img "Permission" [ref=e11]
      - generic [ref=e12]:
        - button "Log in" [ref=e13] [cursor=pointer]:
          - generic [ref=e14]: Log in
        - button "Sign Up" [ref=e15] [cursor=pointer]:
          - generic [ref=e16]: Sign Up
    - generic [ref=e17]:
      - generic [ref=e20]:
        - generic [ref=e22]:
          - img [ref=e25]
          - generic [ref=e26]:
            - heading "Permission Agent" [level=3] [ref=e27]
            - paragraph [ref=e28]: Here to help you Earn More
        - generic [ref=e36]:
          - paragraph [ref=e38]: Hello there. How can I help you today?
          - generic [ref=e39]: 10:48 PM
        - generic [ref=e41]:
          - generic [ref=e42]:
            - textbox "ASK anything..." [ref=e43]
            - paragraph [ref=e45]:
              - text: Press
              - code [ref=e46]: Shift
              - text: +
              - code [ref=e47]: Enter
              - text: for new line.
          - generic [ref=e48]:
            - button [disabled]:
              - img
        - generic [ref=e49]:
          - text: By using
          - link "Permission.ai" [ref=e50] [cursor=pointer]:
            - /url: https://www.permission.ai
          - text: ", you agree to our"
          - link "Terms of Use" [ref=e51] [cursor=pointer]:
            - /url: https://www.permission.ai/terms-of-use
          - text: and you acknowledge that you have read and understood our
          - link "Privacy Policy" [ref=e52] [cursor=pointer]:
            - /url: https://www.permission.ai/privacy-policy
          - text: ", and you consent to the collection, use, and disclosure of your information as described therein."
      - generic [ref=e53]:
        - generic [ref=e54]:
          - text: Copyright © 2026 Permission.ai | Permission ® is a registered trademark of Permission.ai
          - generic [ref=e55]: "|"
        - generic [ref=e56]:
          - link "Permission Home |" [ref=e57] [cursor=pointer]:
            - /url: https://www.permission.ai
          - link "Privacy Policy |" [ref=e58] [cursor=pointer]:
            - /url: https://permission.io/privacy-policy
          - link "Terms of Use |" [ref=e59] [cursor=pointer]:
            - /url: https://www.permission.io/terms-of-use
          - link "Support" [ref=e60] [cursor=pointer]:
            - /url: https://permission.deskpro.com
  - generic:
    - dialog "Cookie Notice" [ref=e62]:
      - button "Cookies" [ref=e64] [cursor=pointer]:
        - img "Cookies Button" [ref=e65]
      - generic [ref=e79]:
        - generic [ref=e80]:
          - generic:
            - heading "Cookie Notice" [level=2] [ref=e81]
            - generic [ref=e82]:
              - text: Permission uses cookies and other personal information to improve your experience. You can manage your privacy settings by clicking ‘Manage Settings.’ See our
              - link "More information about your privacy, opens in a new tab" [ref=e83] [cursor=pointer]:
                - /url: https://permission.io/privacy-policy/
                - text: Privacy Policy
        - generic [ref=e85]:
          - button "Accept All" [ref=e87] [cursor=pointer]
          - button "Reject All" [ref=e89] [cursor=pointer]
          - button "Manage Settings, Opens the preference center dialog" [ref=e91] [cursor=pointer]: Manage Settings
    - text: Manage Settings
```

# Test source

```ts
  1   | import type { Locator, Page } from "@playwright/test";
  2   | import { TEST_TIMEOUTS } from "../test-data/prelogin.data";
  3   | 
  4   | export class PreLoginPage {
  5   |   readonly page: Page;
  6   |   readonly cookieNotice: Locator;
  7   |   readonly chatInput: Locator;
  8   |   readonly sendButton: Locator;
  9   |   readonly stopButton: Locator;
  10  |   readonly assistantMessages: Locator;
  11  |   readonly visibleErrorAlerts: Locator;
  12  |   private readonly rejectAllCookiesButton: Locator;
  13  | 
  14  |   constructor(page: Page) {
  15  |     this.page = page;
  16  | 
  17  |     this.cookieNotice = page.getByRole("dialog", {
  18  |       name: "Cookie Notice",
  19  |     });
  20  | 
  21  |     this.rejectAllCookiesButton = this.cookieNotice.getByRole("button", {
  22  |       name: "Reject All",
  23  |       exact: true,
  24  |     });
  25  | 
  26  |     this.chatInput = page.getByTestId("agent-chat-input");
  27  |     this.sendButton = page.getByTestId("agent-chat-input-send-button");
  28  |     this.stopButton = page.getByTestId("agent-chat-input-stop-button");
  29  | 
  30  |     // The external application exposes no semantic role or test attribute for
  31  |     // chat messages. DevTools inspection confirmed that assistant message rows
  32  |     // use justify-start, while user message rows use justify-end.
  33  |     this.assistantMessages = page.locator("#root div.flex.justify-start");
  34  | 
  35  |     this.visibleErrorAlerts = page.getByRole("alert").filter({
  36  |       visible: true,
  37  |     });
  38  |   }
  39  | 
  40  |   async open(): Promise<void> {
  41  |     await this.page.goto("/");
  42  |   }
  43  | 
  44  |   async dismissCookieNotice(): Promise<void> {
  45  |     if (!(await this.cookieNotice.isVisible())) {
  46  |       return;
  47  |     }
  48  | 
  49  |     await this.rejectAllCookiesButton.click();
  50  |     await this.cookieNotice.waitFor({ state: "hidden" });
  51  |   }
  52  | 
  53  |   async reload(): Promise<void> {
  54  |     await this.page.reload();
  55  |   }
  56  | 
  57  |   suggestedTopicButton(topicName: string): Locator {
  58  |     return this.page.getByRole("button", {
  59  |       name: topicName,
  60  |       exact: true,
  61  |     });
  62  |   }
  63  | 
  64  |   getSuggestedTopicButtons(topicNames: readonly string[]): Locator[] {
  65  |     return topicNames.map((topicName) => this.suggestedTopicButton(topicName));
  66  |   }
  67  | 
  68  |   async getVisibleSuggestedTopicNames(
  69  |     topicNames: readonly string[],
  70  |   ): Promise<string[]> {
  71  |     const topicButtons = this.getSuggestedTopicButtons(topicNames);
  72  | 
  73  |     await Promise.all(
  74  |       topicButtons.map((topicButton) =>
> 75  |         topicButton.waitFor({
      |                     ^ TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
  76  |           state: "visible",
  77  |           timeout: TEST_TIMEOUTS.suggestedTopicsVisible,
  78  |         }),
  79  |       ),
  80  |     );
  81  | 
  82  |     return Promise.all(
  83  |       topicButtons.map((topicButton) => topicButton.innerText()),
  84  |     );
  85  |   }
  86  | 
  87  |   async selectSuggestedTopic(topicName: string): Promise<void> {
  88  |     await this.suggestedTopicButton(topicName).click();
  89  |   }
  90  | 
  91  |   async submitQuestion(question: string): Promise<void> {
  92  |     await this.chatInput.fill(question);
  93  |     await this.chatInput.press("Enter");
  94  |   }
  95  | 
  96  |   async enterMultiline(firstLine: string, secondLine: string): Promise<void> {
  97  |     await this.chatInput.fill(firstLine);
  98  |     await this.chatInput.press("Shift+Enter");
  99  |     await this.chatInput.pressSequentially(secondLine);
  100 |   }
  101 | 
  102 |   async getAssistantResponseCount(): Promise<number> {
  103 |     return this.assistantMessages.count();
  104 |   }
  105 | 
  106 |   get latestAssistantMessage(): Locator {
  107 |     return this.assistantMessages.last();
  108 |   }
  109 | 
  110 |   async getLatestAssistantResponseText(): Promise<string> {
  111 |     return (await this.latestAssistantMessage.innerText()).trim();
  112 |   }
  113 | 
  114 |   async waitForStreamingToComplete(): Promise<void> {
  115 |     await this.stopButton.waitFor({
  116 |       state: "hidden",
  117 |       timeout: TEST_TIMEOUTS.streamingComplete,
  118 |     });
  119 |   }
  120 | }
  121 | 
```