# SecurePass: A Secure Password Manager Extension

SecurePass is a Chrome extension designed to securely store and manage your login credentials. It uses modern cryptographic techniques to encrypt your passwords and automatically fill in login forms on websites like Facebook when needed.

## Features

- **Secure Storage**: Passwords are encrypted using AES-GCM (Advanced Encryption Standard with Galois/Counter Mode) with a key derived from your master password, ensuring that your credentials are safe and can only be accessed with your master password.
- **Automatic Form Filling**: SecurePass can automatically fill in login forms when you interact with username or password fields on supported websites.
- **Master Password Protection**: Your stored passwords are decrypted only after entering your master password, adding an additional layer of security.
- **Event-Driven Autofill**: The autofill functionality is triggered when you focus on login form fields, making the process seamless and efficient.

## Project Structure

The project directory is structured as follows:
SecurePass/
├── images/
│ ├── icon16.png
│ ├── icon48.png
│ └── icon128.png
├── scripts/
│ ├── background.js
│ ├── content.js
│ ├── autofill.js
│ ├── storage.js
│ ├── crypto.js
├── styles/
│ └── popup.css
├── popup.html
├── popup.js
├── manifest.json
└── README.md


### File Descriptions

- **`manifest.json`**: This is the configuration file for your Chrome extension. It defines the permissions, background scripts, content scripts, and other settings necessary for the extension to function properly.
  
- **`scripts/background.js`**: This script manages background tasks, such as storing and retrieving passwords securely in the browser's local storage.

- **`scripts/content.js`**: (Optional) This script can be used to inject functionality into web pages. For instance, it can interact with web page content or manipulate the DOM based on certain triggers.

- **`scripts/autofill.js`**: This script handles the automatic filling of login forms. It listens for user interaction with the form fields and fills in the stored credentials if available.

- **`scripts/storage.js`**: Contains functions for encrypting, decrypting, saving, and retrieving passwords. It interacts with the browser's storage API to securely store and manage the user's credentials.

- **`scripts/crypto.js`**: Implements the cryptographic functions used for encrypting and decrypting passwords. It uses the Web Cryptography API to ensure that all sensitive data is securely handled.

- **`styles/popup.css`**: This file contains the CSS for styling the popup interface of the extension, ensuring a clean and user-friendly UI.

- **`popup.html`**: The HTML file that defines the popup interface of the extension. This is what the user interacts with when they click on the extension's icon in the Chrome toolbar.

- **`popup.js`**: This script handles the logic for the popup interface, including verifying the master password and loading/saving passwords.

## Installation and Setup

### 1. Clone the Repository

Clone or download the repository to your local machine:

```bash
git clone https://github.com/sujit-codezen/PasswordManagerExtension.git
```

### 2. Load the Extension in Chrome

- Open `chrome://extensions/` in your Chrome browser.
- Enable "Developer mode" by toggling the switch in the top-right corner.
- Click on "Load unpacked" and select the root directory of the SecurePass project.

### 3. Configuration

Ensure your `manifest.json` is correctly configured to include all necessary scripts and permissions:
```json
{
  "manifest_version": 3,
  "name": "SecurePass",
  "version": "1.0",
  "description": "A secure password manager extension.",
  "permissions": ["storage", "activeTab", "scripting"],
  "background": {
    "service_worker": "scripts/background.js"
  },
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "images/icon16.png",
      "48": "images/icon48.png",
      "128": "images/icon128.png"
    }
  },
  "icons": {
    "16": "images/icon16.png",
    "48": "images/icon48.png",
    "128": "images/icon128.png"
  },
  "content_scripts": [
    {
      "matches": ["*://www.facebook.com/*"],
      "js": ["scripts/autofill.js"]
    }
  ],
  "web_accessible_resources": [
    {
      "resources": ["images/*"],
      "matches": ["<all_urls>"]
    }
  ]
}
```

### 4. Test the Extension

After loading the extension, navigate to [https://www.facebook.com](https://www.facebook.com).
Click on the username or password field to trigger the autofill functionality.
Enter your master password when prompted to decrypt and autofill your stored credentials.

## Troubleshooting

### 1. Content Script Not Executing

If the autofill functionality isn’t working, first ensure that the content script (`autofill.js`) is being injected properly. You can do this by adding a `console.log('Autofill script loaded')` at the start of the script and checking the browser's console to see if the message appears.

### 2. Incorrect Field IDs

If the script is running but not filling in the login fields, verify that the script is targeting the correct field IDs. Facebook may change the IDs of its form elements, so make sure they match `email` for the username field and `pass` for the password field.

### 3. Extension Context Invalidated

If you encounter the error "Extension context invalidated," it may be due to the script attempting to run in an invalid or outdated context. Ensure that the script is running only after the page has fully loaded and consider adding error handling to manage this issue.

### 4. Content Security Policy (CSP)

Some websites, including Facebook, may have restrictive Content Security Policies (CSP) that prevent the script from running or accessing certain resources. Check the console for CSP-related errors and adjust your script or approach if necessary.

### 5. Permissions

Ensure that your extension has the necessary permissions set in the `manifest.json`. The `storage`, `activeTab`, and `scripting` permissions are required for storing passwords and interacting with web pages.

## Contributing

If you’d like to contribute to SecurePass, feel free to fork the repository and submit a pull request. Contributions are welcome!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


