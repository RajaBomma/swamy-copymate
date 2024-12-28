# Copy Mate - VS Code File Content Copier

<div align="center">
  <img src="https://github.com/swamy3697/iPhone-Calculator/blob/main/copy-mate-icon.png" alt="Copy Mate Banner" width="600"/>
  
[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/SwamyPenupothula.copy-mate.svg)](https://marketplace.visualstudio.com/items?itemName=SwamyPenupothula.copy-mate)
[![Visual Studio Marketplace Downloads](https://img.shields.io/visual-studio-marketplace/d/SwamyPenupothula.copy-mate.svg)](https://marketplace.visualstudio.com/items?itemName=SwamyPenupothula.copy-mate)
[![GitHub](https://img.shields.io/github/license/swamy3697/copy-mate)](https://github.com/swamy3697/copy-mate/blob/main/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/swamy3697/copy-mate)](https://github.com/swamy3697/copy-mate/issues)
</div>

Copy Mate simplifies sharing code with AI chatbots, team members, or for debugging by letting you copy multiple files with their paths in just a few clicks.

## 🎯 Quick Demo

<div align="center">
  <img src="https://github.com/swamy3697/iPhone-Calculator/blob/main/command%20pallete.png" alt="Copy Mate start" width="600"/>

  <img src="https://github.com/swamy3697/iPhone-Calculator/blob/main/copy-mate-home.png" alt="Copy Mate home" width="600"/>
</div>

## ✨ Features

- 🗂️ **Easy File Selection:** Browse and select files through a familiar tree view
- 📋 **Smart Copying:** Copies both file paths and content in a chat-friendly format
- 🌳 **File Tree Structure:** Copy your file structure as a tree visualization
- 🎨 **Modern UI:** Clean, intuitive interface with loading animations

## 🚀 Getting Started

### 1. Install the Extension

- Open VS Code
- Press `Ctrl+P` (Windows/Linux) or `Cmd+P` (Mac)
- Type `ext install copy-mate`
- Press Enter

### 2. Using Copy Mate

1. Open your project in VS Code
2. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
3. Type "Copy Mate" and press Enter
4. Select files or folders in the interface:
   - Click checkboxes next to files to select them
   - Use folder checkboxes to select all files within
5. Choose your copying option:
   - Click "Copy Content" for file content with paths
   - Click "Copy Structure" for a tree visualization

<div align="center">
  <img src="assets/usage.png" alt="Copy Mate Usage" width="600"/>
</div>

## 📝 Example Output

### Content Copy
```
File Path: /src/index.js
Content:
console.log('Hello World');

File Path: /src/styles.css
Content:
body { background: #fff; }
```
### Structure Copy

```
└── src
    ├── components
    │   ├── Button.tsx
    │   └── Input.tsx
    └── utils
        └── helpers.ts
```

# 🔧 Extension Settings

- `copyMate.includePaths`: Enable/disable including file paths (default: true)  
- `copyMate.maxFileSize`: Maximum file size to copy in KB (default: 1000)

# 🤝 Contributing

We welcome contributions to Copy Mate! Here's how you can help:

1. Fork the repository: [https://github.com/swamy3697/copy-mate.git](https://github.com/swamy3697/copy-mate.git)  
2. Create your feature branch:  
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes:  
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. Push to the branch:  
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a Pull Request.

# 📝 License

This project is licensed under the **MIT License**.

# 💡 Tips

- Use the folder checkbox to quickly select all files in a directory.  
- Press `ESC` to close the Copy Mate interface.  
- Right-click in the file tree for additional options.

# 🐛 Known Issues & Solutions

| Issue                        | Solution                                            |
|------------------------------|----------------------------------------------------|
| Slow loading with large projects | Use folder selection instead of individual files. |
| Special characters in paths  | Avoid selecting files with special characters.     |

# 🎉 What's New

## Version 1.0.0

- Added file tree structure copying.  
- Improved loading performance.  
- Modern UI with loading animations.  
- Better error handling.

---

<div align="center">
Made with ❤️ by Swamy  
[GitHub](https://github.com/swamy3697/copy-mate) • [Report Bug](https://github.com/swamy3697/copy-mate/issues) • [Request Feature](https://github.com/swamy3697/copy-mate/issues)
</div>

