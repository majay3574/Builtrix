import { createJiraIssue } from "./jira-integration";
import { TestInfo } from "@playwright/test";

/**
 * Logs a defect in Jira if the test has failed.
 * @param testInfo Information about the current test, including its status and details.
 * @returns A promise that resolves to the key of the created Jira issue, or undefined if the test didn't fail.
 */
export async function logADefectInJira(testInfo: TestInfo): Promise<string | undefined> {
    const isNonBug=testInfo.annotations.some(annotation=>annotation.type=== 'Bug')
    if (testInfo.status === "failed" && !isNonBug || testInfo.status==="timedOut" && !isNonBug) {
        // Create a summary and description for the Jira issue
        const summary = `Test failed: ${testInfo.title}`;
        const description = `Here is the error: ${testInfo.error?.message}`;
        // Create a Jira issue and get the issue key
        const issueKey = await createJiraIssue(summary, description);
    return issueKey;
    }
    return undefined;
}
export { createJiraIssue };
