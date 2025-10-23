# DevCore AI Toolkit

> A supercharged, secure, client-side toolkit for modern developers, powered by Gemini. It runs entirely in your browser, keeping your code, data, and API keys private and secure on your local machine.

DevCore is a serverless web application designed to be a powerful assistant in your development workflow. It combines a suite of intelligent tools with a unique, AI-driven command center that can orchestrate actions across your favorite services like Jira, Slack, and GitHub.

---

## ✨ Key Features

-   **AI Command Center:** The heart of the toolkit. Use natural language (`Ctrl+K`) to navigate, run features, and execute complex, multi-service workflows.
-   **Workspace Connector Hub:** Connect to Jira, Slack, GitHub, and more. Let the AI execute commands like "create a high-priority Jira ticket and post a summary to the #dev channel in Slack."
-   **AI Feature Builder:** Generate multi-file components, unit tests, and conventional commit messages from a single, high-level prompt.
-   **Intelligent Code Tools:** Explain complex code, migrate between languages, review for bugs and security vulnerabilities, and refactor with one click.
-   **Performance & Auditing:** Profile runtime performance, analyze bundle stats, and audit live websites for accessibility issues with AI-powered advice.
-   **Visual Editors & Sandboxes:** A suite of focused tools, from a CSS Grid editor and a RegEx sandbox to a PWA Manifest generator, designed to streamline frontend development.

---

## 🏛️ Architecture: Secure & Client-Side

DevCore is built on a serverless, client-side architecture. This design choice offers several key advantages:

-   **Privacy First:** Your code, prompts, and sensitive data never leave your browser. All processing happens locally.
-   **Ultimate Security:** API keys and credentials for services like GitHub, Gemini, or Jira are encrypted with AES-GCM using the Web Crypto API. They are stored securely in your browser's IndexedDB and can only be decrypted with your master password.
-   **Runs Anywhere:** As a static application, you can deploy it on any CDN (like GitHub Pages or Netlify) or simply run it from your local filesystem. No backend, no databases, no complex setup.

---

## 🚀 Getting Started

1.  **Open the App:** Just open `index.html` in your browser.
2.  **Onboarding:** On first use, you'll be guided through a one-time setup:
    -   **Consent:** Grant permission for the app to use local storage.
    -   **Sign-In:** Sign in with your Google Account.
    -   **Create Vault:** Create a master password. This password encrypts and decrypts your credentials locally and is **never** stored.
    -   **Provide API Key:** If an API key was not provided during the build process, you will be prompted to enter your own Gemini API key, which will be stored securely in your new vault.
3.  **Connect Your Services:** Navigate to the **Workspace Connector Hub** to securely add your API keys for services like GitHub, Jira, and Slack.
4.  **Use the AI Command Center:** Press `Ctrl+K` (or `Cmd+K`) anywhere to open the command palette and start giving instructions to the AI.

---

## 🔌 The Workspace Connector Hub

This is the core of DevCore's workflow automation. Instead of just being a collection of tools, the Hub turns the app into a true command center.

-   **Connect Once, Use Everywhere:** Securely store your API tokens for essential developer services in the encrypted vault.
-   **AI-Powered Orchestration:** The AI Command Center can use these connections to perform multi-step actions across different platforms.
-   **Example Command:** _"A new critical bug was reported. Create a high-priority ticket in Jira, post a summary to the #engineering channel in Slack, and create a new git branch called `hotfix/payment-bug`."_

---

## 🔐 Security & Your Data

Your privacy is paramount. Here's how your data is handled:

-   **No Server-Side Storage:** All files, settings, and credentials reside exclusively in your browser's IndexedDB.
-   **End-to-End Encryption (Locally):** Credentials entered into the Vault are encrypted using the Web Crypto API before being stored. The encryption key is derived from your master password and is only held in memory during your session.
-   **Direct API Calls:** When you use an integrated service, the app makes direct, client-to-service API calls. Your data is not proxied through any intermediary server.

---

## 🛠️ Scope & Limitations

As a client-side application, DevCore has a focused scope. It is designed to be a powerful **assistant** for your development workflow, not a replacement for your primary IDE, backend services, or CI/CD platform. It excels at code generation, analysis, and API-based automation but does not run backend servers, train models, or manage infrastructure.