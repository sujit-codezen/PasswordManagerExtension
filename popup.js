async function verifyMasterPassword(masterPassword) {
    return new Promise((resolve) => {
        chrome.storage.local.get('masterPasswordHash', async function (result) {
            if (result.masterPasswordHash) {
                const hashedPassword = await hashPassword(masterPassword);
                resolve(hashedPassword === result.masterPasswordHash);
            } else {
                const hashedPassword = await hashPassword(masterPassword);
                chrome.storage.local.set({ masterPasswordHash: hashedPassword }, () => {
                    resolve(true);
                });
            }
        });
    });
}

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}


document.getElementById('unlock-btn').addEventListener('click', async function () {
    const masterPassword = document.getElementById('master-password').value;

    if (await verifyMasterPassword(masterPassword)) {
        document.getElementById('passwords-list').style.display = 'block';
        loadPasswords(masterPassword);
    } else {
        alert('Incorrect Master Password');
    }
});

document.getElementById('save-password-btn').addEventListener('click', async function () {
    const site = document.getElementById('new-site').value;
    const username = document.getElementById('new-username').value;
    const password = document.getElementById('new-password').value;
    const masterPassword = document.getElementById('master-password').value;

    if (site && username && password) {
        await savePassword(site, username, password, masterPassword);
        loadPasswords(masterPassword);
    }
});

async function loadPasswords(masterPassword) {
    const passwordList = document.getElementById('password-list');
    passwordList.innerHTML = '';
    
    const passwords = await getAllPasswords(masterPassword);
    
    passwords.forEach(({ site, username, password }) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${site}: ${username} - ${password}`;
        passwordList.appendChild(listItem);
    });
}

