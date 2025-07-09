import fs from 'fs';
import fetch from 'node-fetch';
import key from "../../data/groq.json"
import { TestInfo } from '@playwright/test';

// Groq API Configuration
const apiKey = key.apiKey;
const model = 'llama-3.3-70b-versatile';

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

    const errorInfo = {
        filePath,
        lineNum,
        colNum,
        errorLine,
        codeFrame,
        errorMessage: testInfo.error.message,
        testTitle: testInfo.title
    };

    await analyzeWithGroq(errorInfo);
}

async function analyzeWithGroq({
    filePath,
    lineNum,
    colNum,
    errorLine,
    codeFrame,
    errorMessage,
    testTitle
}: {
    filePath: string;
    lineNum: number;
    colNum: number;
    errorLine: string;
    codeFrame: string;
    errorMessage: string;
    testTitle: string;
}) {
    const prompt = `
🔧 Error Message:
${errorMessage}

💥 Error Line:
${errorLine}

🧩 Code Frame:
${codeFrame}
`.trim();

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model,
                messages: [
                    {
                        role: "system",
                        content: `
You are acting as a Senior SDET with deep experience in Playwright + TypeScript automation frameworks.
You will be given a test failure log, including:
*'Error message'
*'Code line'
*'Code frame or stack trace'
Your job is to:
Diagnose the failure precisely – point out the actual cause in the context of Playwright/TypeScript.
Provide the exact fix, ensuring it aligns with Playwright best practices and the existing TypeScript-based framework.
Include code changes if necessary – formatted in a readable and complete way.
Keep your explanation minimal, direct, and developer-friendly, like a senior engineer reviewing code.
Always assume:
The fix will be implemented by another SDET, so clarity and correctness are key.
returnFormat:
🔍 Root Cause:
[Clearly explain the issue]
🛠️ Fix:
[Provide corrected code or steps]
💡 Note (Optional):
[Optional tip or caution related to the fix]
                        `.trim()
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.3,
                max_tokens: 3000
            })
        });

        const data: {
            choices?: { message?: { content?: string } }[];
        } = await response.json();

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
        console.log(`✅ AI Suggestion:\n\n${content}`);
    } catch (err: any) {
        console.error('❌ Groq AI Error:', err.message);
    }
}
