// src/extension.ts
import * as vscode from 'vscode';
import { createWebviewPanel } from './webview/panel'; 

export function activate(context: vscode.ExtensionContext) {
    console.log('"copy-mate" is now active!');

    let disposable = vscode.commands.registerCommand('copy-mate', async () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;

        if (!workspaceFolders) {
            vscode.window.showErrorMessage('No workspace folder found.');
            return;
        }

        const workspaceFolder = workspaceFolders[0].uri.fsPath;
        const panel = createWebviewPanel(workspaceFolder);
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}