import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useUser } from '@clerk/clerk-react';
import { properties as staticProperties } from '@/data/properties';
import type { Property, UserRole } from '@/types';

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
  role: UserRole | null;
  // Owner properties
  ownerProperties: Property[];
  addOwnerProperty: (p: Property) => void;
  updateOwnerProperty: (p: Property) => void;
  deleteOwnerProperty: (id: string) => void;
  // Merged properties
  getAllProperties: () => Property[];
}

const AppContext = createContext<AppState | undefined>(undefined);

const OWNER_PROPS_KEY = 'scouthouse_owner_props';

function loadOwnerProperties(): Property[] {
  try {
    const stored = localStorage.getItem(OWNER_PROPS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const { user, isLoaded } = useUser();
  const clerkUserId = user?.id ?? null;
  const role = (user?.unsafeMetadata?.role as UserRole) ?? null;

  const [shortlist, setShortlist] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [ownerProperties, setOwnerProperties] = useState<Property[]>(loadOwnerProperties);

  // Load per-user data when Clerk user changes
  useEffect(() => {
    if (!isLoaded) return;
    if (!clerkUserId) {
      setShortlist([]);
      setCompareList([]);
      setNotes({});
      return;
    }
    try {
      const s = localStorage.getItem(`scouthouse_shortlist_${clerkUserId}`);
      setShortlist(s ? JSON.parse(s) : []);
    } catch { setShortlist([]); }
    try {
      const n = localStorage.getItem(`scouthouse_notes_${clerkUserId}`);
      setNotes(n ? JSON.parse(n) : {});
    } catch { setNotes({}); }
    setCompareList([]);
  }, [clerkUserId, isLoaded]);

  useEffect(() => {
    if (!clerkUserId) return;
    try { localStorage.setItem(`scouthouse_shortlist_${clerkUserId}`, JSON.stringify(shortlist)); } catch { /* */ }
  }, [shortlist, clerkUserId]);

  useEffect(() => {
    if (!clerkUserId) return;
    try { localStorage.setItem(`scouthouse_notes_${clerkUserId}`, JSON.stringify(notes)); } catch { /* */ }
  }, [notes, clerkUserId]);

  useEffect(() => { try { localStorage.setItem(OWNER_PROPS_KEY, JSON.stringify(ownerProperties)); } catch { /* */ } }, [ownerProperties]);

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
        role,
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
