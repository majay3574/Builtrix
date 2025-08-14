import fs from 'fs';
import fetch from 'node-fetch';
import { TestInfo } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config({ debug: true });

const apiKey = process.env.GROQKEY;

if (!apiKey) {
    throw new Error("Missing GROQKEY in environment variables");
}

// Multiple models – one for images + text, others for text only
const models = [
    { name: "meta-llama/llama-4-maverick-17b-128e-instruct", supportsImages: true },
    { name: "llama-3.3-70b-versatile", supportsImages: false }
    // Add more models here if needed
];

/**
 * Main entry – extracts error info and sends to AI
 */
export async function extractAndAnalyzeWithGroq(testInfo: TestInfo) {
    if (!testInfo?.error?.stack) {
        console.log('✅ No stack trace available.');
        return;
    }
    console.log(`Test info status ${testInfo.status}`);

    const stackLines = testInfo.error.stack?.split('\n') || [];
    const match = stackLines.find(line => line.includes(testInfo.file));

    if (!match) {
        console.log('❌ No matching line found in stack trace');
        return;
    }

    console.log('📦 Stack line being matched:', match);

    const matchRegex = /at .*?\(?(.+):(\d+):(\d+)\)?/;
    const matchResult = match.match(matchRegex);

    if (!matchResult) {
        console.log('❌ Regex did not match stack trace format');
        return;
    }

    const [, filePath, lineNumStr, colStr] = matchResult;
    const lineNum = parseInt(lineNumStr);
    const colNum = parseInt(colStr);

    const fileLines = fs.readFileSync(filePath, 'utf-8').split('\n');
    const errorLine = fileLines[lineNum - 1];

    const codeFrame = `
    ${lineNum - 2} | ${fileLines[lineNum - 3] || ''}
    ${lineNum - 1} | ${fileLines[lineNum - 2] || ''}
${lineNum} | ${errorLine}
${' '.repeat(colNum + lineNum.toString().length + 3)}^
${lineNum + 1} | ${fileLines[lineNum] || ''}
${lineNum + 2} | ${fileLines[lineNum + 1] || ''}
`.trim();

    // Try to get screenshot path if exists in Playwright attachments
    let screenshotBase64 = null;
    const screenshotAttachment = testInfo.attachments.find(att => att.name === 'screenshot' || att.contentType?.includes('image'));
    if (screenshotAttachment && screenshotAttachment.path) {
        try {
            const imageBuffer = fs.readFileSync(screenshotAttachment.path);
            screenshotBase64 = `data:image/png;base64,${imageBuffer.toString('base64')}`;
        } catch (e) {
            console.warn('⚠️ Could not read screenshot:', e.message);
        }
    }

    const errorInfo = {
        filePath,
        lineNum,
        colNum,
        errorLine,
        codeFrame,
        errorMessage: testInfo.error.message,
        testTitle: testInfo.title,
        screenshotBase64
    };

    await analyzeWithGroqMulti(errorInfo);
}

/**
 * Runs AI analysis across all configured models
 */
async function analyzeWithGroqMulti({
    filePath,
    lineNum,
    colNum,
    errorLine,
    codeFrame,
    errorMessage,
    testTitle,
    screenshotBase64
}: {
    filePath: string;
    lineNum: number;
    colNum: number;
    errorLine: string;
    codeFrame: string;
    errorMessage: string;
    testTitle: string;
    screenshotBase64?: string | null;
}) {
    const textPrompt = `
🔧 Error Message:
${errorMessage}

💥 Error Line:
${errorLine}

🧩 Code Frame:
${codeFrame}
`.trim();

    const systemPrompt = `
You are acting as a Senior SDET with deep experience in Playwright + TypeScript automation frameworks.
You will be given a test failure log, including:
* 'Error message'
* 'Code line'
* 'Code frame or stack trace'
* (Optional) A screenshot of the UI at the moment of failure

Your job is to:
Diagnose the failure precisely – point out the actual cause in the context of Playwright/TypeScript.
Provide the exact fix, ensuring it aligns with Playwright best practices and the existing TypeScript-based framework.
Include code changes if necessary – formatted in a readable and complete way.
Keep your explanation minimal, direct, and developer-friendly, like a senior engineer reviewing code.
Return format:
🔍 Root Cause:
[Clearly explain the issue]
🛠️ Fix:
[Provide corrected code or steps]
💡 Note (Optional):
[Optional tip or caution related to the fix]
`.trim();

    for (const { name: model, supportsImages } of models) {
        const messages: any[] = [
            { role: "system", content: systemPrompt }
        ];

        if (supportsImages && screenshotBase64) {
            messages.push({
                role: "user",
                content: [
                    { type: "text", text: textPrompt },
                    { type: "image_url", image_url: { url: screenshotBase64 } }
                ]
            });
        } else {
            messages.push({ role: "user", content: textPrompt });
        }

        console.log(`\n==============================`);
        console.log(`🚀 Analyzing with model: ${model}`);
        console.log(`==============================`);

        try {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model,
                    messages,
                    temperature: 0.3,
                    max_tokens: 3000
                })
            });

            const data = await response.json() as {
                choices?: Array<{
                    message?: {
                        content?: string;
                    };
                }>;
            };

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const content = data.choices?.[0]?.message?.content;
            if (!content) {
                throw new Error("⚠️ Invalid response format from Groq API");
            }

            console.error(`❌ Test Failed: ${testTitle}`);
            console.error(`📄 File: ${filePath}`);
            console.error(`🧨 Message: ${errorMessage}`);
            console.error(`🔍 Code Frame:\n${codeFrame}`);
            if (supportsImages && screenshotBase64) {
                console.log("🖼️ Screenshot included in analysis.");
            }
            console.log(`✅ AI Suggestion from ${model}:\n\n${content}`);

        } catch (err: any) {
            console.error(`❌ Error from ${model}:`, err.message);
        }
    }
}
