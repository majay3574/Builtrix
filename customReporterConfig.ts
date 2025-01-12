import { Reporter, TestCase, TestError, TestResult, TestStep } from "@playwright/test/reporter";
import winston from 'winston';

const customFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ level, message, timestamp }) => `[${timestamp}] ${level.toUpperCase()}: ${message}`)
);

const logger = winston.createLogger({
    level: 'info',
    format: customFormat,
    transports: [
        new winston.transports.Console({ level: 'debug' }),
        new winston.transports.File({ filename: 'logs/info.log', level: 'info' }),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/debug.log', level: 'debug' }),
    ],
});

class CustomReporter implements Reporter {
    onBegin(config: any, suite: any) {
        logger.info(`Starting the run with ${suite.allTests().length} tests`);
    }

    onTestBegin(test: TestCase) {
        logger.info(`Starting test ${test.title}`);
    }
    onStep(test: TestCase, result: TestResult, step: TestStep) {
        if (step.error) {
            logger.error(`Step ${step.title} for test ${test.title} failed: ${step.error.message}`);
        } else {
            logger.info(`Step ${step.title} for test ${test.title} completed`);
        }
    }

    onTestEnd(test: TestCase, result: TestResult) {
        if (result.status === 'passed') {
            logger.info(`Test ${test.title} passed`);
        } else if (result.status === 'failed') {
            logger.error(`Test ${test.title} failed: ${result.error?.message}`);
        } else if (result.status === 'skipped') {
            logger.warn(`Test ${test.title} skipped`);
        }
    }

    onEnd(result: any) {
        logger.info(`Finished the run: ${result.status}`);
    }
}

export default CustomReporter;
