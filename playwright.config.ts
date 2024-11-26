import { defineConfig, devices } from '@playwright/test';
import { channel } from 'diagnostics_channel';
import { OrtoniReportConfig } from 'ortoni-report';


const timestamp = Date.now();
const reportDir = `./reporter/playwright-reports-${timestamp}`;
const reportConfig: OrtoniReportConfig = {
  base64Image: true,
  title: "Sonic Framework with Typescript",
  showProject: true,
  filename: "OrtoniHtmlReport",
  authorName: "Ajay Michael",
  preferredTheme: "dark",
  folderPath: "html-report",
  projectName: "Playwright Framework with Typescript",
}
export default defineConfig({
  timeout: 550000,

  expect: {
    timeout: 20000

  },
  testDir: './tests',
  // globalSetup: require.resolve('utils/jiraReport.ts'),

  fullyParallel: false,
  retries: 0,
  workers: 1,
  repeatEach: 0,
  //globalSetup: './global.setup.ts',
  reporter: [['html', { outputFolder: reportDir, open: 'always' }], [`./CustomReporterConfig.ts`], ['line'], ["allure-playwright"]
    , ['ortoni-report', reportConfig]],
  //reporter: [['html', { open: 'always' }]],
  use: {
    actionTimeout: 20000,
    trace: 'on',
    headless: false,
    screenshot: "on",
    browserName: 'chromium',
    video: 'on',
    ignoreHTTPSErrors: true,
    bypassCSP: true,
   // storageState: "logins/salesforceLogin.json"

  },

  // testMatch: [
  //   '*/tests/admin/adminGroups_CustomerAdminGroupUserCreation/**/*.spec.ts',
  //   '*/tests/admin/adminGroups2/**/*.spec.ts',
  // ],

  projects: [
    /*  {
       name: 'Chromium',
       use: {
         ...devices['Desktop Chromium'],=
         ignoreHTTPSErrors: true,
         headless: false,
         video: 'on',
         screenshot: "on",
         viewport: null,
         launchOptions: {
           slowMo: 300,
           args: ["--start-maximized", "--disable-web-security", "--disable-features=IsolateOrigins,site-per-process", '--no-proxy-server']
         },
 
 
       }
 
     }, */
    {
      name: 'chrome',
      use: {
        browserName: 'chromium', channel: 'chrome', headless: false,
        viewport: null,
        launchOptions: {
          slowMo: 300,
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
