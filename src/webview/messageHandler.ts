// src/webview/messageHandler.ts
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import isTextFile from './content';
// gopi working here
export function handleWebviewMessage(message: any, workspaceFolder: string, panel: any) {
    switch (message.type) {
        case 'copy':
            // For content copy, only include text files
            const textFiles = message.selectedFiles.filter((file: string) => isTextFile(file));
            handleCopyContent(textFiles, panel);
            break;
        case 'copyStructure':
            // For structure copy, include all selected files
            handleCopyStructure(message.selectedFiles, workspaceFolder, panel);
            break;
    }
}
// added by gopi
// added by raja
// Function to check if a file is a text file

function handleCopyContent(selectedFiles: string[], panel: any) {
    let contentToCopy = '';
    selectedFiles.forEach((filePath: string) => {
        try {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            contentToCopy += `File Path: ${filePath}\nContent:\n${fileContent}\n\n`;
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to read file: ${filePath}`);
        }
    });

    copyToClipboard(contentToCopy, 'File content copied to clipboard!', panel);
}

function handleCopyStructure(selectedFiles: string[], workspaceFolder: string, panel: any) {
    // Sort files to maintain directory hierarchy
    selectedFiles.sort();

    // Convert absolute paths to relative and create tree structure
    const structure = createTreeStructure(selectedFiles, workspaceFolder);

    copyToClipboard(structure, 'File structure copied to clipboard!', panel);
}

function createTreeStructure(files: string[], rootPath: string): string {
    const tree: { [key: string]: any } = {};

    // Build tree object
    files.forEach(file => {
        const relativePath = path.relative(rootPath, file);
        const parts = relativePath.split(path.sep);
        let current = tree;

        parts.forEach((part, index) => {
            if (!current[part]) {
                current[part] = {};
            }
            current = current[part];
        });
    });

    // Convert tree object to string
    function renderTree(node: any, prefix: string = '', isLast: boolean = true): string {
        let result = '';
        const entries = Object.entries(node);

        entries.forEach(([key, value], index) => {
            const isLastEntry = index === entries.length - 1;
            const connector = isLastEntry ? '└── ' : '├── ';
            const childPrefix = isLastEntry ? '    ' : '│   ';

            result += prefix + connector + key + '\n';

            // Assert that value is an object
            if (Object.keys(value as object).length > 0) {
                result += renderTree(value, prefix + childPrefix, isLastEntry);
            }
        });

        return result;
    }

    return renderTree(tree);
}

function copyToClipboard(content: string, successMessage: string, panel: any) {
    vscode.env.clipboard.writeText(content).then(
        () => {
            vscode.window.showInformationMessage(successMessage);
            // Send success message back to webview
            panel.webview.postMessage({ type: 'copySuccess' });
        },
        () => vscode.window.showErrorMessage('Failed to copy to clipboard.')
    );
}