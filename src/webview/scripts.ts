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
                case 'error':
                    // Handle error messages
                    vscode.window.showErrorMessage(message.message);
                    break;
            }
        });

        // Toggle folder expand/collapse
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

        // Handle folder checkbox selection
        function toggleFolderCheckbox(event) {
            const checkbox = event.target;
            const folder = checkbox.closest('.folder');
            if (folder) {
                const folderList = folder.nextElementSibling;
                const childCheckboxes = folderList.querySelectorAll('input[type="checkbox"]');
                
                // Update all child checkboxes
                childCheckboxes.forEach(childCheckbox => {
                    childCheckbox.checked = checkbox.checked;
                });

                // Update parent folder checkboxes
                updateParentFolderCheckbox(folder);
            }
        }

        // Update parent folder checkbox states
        function updateParentFolderCheckbox(element) {
            const parentFolderLi = element.closest('li');
            if (!parentFolderLi) return;

            const parentUl = parentFolderLi.parentElement;
            if (!parentUl) return;

            const parentFolder = parentUl.closest('li')?.querySelector('.folder');
            if (!parentFolder) return;

            const parentCheckbox = parentFolder.querySelector('input[type="checkbox"]');
            if (!parentCheckbox) return;

            const siblingCheckboxes = parentUl.querySelectorAll('li > input[type="checkbox"]');
            const siblingFolderCheckboxes = parentUl.querySelectorAll('li > .folder > input[type="checkbox"]');
            
            const allCheckboxes = [...siblingCheckboxes, ...siblingFolderCheckboxes];
            const allChecked = allCheckboxes.every(cb => cb.checked);
            const someChecked = allCheckboxes.some(cb => cb.checked);

            parentCheckbox.checked = allChecked;
            parentCheckbox.indeterminate = someChecked && !allChecked;

            // Recursively update parent folders
            updateParentFolderCheckbox(parentFolder);
        }

        // Get all selected files
        function getSelectedFiles() {
            const selectedFiles = [];
            const checkboxes = document.querySelectorAll('.file input[type="checkbox"]:checked');
            checkboxes.forEach((checkbox) => {
                // Only include files that have a value
                if (checkbox.value) {
                    selectedFiles.push(checkbox.value);
                }
            });
            return selectedFiles;
        }

        // Handle copying selected file contents
        function copySelectedFiles() {
            const selectedFiles = getSelectedFiles();
            const textFiles = selectedFiles.filter(file => {
                const checkbox = document.querySelector(\`input[value="\${file}"]\`);
                return checkbox && checkbox.getAttribute('data-type') === 'text';
            });
            
            if (textFiles.length === 0) {
                vscode.postMessage({
                    type: 'error',
                    message: 'Please select at least one text file to copy content.'
                });
                return;
            }
            
            vscode.postMessage({ 
                type: 'copy', 
                selectedFiles: textFiles 
            });
        }

        // Handle copying file structure
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

        // Initialize folder toggle functionality
        function initializeFolderToggles() {
            // Add click handlers for folder toggles
            const folderToggles = document.querySelectorAll('.folder-toggle, .folder-name');
            folderToggles.forEach(toggle => {
                toggle.addEventListener('click', toggleFolder);
            });

            // Add change handlers for all checkboxes
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', function() {
                    if (this.closest('.folder')) {
                        toggleFolderCheckbox({ target: this });
                    } else {
                        updateParentFolderCheckbox(this);
                    }
                });
            });
        }

        // Handle keyboard navigation
        function handleKeyboardNavigation() {
            document.addEventListener('keydown', (event) => {
                if (event.target.tagName === 'INPUT' && event.target.type === 'checkbox') {
                    const li = event.target.closest('li');
                    
                    switch (event.key) {
                        case 'ArrowUp':
                            event.preventDefault();
                            const prevLi = li.previousElementSibling;
                            if (prevLi) {
                                const prevCheckbox = prevLi.querySelector('input[type="checkbox"]');
                                prevCheckbox?.focus();
                            }
                            break;
                            
                        case 'ArrowDown':
                            event.preventDefault();
                            const nextLi = li.nextElementSibling;
                            if (nextLi) {
                                const nextCheckbox = nextLi.querySelector('input[type="checkbox"]');
                                nextCheckbox?.focus();
                            }
                            break;
                            
                        case 'Space':
                            event.preventDefault();
                            event.target.click();
                            break;
                    }
                }
            });
        }

        // Initialize on page load
        document.addEventListener('DOMContentLoaded', () => {
            const mainContent = document.getElementById('mainContent');
            const loadingContainer = document.getElementById('loadingContainer');
            
            if (mainContent && loadingContainer) {
                mainContent.style.display = 'none';
                loadingContainer.style.display = 'flex';
            }

            // Initialize keyboard navigation
            handleKeyboardNavigation();
        });
    `;
}