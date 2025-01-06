// src/webview/styles.ts
export function getStyles(): string {
    return `
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            margin: 0;
            padding: 24px;
            background-color: #17153B;
            color: #ffffff;
            line-height: 1.6;
        }

        h3 {
            margin: 0 0 20px 0;
            color: #ffffff;
            font-size: 1.4em;
            font-weight: 600;
            border-bottom: 2px solid #433D8B;
            padding-bottom: 8px;
            letter-spacing: 0.5px;
        }

        .file-tree {
            list-style-type: none;
            padding-left: 20px;
            margin: 0;
        }

        .file-tree li {
            margin: 8px 0;
            transition: all 0.2s ease;
        }

        .file-tree .folder {
            font-weight: 500;
            cursor: pointer;
            color: #ffffff;
            display: flex;
            align-items: center;
            padding: 8px 12px;
            border-radius: 6px;
            background-color: #2E236C;
            transition: all 0.2s ease;
        }

        .file-tree .folder:hover {
            background-color: #433D8B;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .folder-toggle {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-right: 8px;
            width: 20px;
            height: 20px;
            transition: transform 0.2s ease;
        }

        .folder-toggle::before {
            content: "▶";
            font-size: 12px;
            color: #C8ACD6;
        }

        .folder.open .folder-toggle::before {
            content: "▼";
        }

        .file-tree .file {
            display: flex;
            align-items: center;
            padding: 6px 12px;
            border-radius: 4px;
            transition: background-color 0.2s ease;
        }

        .file-tree .file:hover {
            background-color: #2E236C;
        }

        .file-tree .file label {
            cursor: pointer;
            flex: 1;
            margin-left: 4px;
            color: #ffffff;
            font-size: 14px;
        }

        .checkbox-container {
            margin-bottom: 20px;
            background-color: #2E236C;
            border-radius: 8px;
            padding: 16px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        /* Enhanced Custom Checkbox Styles */
        input[type="checkbox"] {
            appearance: none;
            -webkit-appearance: none;
            width: 18px;
            height: 18px;
            border: 2px solid #C8ACD6;
            border-radius: 4px;
            margin-right: 8px;
            cursor: pointer;
            position: relative;
            transition: all 0.2s ease;
            background-color: rgba(200, 172, 214, 0.1);
        }

        input[type="checkbox"]:checked {
            background-color: #C8ACD6;
            border-color: #C8ACD6;
        }

        input[type="checkbox"]:checked::after {
            content: "✓";
            position: absolute;
            color: #17153B;
            font-size: 14px;
            font-weight: bold;
            left: 3px;
            top: -1px;
        }

        input[type="checkbox"]:hover {
            border-color: #ffffff;
            background-color: rgba(200, 172, 214, 0.2);
        }

        input[type="checkbox"]:checked:hover {
            background-color: #ffffff;
            border-color: #ffffff;
        }

        .button-container {
            display: flex;
            gap: 12px;
            margin-top: 20px;
            padding: 16px;
            background-color: #2E236C;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        button {
            background-color: #433D8B;
            color: #ffffff;
            padding: 12px 20px;
            border: none;
            cursor: pointer;
            border-radius: 6px;
            font-weight: 500;
            font-size: 14px;
            display: flex;
            align-items: center;
            transition: all 0.2s ease;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            letter-spacing: 0.5px;
        }

        button:hover {
            background-color: #C8ACD6;
            color: #17153B;
            transform: translateY(-1px);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        }

        button:active {
            transform: translateY(0);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            background-color: #ffffff;
        }

       .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 300px;
            background-color: #2E236C;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            position: relative;
            overflow: hidden;
        }

        /* New Loading Animation Styles */
        .loader {
            position: relative;
            width: 120px;
            height: 80px;
            margin-bottom: 24px;
        }

        .copy-animation {
            position: absolute;
            width: 40px;
            height: 50px;
            background: #C8ACD6;
            border-radius: 4px;
            animation: copyAnimation 2s infinite;
        }

        .copy-animation::before {
            content: '';
            position: absolute;
            top: -15px;
            left: 5px;
            width: 30px;
            height: 10px;
            background: #C8ACD6;
            animation: paperFlip 2s infinite;
            transform-origin: bottom;
        }

        .copy-animation::after {
            content: '';
            position: absolute;
            top: 5px;
            left: 5px;
            right: 5px;
            height: 2px;
            background: #17153B;
            box-shadow: 0 8px 0 #17153B, 0 16px 0 #17153B;
            animation: textLines 2s infinite;
        }

        .copy-shadow {
            position: absolute;
            width: 40px;
            height: 50px;
            background: #433D8B;
            border-radius: 4px;
            animation: shadowAnimation 2s infinite;
        }

        @keyframes copyAnimation {
            0% {
                transform: translateX(0) translateY(0);
                opacity: 1;
            }
            20% {
                transform: translateX(0) translateY(-5px);
                opacity: 1;
            }
            40% {
                transform: translateX(50px) translateY(-5px);
                opacity: 0.7;
            }
            60% {
                transform: translateX(50px) translateY(0);
                opacity: 0.7;
            }
            80% {
                transform: translateX(0) translateY(0);
                opacity: 1;
            }
            100% {
                transform: translateX(0) translateY(0);
                opacity: 1;
            }
        }

        @keyframes shadowAnimation {
            0% {
                transform: translateX(50px) translateY(0);
                opacity: 0.3;
            }
            20% {
                transform: translateX(50px) translateY(0);
                opacity: 0.3;
            }
            40% {
                transform: translateX(50px) translateY(0);
                opacity: 0.5;
            }
            60% {
                transform: translateX(50px) translateY(0);
                opacity: 0.5;
            }
            80% {
                transform: translateX(50px) translateY(0);
                opacity: 0.3;
            }
            100% {
                transform: translateX(50px) translateY(0);
                opacity: 0.3;
            }
        }

        @keyframes paperFlip {
            0% {
                transform: rotateX(0deg);
            }
            20% {
                transform: rotateX(-45deg);
            }
            40% {
                transform: rotateX(0deg);
            }
            100% {
                transform: rotateX(0deg);
            }
        }

        @keyframes textLines {
            0% {
                opacity: 1;
            }
            40% {
                opacity: 0.5;
            }
            60% {
                opacity: 0.5;
            }
            100% {
                opacity: 1;
            }
        }

        .loading-container p {
            color: #ffffff;
            font-size: 16px;
            margin: 0;
            font-weight: 500;
            text-align: center;
            animation: textFade 2s infinite;
        }

        @keyframes textFade {
            0% {
                opacity: 1;
            }
            50% {
                opacity: 0.7;
            }
            100% {
                opacity: 1;
            }
        }


        @keyframes rotation {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* Focus States for Accessibility */
        button:focus,
        input[type="checkbox"]:focus {
            outline: 2px solid #C8ACD6;
            outline-offset: 2px;
        }

        /* Responsive Design */
        @media (max-width: 600px) {
            body {
                padding: 16px;
            }

            .button-container {
                flex-direction: column;
            }

            button {
                width: 100%;
                justify-content: center;
            }
        }
            .file.raw-file {
            opacity: 0.7;
            cursor: not-allowed;
        }

        .file.raw-file label {
            cursor: not-allowed;
            color: #999;
        }

        .raw-file-icon {
            width: 18px;
            height: 18px;
            margin-right: 8px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            opacity: 0.7;
        }

        /* Optional: Add hover effect to show it's not selectable */
        .file.raw-file:hover {
            background-color: transparent;
        }

        /* Optional: Add tooltip style */
        .file.raw-file::after {
            content: "Binary file - cannot be copied";
            position: absolute;
            background: #433D8B;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s;
            right: 100%;
            margin-right: 10px;
            white-space: nowrap;
        }

        .file.raw-file:hover::after {
            opacity: 1;
        }
    `;
}