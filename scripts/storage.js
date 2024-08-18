// Function to save a password (site, username, password) with encryption using the master password
async function savePassword(site, username, password, masterPassword) {
    const { encryptedData, iv } = await encryptData(`${username}:${password}`, masterPassword);
    chrome.runtime.sendMessage({
        action: 'savePassword',
        site,
        encryptedData: {
            data: Array.from(new Uint8Array(encryptedData)),
            iv: Array.from(iv)
        }
    });
}

// Function to retrieve all saved passwords, decrypting them with the master password
async function getAllPasswords(masterPassword) {
    return new Promise((resolve) => {
        chrome.storage.local.get('passwords', async function (result) {
            let passwords = [];
            for (let site in result.passwords) {
                const { data, iv } = result.passwords[site];
                const encryptedData = new Uint8Array(data).buffer;
                const decrypted = await decryptData(encryptedData, new Uint8Array(iv), masterPassword);
                const [username, password] = decrypted.split(':');
                passwords.push({ site, username, password });
            }
            resolve(passwords);
        });
    });
}

// Helper function to encrypt data using AES-GCM with a derived key
async function encryptData(text, password) {
    const enc = new TextEncoder();
    const key = await deriveKey(password);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        enc.encode(text)
    );
    return { encryptedData: encrypted, iv };
}

// Helper function to decrypt data using AES-GCM with a derived key
async function decryptData(encryptedData, iv, password) {
    const key = await deriveKey(password);
    const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        encryptedData
    );
    return new TextDecoder().decode(decrypted);
}

// Function to derive a key from the master password using PBKDF2
async function deriveKey(password) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        'raw', enc.encode(password),
        'PBKDF2', false, ['deriveKey']
    );
    return crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: enc.encode('salty'),
            iterations: 100000,
            hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
    );
}

