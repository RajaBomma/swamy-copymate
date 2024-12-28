// src/webview/panel.ts
import * as vscode from 'vscode';
import { getWebviewContent, generateFileTree } from './content';
import { handleWebviewMessage } from './messageHandler';

export function createWebviewPanel(workspaceFolder: string): vscode.WebviewPanel {
    const panel = vscode.window.createWebviewPanel(
        'copyMateFileExplorer',
        'Copy Mate',
        vscode.ViewColumn.One,
        { 
            enableScripts: true,
            localResourceRoots: [vscode.Uri.file(workspaceFolder)]
        }
    );

    // Initial content with loading state
    panel.webview.html = getWebviewContent(workspaceFolder);

    // Generate file tree asynchronously
    generateFileTree(workspaceFolder)
        .then(fileTree => {
            // Send the generated file tree to the webview
            panel.webview.postMessage({
                type: 'fileTree',
                content: fileTree
            });
        })
        .catch(error => {
            vscode.window.showErrorMessage('Failed to load file structure: ' + error.message);
        });

    panel.webview.onDidReceiveMessage((message) => {
        handleWebviewMessage(message, workspaceFolder);
    });

    return panel;
}