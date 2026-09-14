import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  onSnapshot,
  increment,
  query,
  limit,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

export interface InquiryPayload {
  name: string;
  email: string;
  message: string;
  userId?: string;
}

export interface ProjectLikeDoc {
  projectId: string;
  likesCount: number;
  updatedAt: string;
}

export interface GuestbookEntry {
  id: string;
  name: string;
  role: string;
  message: string;
  createdAt: string;
  userId?: string;
  avatarUrl?: string;
}

export interface UserProfileDoc {
  uid: string;
  displayName?: string;
  email?: string;
  photoURL?: string;
  savedProjects?: string[];
  notes?: string;
  lastActiveAt: string;
}

// Generates a collision-resistant safe ID matching ^[a-zA-Z0-9_\-]+$
function generateSafeId(prefix: string): string {
  const ts = Date.now().toString();
  const rand = Math.random().toString(36).substring(2, 9);
  return `${prefix}_${ts}_${rand}`.replace(/[^a-zA-Z0-9_\-]/g, '');
}

/**
 * Sync user profile upon Google Sign-In with Firestore
 */
export async function syncUserProfile(user: {
  uid: string;
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
}): Promise<UserProfileDoc> {
  const path = `users/${user.uid}`;
  const userRef = doc(db, 'users', user.uid);
  const now = new Date().toISOString();

  try {
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      const initialProfile: UserProfileDoc = {
        uid: user.uid,
        displayName: user.displayName || 'Visitor',
        email: user.email || '',
        photoURL: user.photoURL || '',
        savedProjects: [],
        notes: '',
        lastActiveAt: now,
      };
      await setDoc(userRef, initialProfile);
      return initialProfile;
    } else {
      const existing = snap.data() as UserProfileDoc;
      const updated: Partial<UserProfileDoc> = {
        lastActiveAt: now,
      };
      if (user.displayName && !existing.displayName) updated.displayName = user.displayName;
      if (user.email && !existing.email) updated.email = user.email;
      if (user.photoURL && !existing.photoURL) updated.photoURL = user.photoURL;

      await updateDoc(userRef, updated);
      return { ...existing, ...updated };
    }
  } catch (err) {
    return handleFirestoreError(err, OperationType.WRITE, path);
  }
}

/**
 * Subscribes to real-time user profile
 */
export function subscribeToUserProfile(
  uid: string,
  onUpdate: (profile: UserProfileDoc | null) => void
): () => void {
  const path = `users/${uid}`;
  const userRef = doc(db, 'users', uid);

  return onSnapshot(
    userRef,
    (snapshot) => {
      if (snapshot.exists()) {
        onUpdate(snapshot.data() as UserProfileDoc);
      } else {
        onUpdate(null);
      }
    },
    (err) => {
      handleFirestoreError(err, OperationType.GET, path);
    }
  );
}

/**
 * Toggle bookmarking a project for an authenticated user
 */
export async function toggleProjectBookmark(
  uid: string,
  projectId: string
): Promise<string[]> {
  const path = `users/${uid}`;
  const userRef = doc(db, 'users', uid);

  try {
    const snap = await getDoc(userRef);
    const existing = snap.exists() ? (snap.data() as UserProfileDoc) : { uid, savedProjects: [] };
    const currentSaved = existing.savedProjects || [];

    let updatedSaved: string[];
    if (currentSaved.includes(projectId)) {
      updatedSaved = currentSaved.filter((id) => id !== projectId);
    } else {
      updatedSaved = [...currentSaved, projectId];
    }

    await updateDoc(userRef, {
      savedProjects: updatedSaved,
      lastActiveAt: new Date().toISOString(),
    });

    return updatedSaved;
  } catch (err) {
    return handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

/**
 * Save recruiter notes / private memo
 */
export async function saveUserNotes(uid: string, notes: string): Promise<void> {
  const path = `users/${uid}`;
  const userRef = doc(db, 'users', uid);

  try {
    await updateDoc(userRef, {
      notes: notes.slice(0, 1000),
      lastActiveAt: new Date().toISOString(),
    });
  } catch (err) {
    return handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

/**
 * Submits visitor contact inquiry to Firestore collection `inquiries`
 */
export async function submitContactInquiry(payload: InquiryPayload): Promise<string> {
  const sanitizedName = payload.name.trim().slice(0, 100);
  const sanitizedEmail = payload.email.trim().slice(0, 150);
  const sanitizedMessage = payload.message.trim().slice(0, 2000);

  if (!sanitizedName || !sanitizedEmail || !sanitizedMessage) {
    throw new Error('Please provide name, valid email, and inquiry message.');
  }

  const inquiryId = generateSafeId('inq');
  const path = `inquiries/${inquiryId}`;

  try {
    const docRef = doc(db, 'inquiries', inquiryId);
    const data: Record<string, unknown> = {
      name: sanitizedName,
      email: sanitizedEmail,
      message: sanitizedMessage,
      createdAt: new Date().toISOString(),
    };
    if (payload.userId) {
      data.userId = payload.userId;
    }

    await setDoc(docRef, data);
    return inquiryId;
  } catch (err) {
    return handleFirestoreError(err, OperationType.CREATE, path);
  }
}

/**
 * Listens to real-time appreciation count for a project
 */
export function subscribeToProjectLikes(
  projectId: string,
  onUpdate: (count: number) => void
): () => void {
  const path = `project_likes/${projectId}`;
  const docRef = doc(db, 'project_likes', projectId);

  const unsubscribe = onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as ProjectLikeDoc;
        onUpdate(data.likesCount || 0);
      } else {
        onUpdate(0);
      }
    },
    (err) => {
      handleFirestoreError(err, OperationType.GET, path);
    }
  );

  return unsubscribe;
}

/**
 * Atomically increments like counter for a project in Firestore
 */
export async function likeProject(projectId: string): Promise<number> {
  const path = `project_likes/${projectId}`;
  const docRef = doc(db, 'project_likes', projectId);

  try {
    const snap = await getDoc(docRef);
    const now = new Date().toISOString();

    if (!snap.exists()) {
      await setDoc(docRef, {
        projectId,
        likesCount: 1,
        updatedAt: now,
      });
      return 1;
    } else {
      const current = (snap.data() as ProjectLikeDoc).likesCount || 0;
      await updateDoc(docRef, {
        likesCount: increment(1),
        updatedAt: now,
      });
      return current + 1;
    }
  } catch (err) {
    return handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

/**
 * Subscribes to real-time visitor endorsements and guestbook notes
 */
export function subscribeToGuestbook(
  onUpdate: (entries: GuestbookEntry[]) => void
): () => void {
  const path = 'guestbook';
  const q = query(collection(db, 'guestbook'), limit(30));

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const items: GuestbookEntry[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        items.push({
          id: d.id,
          name: data.name || 'Anonymous',
          role: data.role || 'Visitor',
          message: data.message || '',
          createdAt: data.createdAt || '',
          userId: data.userId,
          avatarUrl: data.avatarUrl,
        });
      });
      // Sort newest first
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onUpdate(items);
    },
    (err) => {
      handleFirestoreError(err, OperationType.GET, path);
    }
  );

  return unsubscribe;
}

/**
 * Adds a new endorsement or recruiter guestbook note
 */
export async function addGuestbookNote(
  name: string,
  role: string,
  message: string,
  userInfo?: { userId?: string; avatarUrl?: string }
): Promise<string> {
  const sanitizedName = name.trim().slice(0, 100);
  const sanitizedRole = (role || 'Portfolio Visitor').trim().slice(0, 80);
  const sanitizedMessage = message.trim().slice(0, 500);

  if (!sanitizedName || !sanitizedMessage) {
    throw new Error('Name and message are required.');
  }

  const entryId = generateSafeId('entry');
  const path = `guestbook/${entryId}`;

  try {
    const docRef = doc(db, 'guestbook', entryId);
    const data: Record<string, unknown> = {
      name: sanitizedName,
      role: sanitizedRole,
      message: sanitizedMessage,
      createdAt: new Date().toISOString(),
    };
    if (userInfo?.userId) data.userId = userInfo.userId;
    if (userInfo?.avatarUrl) data.avatarUrl = userInfo.avatarUrl;

    await setDoc(docRef, data);
    return entryId;
  } catch (err) {
    return handleFirestoreError(err, OperationType.CREATE, path);
  }
}
