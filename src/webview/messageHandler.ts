
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function handleWebviewMessage(message: any, workspaceFolder: string) {
    switch (message.type) {
        case 'copy':
            handleCopyContent(message.selectedFiles);
            break;
        case 'copyStructure':
            handleCopyStructure(message.selectedFiles, workspaceFolder);
            break;
    }
}

function handleCopyContent(selectedFiles: string[]) {
    let contentToCopy = '';
    selectedFiles.forEach((filePath: string) => {
        try {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            contentToCopy += `File Path: ${filePath}\nContent:\n${fileContent}\n\n`;
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to read file: ${filePath}`);
        }
    });

    copyToClipboard(contentToCopy, 'File content copied to clipboard!');
}

function handleCopyStructure(selectedFiles: string[], workspaceFolder: string) {
    let structure = '';
    selectedFiles.forEach((filePath: string) => {
        const relativePath = path.relative(workspaceFolder, filePath);
        structure += `${relativePath}\n`;
    });

    copyToClipboard(structure, 'File structure copied to clipboard!');
}

function copyToClipboard(content: string, successMessage: string) {
    vscode.env.clipboard.writeText(content).then(
        () => vscode.window.showInformationMessage(successMessage),
        () => vscode.window.showErrorMessage('Failed to copy to clipboard.')
    );
}