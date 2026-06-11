import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  serverTimestamp,
  type DocumentData,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAyNzbODRFtuRlAWB8cHROai5t0qW5lcJ0",
  authDomain: "muhammed-pp.firebaseapp.com",
  projectId: "muhammed-pp",
  storageBucket: "muhammed-pp.firebasestorage.app",
  messagingSenderId: "654411921978",
  appId: "1:654411921978:web:d6086b7356595eca731303",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
export { serverTimestamp };

/* ============ AUTH HELPERS ============ */

export async function firebaseSignUp(email: string, password: string, displayName: string) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName });
  return cred.user;
}

export function firebaseSignIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function firebaseSignOut() {
  return signOut(auth);
}

export function firebaseResetPassword(email: string) {
  return sendPasswordResetEmail(auth, email);
}

export function onAuthChange(cb: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, cb);
}

/* ============ STORAGE HELPERS ============ */

export async function uploadFile(path: string, file: File, onProgress?: (pct: number) => void): Promise<string> {
  const fileRef = ref(storage, path);
  const task = uploadBytesResumable(fileRef, file);

  return new Promise((resolve, reject) => {
    task.on(
      "state_changed",
      (snapshot) => {
        const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        onProgress?.(pct);
      },
      (error) => reject(error),
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve(url);
      },
    );
  });
}

export async function deleteUploadedFile(path: string) {
  const fileRef = ref(storage, path);
  await deleteObject(fileRef);
}

/* ============ FIRESTORE HELPERS ============ */

export interface FirestoreMessage {
  id?: string;
  fromName: string;
  fromEmail: string;
  subject: string;
  body: string;
  read: boolean;
  archived: boolean;
  replies: { id: string; from: string; body: string; at: string; admin?: boolean }[];
  createdAt: any;
}

export interface FirestoreComment {
  id?: string;
  targetType: "project" | "achievement" | "event" | "gallery";
  targetId: string;
  userId: string;
  userName: string;
  text: string;
  approved: boolean;
  pinned: boolean;
  createdAt: any;
}

export interface FirestoreRating {
  id?: string;
  stars: number;
  user?: string;
  at: any;
}

export async function addDocument(col: string, data: DocumentData): Promise<string> {
  const docRef = await addDoc(collection(db, col), { ...data, createdAt: serverTimestamp() });
  return docRef.id;
}

export async function setDocument(col: string, docId: string, data: DocumentData) {
  await setDoc(doc(db, col, docId), { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

export async function getDocument(col: string, docId: string) {
  const snap = await getDoc(doc(db, col, docId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function getCollection(col: string, ...constraints: any[]) {
  const q = query(collection(db, col), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function updateDocument(col: string, docId: string, data: Partial<DocumentData>) {
  await updateDoc(doc(db, col, docId), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteDocument(col: string, docId: string) {
  await deleteDoc(doc(db, col, docId));
}

export const firestoreOps = {
  add: addDocument,
  set: setDocument,
  get: getDocument,
  list: getCollection,
  update: updateDocument,
  del: deleteDocument,
};

export default app;
