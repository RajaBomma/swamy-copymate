import * as fs from 'fs';
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';

interface TokenLimits {
    [key: string]: number;
    chatgpt: number;
    claude: number;
    gpt4: number;
    gemini: number;
}

const TOKEN_LIMITS: TokenLimits = {
    chatgpt: 4000,
    claude: 100000,
    gpt4: 128000,
    gemini: 32000
};

// Optimized token calculation - process in chunks
function calculateTokens(text: string): number {
    // Simple estimation based on character count for speed
    // This is faster than splitting into words
    return Math.ceil(text.length / 4); // Approximate 4 characters per token
}

export function calculateFileTokensAsync(filePath: string): Promise<number> {
    return new Promise((resolve) => {
        // Read file in chunks for better performance
        try {
            const stats = fs.statSync(filePath);
            // For small files (< 1MB), read directly
            if (stats.size < 1024 * 1024) {
                const content = fs.readFileSync(filePath, 'utf-8');
                resolve(calculateTokens(content));
                return;
            }

            // For larger files, use worker thread
            const worker = new Worker(`
                const { parentPort, workerData } = require('worker_threads');
                const fs = require('fs');

                function calculateTokens(text) {
                    return Math.ceil(text.length / 4);
                }

                const content = fs.readFileSync(workerData.filePath, 'utf-8');
                const tokens = calculateTokens(content);
                parentPort.postMessage(tokens);
            `, {
                eval: true,
                workerData: { filePath }
            });

            worker.on('message', (tokens) => {
                resolve(tokens);
                worker.terminate();
            });

            worker.on('error', () => {
                resolve(0);
                worker.terminate();
            });
        } catch (error) {
            resolve(0);
        }
    });
}