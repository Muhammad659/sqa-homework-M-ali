import { test as base } from "@playwright/test";
import { PreLoginPage } from "../pages/prelogin.page";

type PreLoginFixtures = {
  preLoginPage: PreLoginPage;
};

export const test = base.extend<PreLoginFixtures>({
  preLoginPage: async ({ page }, use) => {
    const preLoginPage = new PreLoginPage(page);

    await preLoginPage.open();
    await preLoginPage.dismissCookieNotice();

    await use(preLoginPage);
  },
});

export { expect } from "@playwright/test";
