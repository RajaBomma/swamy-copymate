// src/webview/content.ts
import * as fs from 'fs';
import * as path from 'path';
import { getStyles } from './styles';
import { getScripts } from './scripts';

export function getWebviewContent(workspaceFolder: string): string {
    const fileTree = createFileTreeHTML(workspaceFolder);
    
    return `
        <!DOCTYPE html>
        <html>
            <head>
                <style>${getStyles()}</style>
            </head>
            <body>
                <h3>Select Files to Copy:</h3>
                <div class="checkbox-container">
                    <ul class="file-tree">
                        ${fileTree}
                    </ul>
                </div>
                <div class="button-container">
                    <button onclick="copySelectedFiles()">Copy Content</button>
                    <button onclick="copyFileStructure()">Copy Structure</button>
                </div>
                <script>${getScripts()}</script>
            </body>
        </html>
    `;
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