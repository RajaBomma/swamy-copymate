import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    console.log('"copy-mate" is now active!');

    let disposable = vscode.commands.registerCommand('copy-mate', async () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;

        if (!workspaceFolders) {
            vscode.window.showErrorMessage('No workspace folder found.');
            return;
        }

        const workspaceFolder = workspaceFolders[0].uri.fsPath;
        const panel = vscode.window.createWebviewPanel(
            'copyMateFileExplorer', 
            'Copy Mate', 
            vscode.ViewColumn.One, 
            { enableScripts: true }
        );

        const fileTree = createFileTreeHTML(workspaceFolder);

        const webviewContent = `
            <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 20px;
                            padding: 0;
                            background-color: #2c3e50;
                            color: #fff;
                        }
                        h3 {
                            margin-bottom: 10px;
                        }
                        .file-tree {
                            list-style-type: none;
                            padding-left: 20px;
                        }
                        .file-tree li {
                            margin: 4px 0;
                        }
                        .file-tree .folder {
                            font-weight: bold;
                            cursor: pointer;
                            color: #9b59b6;
                            display: flex;
                            align-items: center;
                        }
                        .folder-toggle {
                            display: inline-block;
                            margin-right: 5px;
                            width: 15px;
                            text-align: center;
                        }
                        .folder-toggle::before {
                            content: "▶";
                        }
                        .folder.open .folder-toggle::before {
                            content: "▼";
                        }
                        .file-tree .file {
                            display: flex;
                            align-items: center;
                        }
                        .file-tree .file input[type="checkbox"] {
                            margin-right: 5px;
                        }
                        .file-tree .folder input[type="checkbox"] {
                            margin-right: 5px;
                        }
                        .checkbox-container {
                            margin-bottom: 10px;
                        }
                        button {
                            background-color: #9b59b6;
                            color: white;
                            padding: 10px;
                            border: none;
                            cursor: pointer;
                            border-radius: 4px;
                            margin-top: 10px;
                        }
                        button:hover {
                            background-color: #8e44ad;
                        }
                    </style>
                </head>
                <body>
                    <h3>Select Files to Copy:</h3>
                    <div class="checkbox-container">
                        <ul class="file-tree">
                            ${fileTree}
                        </ul>
                    </div>
                    <button onclick="copySelectedFiles()">Copy Selected Files</button>
                    <script>
                        const vscode = acquireVsCodeApi();
                        
                        function toggleFolder(event) {
                            // Find the closest folder element
                            const folder = event.target.closest('.folder');
                            
                            // Toggle the open class on the folder
                            folder.classList.toggle('open');
                            
                            // Find the sibling ul element (folder contents)
                            const folderContent = folder.nextElementSibling;
                            
                            // Toggle the display
                            if (folderContent.style.display === 'none') {
                                folderContent.style.display = 'block';
                            } else {
                                folderContent.style.display = 'none';
                            }
                        }

                        function toggleFolderCheckbox(event) {
                            const checkbox = event.target;
                            const isChecked = checkbox.checked;
                            const folderList = checkbox.closest('.folder').nextElementSibling;
                            
                            // Check/uncheck all checkboxes in this folder
                            const childCheckboxes = folderList.querySelectorAll('input[type="checkbox"]');
                            childCheckboxes.forEach(childCheckbox => {
                                childCheckbox.checked = isChecked;
                            });
                        }

                        function copySelectedFiles() {
                            const selectedFiles = [];
                            const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
                            checkboxes.forEach((checkbox) => {
                                if (!checkbox.closest('.folder')) {
                                    selectedFiles.push(checkbox.value);
                                }
                            });
                            vscode.postMessage({ type: 'copy', selectedFiles: selectedFiles });
                        }

                        // Add event listeners after DOM is loaded
                        document.addEventListener('DOMContentLoaded', () => {
                            // Add click event to folder toggle and folder name
                            const folderToggles = document.querySelectorAll('.folder-toggle, .folder-name');
                            folderToggles.forEach(toggle => {
                                toggle.addEventListener('click', toggleFolder);
                            });
                        });
                    </script>
                </body>
            </html>
        `;

        panel.webview.html = webviewContent;

        panel.webview.onDidReceiveMessage((message) => {
            if (message.type === 'copy') {
                let contentToCopy = '';
                message.selectedFiles.forEach((filePath: string) => {
                    try {
                        const fileContent = fs.readFileSync(filePath, 'utf-8');
                        contentToCopy += `File Path: ${filePath}\nContent:\n${fileContent}\n\n`;
                    } catch (error) {
                        vscode.window.showErrorMessage(`Failed to read file: ${filePath}`);
                    }
                });

                vscode.env.clipboard.writeText(contentToCopy).then(() => {
                    vscode.window.showInformationMessage('File content copied to clipboard!');
                }, (error) => {
                    vscode.window.showErrorMessage('Failed to copy content to clipboard.');
                });
            }
        });
    });

    context.subscriptions.push(disposable);
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

export function deactivate() {}