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
                    document.querySelector('.file-tree').innerHTML = message.content;
                    // Hide loading spinner and show main content
                    document.getElementById('loadingContainer').style.display = 'none';
                    document.getElementById('mainContent').style.display = 'block';
                    // Initialize folder toggles after content is loaded
                    initializeFolderToggles();
                    break;
            }
        });

        function toggleFolder(event) {
            const folder = event.target.closest('.folder');
            folder.classList.toggle('open');
            const folderContent = folder.nextElementSibling;
            folderContent.style.display = folderContent.style.display === 'none' ? 'block' : 'none';
        }

        function toggleFolderCheckbox(event) {
            const checkbox = event.target;
            const isChecked = checkbox.checked;
            const folderList = checkbox.closest('.folder').nextElementSibling;
            const childCheckboxes = folderList.querySelectorAll('input[type="checkbox"]');
            childCheckboxes.forEach(childCheckbox => {
                childCheckbox.checked = isChecked;
            });
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
            vscode.postMessage({ 
                type: 'copy', 
                selectedFiles: selectedFiles 
            });
        }

        function copyFileStructure() {
            const selectedFiles = getSelectedFiles();
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
    `;
}