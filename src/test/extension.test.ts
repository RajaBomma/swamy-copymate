import * as assert from 'assert';
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as sinon from 'sinon';
import { createWebviewPanel } from '../webview/panel';
import { generateFileTree } from '../webview/content';
import isTextFile from '../webview/content';
import { handleWebviewMessage } from '../webview/messageHandler';

suite('Copy Mate Extension Test Suite', () => {
    let sandbox: sinon.SinonSandbox;
    let mockContext: vscode.ExtensionContext;
    let mockWebviewPanel: any;
    let tempDir: string;
    let clipboardText: string = '';
    let clipboardStub: sinon.SinonStub;

    setup(async () => {
        sandbox = sinon.createSandbox();
        
        // Create a temporary test directory
        tempDir = path.join(__dirname, 'test-workspace');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        // Create mock files for testing
        fs.writeFileSync(path.join(tempDir, 'test.txt'), 'Test content');
        fs.writeFileSync(path.join(tempDir, 'test.js'), 'console.log("test");');
        fs.mkdirSync(path.join(tempDir, 'subfolder'), { recursive: true });
        fs.writeFileSync(path.join(tempDir, 'subfolder', 'nested.txt'), 'Nested content');
        
        // Create binary file
        const buffer = Buffer.from([0x89, 0x50, 0x4E, 0x47]); // PNG header
        fs.writeFileSync(path.join(tempDir, 'test.png'), buffer);

        // Mock VS Code webview panel
        mockWebviewPanel = {
            webview: {
                html: '',
                postMessage: sandbox.stub(),
                onDidReceiveMessage: sandbox.stub()
            },
            dispose: sandbox.stub(),
            onDidDispose: sandbox.stub(),
            visible: true
        };

        // Mock extension context
        mockContext = {
            subscriptions: [],
            extensionPath: __dirname,
            globalState: {
                get: sandbox.stub(),
                update: sandbox.stub()
            }
        } as any;

        // Properly stub the clipboard writeText function
        clipboardStub = sandbox.stub(vscode.env.clipboard, 'writeText').callsFake(async (text: string) => {
            clipboardText = text;
            return Promise.resolve();
        });
    });

    teardown(() => {
        sandbox.restore();
        clipboardText = '';
        // Clean up test directory
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
    });

    // Test File Type Detection
    suite('File Type Detection', () => {
        test('should correctly identify text files', () => {
            assert.strictEqual(isTextFile('test.txt'), true);
            assert.strictEqual(isTextFile('test.js'), true);
            assert.strictEqual(isTextFile('test.ts'), true);
            assert.strictEqual(isTextFile('test.json'), true);
        });

        test('should correctly identify non-text files', () => {
            assert.strictEqual(isTextFile('test.png'), false);
            assert.strictEqual(isTextFile('test.jpg'), false);
            assert.strictEqual(isTextFile('test.pdf'), false);
            assert.strictEqual(isTextFile('test.exe'), false);
        });
    });

    // Test File Tree Generation
    suite('File Tree Generation', () => {
        test('should generate correct file tree structure', async () => {
            const fileTree = await generateFileTree(tempDir);
            
            assert.ok(fileTree.includes('test.txt'));
            assert.ok(fileTree.includes('test.js'));
            assert.ok(fileTree.includes('subfolder'));
            assert.ok(fileTree.includes('nested.txt'));
        });

        test('should exclude node_modules and hidden files', async () => {
            // Create test files
            fs.mkdirSync(path.join(tempDir, 'node_modules'), { recursive: true });
            fs.writeFileSync(path.join(tempDir, 'node_modules/test.js'), 'test');
            fs.writeFileSync(path.join(tempDir, '.hidden'), 'hidden');

            const fileTree = await generateFileTree(tempDir);
            
            assert.ok(!fileTree.includes('node_modules'));
            assert.ok(!fileTree.includes('.hidden'));
        });

        test('should handle empty directories', async () => {
            fs.mkdirSync(path.join(tempDir, 'empty-dir'), { recursive: true });
            const fileTree = await generateFileTree(tempDir);
            assert.ok(fileTree.includes('empty-dir'));
        });
    });

    // Test Message Handling
    suite('Message Handling', () => {
        test('should handle copy content message', async () => {
            const message = {
                type: 'copy',
                selectedFiles: [
                    path.join(tempDir, 'test.txt'),
                    path.join(tempDir, 'test.js')
                ]
            };

            await handleWebviewMessage(message, tempDir, mockWebviewPanel);
            
            assert.ok(clipboardText.includes('Test content'));
            assert.ok(clipboardText.includes('console.log("test")'));
        });

        test('should handle copy structure message', async () => {
            const message = {
                type: 'copyStructure',
                selectedFiles: [
                    path.join(tempDir, 'test.txt'),
                    path.join(tempDir, 'subfolder/nested.txt')
                ]
            };

            await handleWebviewMessage(message, tempDir, mockWebviewPanel);
            
            assert.ok(clipboardText.includes('test.txt'));
            assert.ok(clipboardText.includes('subfolder'));
            assert.ok(clipboardText.includes('nested.txt'));
        });

        test('should handle binary files correctly', async () => {
            const message = {
                type: 'copy',
                selectedFiles: [
                    path.join(tempDir, 'test.png'),
                    path.join(tempDir, 'test.txt')
                ]
            };

            await handleWebviewMessage(message, tempDir, mockWebviewPanel);
            
            assert.ok(!clipboardText.includes('test.png'));
            assert.ok(clipboardText.includes('Test content'));
        });
    });

    // Test Webview Panel Creation
    suite('Webview Panel Creation', () => {
        test('should create webview panel with correct properties', () => {
            const panel = createWebviewPanel(tempDir);
            
            assert.ok(panel.webview.html.includes('Copy Mate'));
            assert.strictEqual(panel.viewType, 'copyMate');
            assert.ok(panel.title.includes('Copy Mate'));
        });

        test('should handle initialization with invalid workspace', () => {
            const invalidPath = path.join(tempDir, 'nonexistent');
            const panel = createWebviewPanel(invalidPath);
            
            assert.ok(panel.webview.html.includes('Copy Mate'));
            // Should still create panel even with invalid path
            assert.strictEqual(panel.viewType, 'copyMate');
        });
    });

    // Test Error Handling
    suite('Error Handling', () => {
        test('should handle non-existent files gracefully', async () => {
            const message = {
                type: 'copy',
                selectedFiles: [path.join(tempDir, 'nonexistent.txt')]
            };

            const showErrorMessage = sandbox.stub(vscode.window, 'showErrorMessage');
            await handleWebviewMessage(message, tempDir, mockWebviewPanel);
            
            assert.ok(showErrorMessage.called);
            assert.strictEqual(clipboardText, '');
        });

        test('should handle file read errors', async () => {
            // Create a file with no read permissions
            const noAccessFile = path.join(tempDir, 'noaccess.txt');
            fs.writeFileSync(noAccessFile, 'test');
            fs.chmodSync(noAccessFile, 0o000);

            const message = {
                type: 'copy',
                selectedFiles: [noAccessFile]
            };

            const showErrorMessage = sandbox.stub(vscode.window, 'showErrorMessage');
            await handleWebviewMessage(message, tempDir, mockWebviewPanel);
            
            assert.ok(showErrorMessage.called);
            assert.strictEqual(clipboardText, '');
        });

        test('should handle invalid message types', async () => {
            const message = {
                type: 'invalidType',
                selectedFiles: [path.join(tempDir, 'test.txt')]
            };

            const showErrorMessage = sandbox.stub(vscode.window, 'showErrorMessage');
            await handleWebviewMessage(message as any, tempDir, mockWebviewPanel);
            
            assert.ok(showErrorMessage.called);
            assert.strictEqual(clipboardText, '');
        });
    });
});