import { defineConfig, devices } from '@playwright/test';

const timestamp = Date.now();
//const reportDir = `./reporter/playwright-reports-${timestamp}`;
export default defineConfig({
  timeout: 55 * 10000, //55_000

  expect: {
    timeout: 20000
  }
  ,
  testDir: './tests',

  fullyParallel: true,
  retries: 0,
  //workers: "100%",
  workers: 1,
  repeatEach: 0,

  reporter: [
    ['html', { outputFolder: "reporter", open: 'always' }],
    [`./customReporterConfig.ts`],
    ['allure-playwright'],
  ],
  //reporter: [['html', { outputFolder: 'reporter', open: 'never' }]],

  use: {
    actionTimeout: 20000,
    trace: 'on',
    headless: false,
    screenshot: "on",
    video: 'on',
    ignoreHTTPSErrors: true,
    bypassCSP: true,
    permissions: ['camera'],

    storageState: "logins/salesforceLogin.json"
  },

  // testMatch: [
  //   '*/tests/admin/adminGroups_CustomerAdminGroupUserCreation/**/*.spec.ts',
  //   '*/tests/admin/adminGroups2/**/*.spec.ts',
  // ],

  projects: [
    {
      name: 'chrome',
      use: {
        browserName: 'chromium', channel: 'chrome', headless: false,
        viewport: null,
        launchOptions: {
          //slowMo: 300,
          args: ["--start-maximized", "--disable-web-security", "--disable-features=IsolateOrigins,site-per-process", '--no-proxy-server']

        }

      }
    }, ...(
      true ? [{
        name: 'API Testing',
        testDir: './api',

        use: {
          headless: false,
          ...devices['Desktop Chromium'],
          viewport: null,
          launchOptions: {
            slowMo: 300,
            args: ["--start-maximized", "--disable-web-security"]
          }

        }
      },] : []
    ),
  ],



});