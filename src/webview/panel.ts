// src/webview/panel.ts
import * as vscode from 'vscode';
import { getWebviewContent } from './content';
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

    panel.webview.html = getWebviewContent(workspaceFolder);
    
    panel.webview.onDidReceiveMessage((message) => {
        handleWebviewMessage(message, workspaceFolder);
    });

    return panel;
}