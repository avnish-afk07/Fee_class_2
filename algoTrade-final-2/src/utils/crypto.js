export function generateSalt(length = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let salt = '';
  for (let i = 0; i < length; i++) {
    salt += chars[Math.floor(Math.random() * chars.length)];
  }
  return salt;
}

function simpleHash(text) {
  let hash = 5381;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 33) ^ text.charCodeAt(i);
  }
  return (hash >>> 0).toString(16); // unsigned, as a hex string
}

export function hashPassword(password, salt) {
  return simpleHash(`${salt}:${password}`);
}

export function verifyPassword(password, salt, expectedHash) {
  return hashPassword(password, salt) === expectedHash;
}

export function generateWalletAddress() {
  const chars = 'abcdef0123456789';
  let address = '0x';
  for (let i = 0; i < 40; i++) {
    address += chars[Math.floor(Math.random() * chars.length)];
  }
  return address;
}
