import { generateSalt, hashPassword, verifyPassword, generateWalletAddress } from '../utils/crypto';
import { STARTER_HOLDINGS } from '../config/coins';

const USERS_KEY = 'algotrade_users';
const SESSION_KEY = 'algotrade_session';

function readUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function publicUser(user) {
  const {
    name,
    email,
    initials,
    createdAt,
    walletAddress,
    walletCreatedAt,
    inrBalance,
    upiTransactions,
    activity,
  } = user;
  return {
    name,
    email,
    initials,
    createdAt,
    walletAddress,
    walletCreatedAt,
    inrBalance,
    upiTransactions,
    activity: activity ?? [],
  };
}

// Appends an entry to the front of a user's unified activity feed
// (buys, swaps, UPI deposits) so the dashboard can render one
// combined, most-recent-first list instead of juggling three arrays.
function pushActivity(user, entry) {
  const record = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, date: new Date().toISOString(), ...entry };
  user.activity = [record, ...(user.activity ?? [])].slice(0, 25);
  return record;
}

function initials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

function delay(ms = 450) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function signupUser({ name, email, password }) {
  await delay();
  const users = readUsers();
  const normalizedEmail = normalizeEmail(email);

  if (users.some((u) => u.email === normalizedEmail)) {
    throw new Error('An account with this email already exists.');
  }

  const salt = generateSalt();
  const passwordHash = hashPassword(password, salt);

  const user = {
    name: name.trim(),
    email: normalizedEmail,
    initials: initials(name),
    salt,
    passwordHash,
    createdAt: new Date().toISOString(),
    walletAddress: null,
    walletCreatedAt: null,
    holdings: STARTER_HOLDINGS,
    inrBalance: 0,
    upiTransactions: [],
    activity: [],
  };

  users.push(user);
  writeUsers(users);
  localStorage.setItem(SESSION_KEY, JSON.stringify({ email: normalizedEmail, remember: true }));

  return publicUser(user);
}

export async function loginUser({ email, password, remember }) {
  await delay();
  const users = readUsers();
  const normalizedEmail = normalizeEmail(email);
  const user = users.find((u) => u.email === normalizedEmail);

  if (!user) {
    throw new Error('No account found with this email.');
  }

  const valid = verifyPassword(password, user.salt, user.passwordHash);
  if (!valid) {
    throw new Error('Incorrect password. Please try again.');
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify({ email: normalizedEmail, remember: !!remember }));
  return publicUser(user);
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
}

export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const { email } = JSON.parse(raw);
    const users = readUsers();
    const user = users.find((u) => u.email === email);
    return user ? publicUser(user) : null;
  } catch {
    return null;
  }
}

export async function createWallet(email) {
  await delay(600);
  const users = readUsers();
  const idx = users.findIndex((u) => u.email === normalizeEmail(email));
  if (idx === -1) throw new Error('Session expired. Please log in again.');

  if (!users[idx].walletAddress) {
    users[idx].walletAddress = generateWalletAddress();
    users[idx].walletCreatedAt = new Date().toISOString();
    writeUsers(users);
  }
  return publicUser(users[idx]);
}

export function getHoldings(email) {
  const users = readUsers();
  const user = users.find((u) => u.email === normalizeEmail(email));
  return user?.holdings ?? {};
}

export async function buyCoin(email, coinId, amount, costInInr) {
  await delay(400);
  const users = readUsers();
  const idx = users.findIndex((u) => u.email === normalizeEmail(email));
  if (idx === -1) throw new Error('Session expired. Please log in again.');

  const balance = users[idx].inrBalance ?? 0;
  if (balance < costInInr) {
    throw new Error('Insufficient balance. Add money via UPI first.');
  }

  users[idx].inrBalance = balance - costInInr;
  const current = users[idx].holdings?.[coinId] ?? 0;
  users[idx].holdings = { ...users[idx].holdings, [coinId]: current + amount };
  pushActivity(users[idx], {
    type: 'buy',
    coinId,
    amount,
    costInInr,
  });
  writeUsers(users);
  return publicUser(users[idx]);
}

// Symmetric counterpart to buyCoin: reduces a held asset and credits
// the sale value back to the user's INR balance at the rate the
// caller already computed.
export async function sellCoin(email, coinId, amount, creditInr) {
  await delay(400);
  const users = readUsers();
  const idx = users.findIndex((u) => u.email === normalizeEmail(email));
  if (idx === -1) throw new Error('Session expired. Please log in again.');

  const holdings = users[idx].holdings ?? {};
  const available = holdings[coinId] ?? 0;
  if (amount <= 0) {
    throw new Error('Enter an amount greater than 0.');
  }
  if (available < amount) {
    throw new Error('You do not hold enough of this asset to sell.');
  }

  users[idx].holdings = { ...holdings, [coinId]: Number((available - amount).toFixed(10)) };
  users[idx].inrBalance = (users[idx].inrBalance ?? 0) + creditInr;
  pushActivity(users[idx], { type: 'sell', coinId, amount, creditInr });
  writeUsers(users);
  return publicUser(users[idx]);
}

// Converts one held asset into another at the live market rate the
// caller already computed (fromAmount/toAmount), minus nothing extra
// here - the platform fee is baked into toAmount by the caller so the
// ledger always balances.
export async function swapCoin(email, fromCoinId, toCoinId, fromAmount, toAmount) {
  await delay(500);
  const users = readUsers();
  const idx = users.findIndex((u) => u.email === normalizeEmail(email));
  if (idx === -1) throw new Error('Session expired. Please log in again.');

  const holdings = users[idx].holdings ?? {};
  const available = holdings[fromCoinId] ?? 0;

  if (fromAmount <= 0 || toAmount <= 0) {
    throw new Error('Enter an amount greater than 0.');
  }
  if (available < fromAmount) {
    throw new Error('Insufficient balance for this swap.');
  }
  if (fromCoinId === toCoinId) {
    throw new Error('Choose two different assets to swap.');
  }

  users[idx].holdings = {
    ...holdings,
    [fromCoinId]: Number((available - fromAmount).toFixed(10)),
    [toCoinId]: Number(((holdings[toCoinId] ?? 0) + toAmount).toFixed(10)),
  };

  pushActivity(users[idx], {
    type: 'swap',
    fromCoinId,
    toCoinId,
    fromAmount,
    toAmount,
  });

  writeUsers(users);
  return publicUser(users[idx]);
}

const UPI_ID_RE = /^[\w.-]+@[\w.-]+$/;

export async function payViaUpi(email, upiId, amount) {
  await delay(700);

  if (!UPI_ID_RE.test(upiId)) {
    throw new Error('Enter a valid UPI ID, like name@bank.');
  }
  if (!amount || amount <= 0) {
    throw new Error('Enter an amount greater than 0.');
  }

  const users = readUsers();
  const idx = users.findIndex((u) => u.email === normalizeEmail(email));
  if (idx === -1) throw new Error('Session expired. Please log in again.');

  const transaction = {
    id: Date.now().toString(),
    upiId,
    amount,
    date: new Date().toISOString(),
  };

  users[idx].inrBalance = (users[idx].inrBalance ?? 0) + amount;
  users[idx].upiTransactions = [transaction, ...(users[idx].upiTransactions ?? [])];
  pushActivity(users[idx], { type: 'upi', upiId, amount });
  writeUsers(users);

  return publicUser(users[idx]);
}
