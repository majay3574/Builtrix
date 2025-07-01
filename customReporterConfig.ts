import { Reporter, FullConfig, Suite, TestCase, TestResult, TestStep } from "@playwright/test/reporter";
import winston from 'winston';

// Custom Winston Logger Setup
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ level, message, timestamp }) => `[${timestamp}] ${level.toUpperCase()}: ${message}`)
    ),
    transports: [
        new winston.transports.Console({ level: 'debug' }),
        new winston.transports.File({ filename: 'logs/info.log', level: 'info' }),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/debug.log', level: 'debug' }),
    ],
});

class CustomReporter implements Reporter {
    onBegin(config: FullConfig, suite: Suite): void {
        const totalTests = suite.allTests().length;
        logger.info(`Starting the test run with ${totalTests} test${totalTests !== 1 ? 's' : ''}`);
    }

    onTestBegin(test: TestCase): void {
        logger.info(`➡️  Test started: ${test.title}`);
    }

    onStep(test: TestCase, result: TestResult, step: TestStep): void {
        const message = `🔹 Step "${step.title}" in test "${test.title}"`;

        if (step.error) {
            logger.error(`${message} failed with error: ${step.error.message}`);
        } else {
            logger.info(`${message} completed successfully`);
        }
    }

    onTestEnd(test: TestCase, result: TestResult): void {
        const message = `✅ Test "${test.title}"`;

        switch (result.status) {
            case 'passed':
                logger.info(`${message} passed`);
                break;
            case 'failed':
                logger.error(`❌ ${message} failed: ${result.error?.message}`);
                break;
            case 'skipped':
                logger.warn(`⚠️  ${message} was skipped`);
                break;
        }
    }

    onEnd(result: { status: string }): void {
        logger.info(`🏁 Test run finished with status: ${result.status}`);
    }
}

export default CustomReporter;
