// src/webview/panel.ts
import * as vscode from 'vscode';
import { getWebviewContent, generateFileTree } from './content';
import { handleWebviewMessage } from './messageHandler';

export function createWebviewPanel(workspaceFolder: string): vscode.WebviewPanel {
    console.log('Creating webview panel with workspace:', workspaceFolder);
    
    const panel = vscode.window.createWebviewPanel(
        'copyMateFileExplorer',
        'Copy Mate',
        vscode.ViewColumn.One,
        { 
            enableScripts: true,
            localResourceRoots: [vscode.Uri.file(workspaceFolder)],
            retainContextWhenHidden: true
        }
    );
    // Set initial HTML content
    panel.webview.html = getWebviewContent(workspaceFolder);

    // Generate and send file tree
    setTimeout(async () => {
        try {
            console.log('Generating file tree...');
            const fileTree = await generateFileTree(workspaceFolder);
            
            if (panel.visible) {
                console.log('Sending file tree to webview');
                panel.webview.postMessage({
                    type: 'fileTree',
                    content: fileTree
                });
            }
        } catch (error) {
            console.error('Error generating file tree:', error);
            
            if (panel.visible) {
                vscode.window.showErrorMessage(`Failed to load file structure: ${error}`);
                panel.webview.postMessage({
                    type: 'error',
                    message: 'Failed to load file structure'
                });
            }
        }
    }, 500); // Small delay to ensure webview is ready

    // Handle messages from the webview
    panel.webview.onDidReceiveMessage(message => {
        console.log('Received message from webview:', message);
        handleWebviewMessage(message, workspaceFolder);
    });

    panel.onDidDispose(() => {
        console.log('Panel disposed');
    }, null);

    return panel;
}