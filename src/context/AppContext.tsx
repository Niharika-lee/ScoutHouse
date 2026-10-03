import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { properties as staticProperties } from '@/data/properties';
import type { Property, User, UserRole } from '@/types';

interface AuthResult {
  ok: boolean;
  error?: string;
  role?: UserRole;
}

interface AppState {
  shortlist: string[];
  toggleShortlist: (id: string) => void;
  isShortlisted: (id: string) => boolean;
  notes: Record<string, string>;
  setNote: (id: string, note: string) => void;
  compareList: string[];
  toggleCompare: (id: string) => void;
  isInCompare: (id: string) => boolean;
  clearCompare: () => void;
  removeFromCompare: (id: string) => void;
  compareLimitReached: boolean;
  // Auth
  user: User | null;
  signup: (name: string, email: string, password: string, role: UserRole) => AuthResult;
  login: (email: string, password: string) => AuthResult;
  logout: () => void;
  // Owner properties
  ownerProperties: Property[];
  addOwnerProperty: (p: Property) => void;
  updateOwnerProperty: (p: Property) => void;
  deleteOwnerProperty: (id: string) => void;
  // Merged properties
  getAllProperties: () => Property[];
}

const AppContext = createContext<AppState | undefined>(undefined);

const SHORTLIST_KEY = 'scouthouse_shortlist';
const NOTES_KEY = 'scouthouse_notes';
const USERS_KEY = 'scouthouse_users';
const SESSION_KEY = 'scouthouse_session';
const OWNER_PROPS_KEY = 'scouthouse_owner_props';

interface StoredUser extends User {
  password: string;
}

const demoUsers: StoredUser[] = [
  { name: 'Demo Student', email: 'student@demo.com', password: 'demo123', role: 'Tenant' },
  { name: 'Demo Owner', email: 'owner@demo.com', password: 'demo123', role: 'Owner' },
];

function loadUsers(): StoredUser[] {
  try {
    const stored = localStorage.getItem(USERS_KEY);
    if (stored) {
      const parsed: StoredUser[] = JSON.parse(stored);
      const hasDemo = parsed.some((u) => u.email === 'student@demo.com');
      return hasDemo ? parsed : [...demoUsers, ...parsed];
    }
  } catch { /* ignore */ }
  return [...demoUsers];
}

function saveUsers(users: StoredUser[]) {
  try { localStorage.setItem(USERS_KEY, JSON.stringify(users)); } catch { /* ignore */ }
}

function loadOwnerProperties(): Property[] {
  try {
    const stored = localStorage.getItem(OWNER_PROPS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [shortlist, setShortlist] = useState<string[]>(() => {
    try { const s = localStorage.getItem(SHORTLIST_KEY); return s ? JSON.parse(s) : []; } catch { return []; }
  });
  const [compareList, setCompareList] = useState<string[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>(() => {
    try { const s = localStorage.getItem(NOTES_KEY); return s ? JSON.parse(s) : {}; } catch { return {}; }
  });
  const [user, setUser] = useState<User | null>(() => {
    try { const s = localStorage.getItem(SESSION_KEY); return s ? JSON.parse(s) : null; } catch { return null; }
  });
  const [ownerProperties, setOwnerProperties] = useState<Property[]>(loadOwnerProperties);

  useEffect(() => { try { localStorage.setItem(SHORTLIST_KEY, JSON.stringify(shortlist)); } catch { /* */ } }, [shortlist]);
  useEffect(() => { try { localStorage.setItem(NOTES_KEY, JSON.stringify(notes)); } catch { /* */ } }, [notes]);
  useEffect(() => { try { localStorage.setItem(OWNER_PROPS_KEY, JSON.stringify(ownerProperties)); } catch { /* */ } }, [ownerProperties]);
  useEffect(() => {
    try {
      if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      else localStorage.removeItem(SESSION_KEY);
    } catch { /* */ }
  }, [user]);

  const toggleShortlist = (id: string) => setShortlist((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]);
  const isShortlisted = (id: string) => shortlist.includes(id);
  const setNote = (id: string, note: string) => setNotes((prev) => ({ ...prev, [id]: note }));
  const toggleCompare = (id: string) => setCompareList((prev) => {
    if (prev.includes(id)) return prev.filter((p) => p !== id);
    if (prev.length >= 3) return prev;
    return [...prev, id];
  });
  const isInCompare = (id: string) => compareList.includes(id);
  const clearCompare = () => setCompareList([]);
  const removeFromCompare = (id: string) => setCompareList((prev) => prev.filter((p) => p !== id));
  const compareLimitReached = compareList.length >= 3;

  const signup = (name: string, email: string, password: string, role: UserRole): AuthResult => {
    const users = loadUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: 'An account with this email already exists' };
    }
    const newUser: StoredUser = { name, email, password, role };
    users.push(newUser);
    saveUsers(users);
    const sessionUser: User = { name, email, role };
    setUser(sessionUser);
    return { ok: true, role };
  };

  const login = (email: string, password: string): AuthResult => {
    const users = loadUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!found) return { ok: false, error: 'Invalid email or password' };
    const sessionUser: User = { name: found.name, email: found.email, role: found.role };
    setUser(sessionUser);
    return { ok: true, role: found.role };
  };

  const logout = () => setUser(null);

  const addOwnerProperty = (p: Property) => setOwnerProperties((prev) => [p, ...prev]);
  const updateOwnerProperty = (p: Property) => setOwnerProperties((prev) => prev.map((item) => item.id === p.id ? p : item));
  const deleteOwnerProperty = (id: string) => setOwnerProperties((prev) => prev.filter((p) => p.id !== id));

  const getAllProperties = (): Property[] => [...ownerProperties, ...staticProperties];

  return (
    <AppContext.Provider
      value={{
        shortlist, toggleShortlist, isShortlisted,
        notes, setNote,
        compareList, toggleCompare, isInCompare, clearCompare, removeFromCompare, compareLimitReached,
        user, signup, login, logout,
        ownerProperties, addOwnerProperty, updateOwnerProperty, deleteOwnerProperty,
        getAllProperties,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
