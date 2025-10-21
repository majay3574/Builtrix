import { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import * as fs from 'fs';

type TestEntry = { name: string; status: string };

export default class MyReporter implements Reporter {
  private testResults: Record<string, TestEntry[]> = {};
  private summary = { passed: 0, failed: 0, skipped: 0 };

  onTestEnd(test: TestCase, result: TestResult) {
    // test.titlePath() returns array of describe blocks + test name
    const parts = test.titlePath();
    const describeName = parts.slice(0, -1).join(' › ') || 'Root';
    const testName = parts[parts.length - 1];

    if (!this.testResults[describeName]) {
      this.testResults[describeName] = [];
    }

    this.testResults[describeName].push({ name: testName, status: result.status });

    // Update summary
    if (result.status === 'passed') this.summary.passed++;
    else if (result.status === 'failed') this.summary.failed++;
    else if (result.status === 'skipped') this.summary.skipped++;
  }

  onEnd() {
    const lines: string[] = [];

    for (const describe in this.testResults) {
      lines.push(describe + ':');
      this.testResults[describe].forEach(tr => {
        lines.push(`  › ${tr.name} : ${tr.status}`);
      });
      lines.push(''); // blank line between describe blocks
    }

    lines.push('Summary:');
    lines.push(`Passed: ${this.summary.passed}`);
    lines.push(`Failed: ${this.summary.failed}`);
    lines.push(`Skipped: ${this.summary.skipped}`);

    fs.writeFileSync('test-results.txt', lines.join('\n'));
    console.log('Test summary saved to test-results.txt');
  }
}
