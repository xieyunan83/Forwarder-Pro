import { User } from '../types';

const USERS_KEY = 'trade_scout_users';

/** 纯 JS SHA-256，用于非安全上下文（http://局域网IP）无 crypto.subtle 时 */
function sha256Fallback(message: string): string {
  const K = [
    0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
    0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
    0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
    0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
    0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
    0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
    0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
    0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2
  ];
  const rotr = (n: number, x: number) => (x >>> n) | (x << (32 - n));
  const bytes = new TextEncoder().encode(message);
  const bitLen = bytes.length * 8;
  const withPad = new Uint8Array(((bytes.length + 9 + 63) >> 6) << 6);
  withPad.set(bytes);
  withPad[bytes.length] = 0x80;
  const view = new DataView(withPad.buffer);
  view.setUint32(withPad.length - 4, bitLen, false);

  let [h0,h1,h2,h3,h4,h5,h6,h7] = [
    0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19
  ];

  for (let i = 0; i < withPad.length; i += 64) {
    const w = new Uint32Array(64);
    for (let j = 0; j < 16; j++) w[j] = view.getUint32(i + j * 4, false);
    for (let j = 16; j < 64; j++) {
      const s0 = rotr(7, w[j-15]) ^ rotr(18, w[j-15]) ^ (w[j-15] >>> 3);
      const s1 = rotr(17, w[j-2]) ^ rotr(19, w[j-2]) ^ (w[j-2] >>> 10);
      w[j] = (w[j-16] + s0 + w[j-7] + s1) >>> 0;
    }
    let [a,b,c,d,e,f,g,h] = [h0,h1,h2,h3,h4,h5,h6,h7];
    for (let j = 0; j < 64; j++) {
      const S1 = rotr(6, e) ^ rotr(11, e) ^ rotr(25, e);
      const ch = (e & f) ^ (~e & g);
      const t1 = (h + S1 + ch + K[j] + w[j]) >>> 0;
      const S0 = rotr(2, a) ^ rotr(13, a) ^ rotr(22, a);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (S0 + maj) >>> 0;
      h = g; g = f; f = e; e = (d + t1) >>> 0;
      d = c; c = b; b = a; a = (t1 + t2) >>> 0;
    }
    h0 = (h0 + a) >>> 0; h1 = (h1 + b) >>> 0; h2 = (h2 + c) >>> 0; h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0; h5 = (h5 + f) >>> 0; h6 = (h6 + g) >>> 0; h7 = (h7 + h) >>> 0;
  }

  return [h0,h1,h2,h3,h4,h5,h6,h7].map(x => x.toString(16).padStart(8, '0')).join('');
}

export async function hashPassword(password: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }
  console.warn('crypto.subtle unavailable; using JS SHA-256. Prefer http://localhost:3000');
  return sha256Fallback(password);
}

export async function verifyPassword(password: string, storedHash: string | undefined): Promise<boolean> {
  if (!storedHash) return false;
  return (await hashPassword(password)) === storedHash;
}

export function loadUsersFromStorage(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveUsersToStorage(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function findUserByName(users: User[], username: string): User | undefined {
  const key = username.trim().toLowerCase();
  return users.find(u => u.username.trim().toLowerCase() === key);
}

/** 为旧数据中没有 password 的默认账号补哈希（仅 admin / user） */
export async function ensureUserPasswords(users: User[]): Promise<User[]> {
  const legacy: Record<string, string> = { admin: 'admin123', user: 'user123' };
  return Promise.all(
    users.map(async (u) => {
      if (u.password?.trim()) return u;
      const pwd = legacy[u.username.trim().toLowerCase()];
      if (!pwd) return u;
      return { ...u, password: await hashPassword(pwd), isFirstLogin: true };
    })
  );
}

export async function loadUsersWithMigration(): Promise<User[]> {
  const stored = loadUsersFromStorage();
  if (stored.length === 0) {
    const defaults = await createDefaultUsers();
    saveUsersToStorage(defaults);
    return defaults;
  }
  const migrated = await ensureUserPasswords(stored);
  if (JSON.stringify(migrated) !== JSON.stringify(stored)) {
    saveUsersToStorage(migrated);
  }
  return migrated;
}

export async function authenticateUser(username: string, password: string): Promise<User | null> {
  const trimmedUser = username.trim();
  const trimmedPwd = password.trim();
  if (!trimmedUser || !trimmedPwd) return null;

  const users = loadUsersFromStorage();
  let user = findUserByName(users, trimmedUser);

  if (!user) {
    const migrated = await loadUsersWithMigration();
    user = findUserByName(migrated, trimmedUser);
  }

  if (!user?.password?.trim()) return null;
  const ok = await verifyPassword(trimmedPwd, user.password);
  return ok ? user : null;
}

export function updateUserPassword(users: User[], username: string, hashedPassword: string): User[] {
  const key = username.trim().toLowerCase();
  return users.map(u =>
    u.username.trim().toLowerCase() === key ? { ...u, password: hashedPassword } : u
  );
}

export async function createDefaultUsers(): Promise<User[]> {
  const now = Date.now();
  return [
    {
      username: 'admin',
      role: 'admin',
      password: await hashPassword('admin123'),
      isFirstLogin: true,
      createdAt: now,
    },
    {
      username: 'user',
      role: 'user',
      password: await hashPassword('user123'),
      isFirstLogin: true,
      createdAt: now,
    },
  ];
}
