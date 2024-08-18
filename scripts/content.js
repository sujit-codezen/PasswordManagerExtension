// Content script for SecurePass extension
// This script runs in the context of web pages and can be used to interact with the page's DOM

// Example: Detect form submissions and capture login information
document.addEventListener('submit', function (event) {
    // Ensure we're dealing with a login form
    if (event.target.tagName === 'FORM' && event.target.querySelector('input[type="password"]')) {
        const formData = new FormData(event.target);
        const site = window.location.hostname;
        const username = formData.get('username') || formData.get('email');
        const password = formData.get('password');

        // Send the captured data to the background script or popup for storage
        if (username && password) {
            chrome.runtime.sendMessage({
                action: 'captureLogin',
                site: site,
                username: username,
                password: password
            });
        }
    }
}, true);

