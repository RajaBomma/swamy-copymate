// src/webview/scripts.ts
export function getScripts(): string {
    return `
        const vscode = acquireVsCodeApi();
        
        // Handle messages from the extension
        window.addEventListener('message', event => {
            const message = event.data;
            switch (message.type) {
                case 'fileTree':
                    // Update the file tree content
                    const fileTreeElement = document.querySelector('.file-tree');
                    if (fileTreeElement) {
                        fileTreeElement.innerHTML = message.content;
                    }
                    
                    // Hide loading container and show main content
                    const loadingContainer = document.getElementById('loadingContainer');
                    const mainContent = document.getElementById('mainContent');
                    
                    if (loadingContainer && mainContent) {
                        loadingContainer.style.display = 'none';
                        mainContent.style.display = 'block';
                        
                        // Initialize folder toggles after content is loaded
                        initializeFolderToggles();
                    } else {
                        console.error('Loading or main content containers not found');
                    }
                    break;
            }
        });

        function toggleFolder(event) {
            const folder = event.target.closest('.folder');
            if (folder) {
                folder.classList.toggle('open');
                const folderContent = folder.nextElementSibling;
                if (folderContent) {
                    folderContent.style.display = folderContent.style.display === 'none' ? 'block' : 'none';
                }
            }
        }

        function toggleFolderCheckbox(event) {
            const checkbox = event.target;
            const folder = checkbox.closest('.folder');
            if (folder) {
                const folderList = folder.nextElementSibling;
                const childCheckboxes = folderList.querySelectorAll('input[type="checkbox"]');
                childCheckboxes.forEach(childCheckbox => {
                    childCheckbox.checked = checkbox.checked;
                });
            }
        }

        function getSelectedFiles() {
            const selectedFiles = [];
            const checkboxes = document.querySelectorAll('.file input[type="checkbox"]:checked');
            checkboxes.forEach((checkbox) => {
                selectedFiles.push(checkbox.value);
            });
            return selectedFiles;
        }

        function copySelectedFiles() {
            const selectedFiles = getSelectedFiles();
            if (selectedFiles.length === 0) {
                vscode.postMessage({
                    type: 'error',
                    message: 'Please select at least one file to copy.'
                });
                return;
            }
            vscode.postMessage({ 
                type: 'copy', 
                selectedFiles: selectedFiles 
            });
        }

        function copyFileStructure() {
            const selectedFiles = getSelectedFiles();
            if (selectedFiles.length === 0) {
                vscode.postMessage({
                    type: 'error',
                    message: 'Please select at least one file to copy structure.'
                });
                return;
            }
            vscode.postMessage({ 
                type: 'copyStructure', 
                selectedFiles: selectedFiles 
            });
        }

        function initializeFolderToggles() {
            const folderToggles = document.querySelectorAll('.folder-toggle, .folder-name');
            folderToggles.forEach(toggle => {
                toggle.addEventListener('click', toggleFolder);
            });
        }

        // Ensure the script runs after DOM is fully loaded
        document.addEventListener('DOMContentLoaded', () => {
            const mainContent = document.getElementById('mainContent');
            const loadingContainer = document.getElementById('loadingContainer');
            
            if (mainContent && loadingContainer) {
                mainContent.style.display = 'none';
                loadingContainer.style.display = 'flex';
            }
        });
    `;
}