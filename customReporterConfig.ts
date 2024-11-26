import { Reporter, TestCase, TestError, TestResult, TestStep } from "@playwright/test/reporter";
const winston = require('winston');

const customFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ level, message, timestamp }) => `[${timestamp}] ${level.toUpperCase()}: ${message}`)
);


const logger = winston.createLogger({
    level: 'info',
    format: customFormat,
    transports: [
        new winston.transports.Console({ level: 'debug' }), // Logs to console
        new winston.transports.File({ filename: 'logs/info.log', level: 'info' }), // Info-level logs
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }), // Error-level logs
        new winston.transports.File({ filename: 'logs/debug.log', level: 'debug' }), // Debug logs
    ],
});

// Custom Playwright Reporter
class CustomReporter implements Reporter {
    onTestBegin(test: TestCase): void {
        logger.info(`Test Case Started : ${test.title}`);
    }

    onTestEnd(test: TestCase, result: TestResult): void {
        logger.info(`Test Case Completed : ${test.title} Status : ${result.status}`);
    }

    onStepBegin(test: TestCase, result: TestResult, step: TestStep): void {
        if (step.category === `test.step`) {
            logger.info(`Executing Step : ${step.title}`);
        }
    }

    onStepEnd(test: TestCase, result: TestResult, step: TestStep): void {
        if (step.category === `test.step`) {
            logger.info(
                `Completed Step : ${step.title} - ${step.error ? `Error: ${step.error.message}` : 'Success'}`
            );
        }
    }

    onError(error: TestError): void {
        logger.error(`Test Error: ${error.message}`);
    }

    onBegin(config: any, suite: any): void {
        logger.info(`Test run started with ${suite.allTests().length} test(s).`);
    }

    onEnd(result: any): void {
        logger.info(`Test run completed with status: ${result.status.toUpperCase()}`);
    }
}

export default CustomReporter;
