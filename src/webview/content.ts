// src/webview/content.ts
import * as fs from 'fs';
import * as path from 'path';
import { getStyles } from './styles';
import { getScripts } from './scripts';

export function getWebviewContent(workspaceFolder: string): string {
    return `
        <!DOCTYPE html>
        <html>
            <head>
                <style>${getStyles()}</style>
            </head>
            <body>
                <h3>Select Files to Copy:</h3>
                <div id="loadingContainer" class="loading-container">
                    <div class="loader"></div>
                    <p>Loading file structure...</p>
                </div>
                <div id="mainContent" style="display: none;">
                    <div class="checkbox-container">
                        <ul class="file-tree">
                            <li>Loading...</li>
                        </ul>
                    </div>
                    <div class="button-container">
                        <button onclick="copySelectedFiles()">Copy Content</button>
                        <button onclick="copyFileStructure()">Copy Selected Structure</button>
                    </div>
                </div>
                <script>${getScripts()}</script>
            </body>
        </html>
    `;
}

// Function to generate file tree HTML asynchronously
export async function generateFileTree(dirPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        try {
            const fileTree = createFileTreeHTML(dirPath);
            resolve(fileTree);
        } catch (error) {
            reject(error);
        }
    });
}

function createFileTreeHTML(dirPath: string, currentPath: string = ''): string {
    let html = '';
    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
        const fullPath = path.join(dirPath, file);
        const stat = fs.statSync(fullPath);
        const relativePath = path.join(currentPath, file);

        if (stat && stat.isDirectory()) {
            html += `
                <li>
                    <div class="folder">
                        <input type="checkbox" onclick="toggleFolderCheckbox(event)">
                        <span class="folder-toggle"></span>
                        <span class="folder-name">${file}</span>
                    </div>
                    <ul class="file-tree" style="display: none;">
                        ${createFileTreeHTML(fullPath, relativePath)}
                    </ul>
                </li>
            `;
        } else {
            html += `
                <li class="file">
                    <input type="checkbox" id="${fullPath}" value="${fullPath}">
                    <label for="${fullPath}">${file}</label>
                </li>
            `;
        }
    });

    return html;
}