import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { User as FirebaseUser } from "firebase/auth";
import {
  firebaseSignIn,
  firebaseSignUp,
  firebaseSignOut,
  firebaseResetPassword,
  onAuthChange,
  uploadFile as fbUpload,
  deleteUploadedFile,
  firestoreOps,
} from "./firebase";

interface FirebaseCtx {
  fbUser: FirebaseUser | null;
  fbLoading: boolean;
  signIn: (email: string, pw: string) => Promise<FirebaseUser>;
  signUp: (email: string, pw: string, name: string) => Promise<FirebaseUser>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  upload: (path: string, file: File, onProgress?: (pct: number) => void) => Promise<string>;
  deleteFile: (path: string) => Promise<void>;
  fs: typeof firestoreOps;
}

const Ctx = createContext<FirebaseCtx | null>(null);

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const [fbUser, setFbUser] = useState<FirebaseUser | null>(null);
  const [fbLoading, setFbLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthChange((u) => {
      setFbUser(u);
      setFbLoading(false);
    });
    return () => unsub();
  }, []);

  const signIn = useCallback(async (email: string, pw: string) => {
    const cred = await firebaseSignIn(email, pw);
    return cred.user;
  }, []);

  const signUp = useCallback(async (email: string, pw: string, name: string) => {
    const user = await firebaseSignUp(email, pw, name);
    return user;
  }, []);

  const signOutFn = useCallback(async () => {
    await firebaseSignOut();
  }, []);

  const resetPw = useCallback(async (email: string) => {
    await firebaseResetPassword(email);
  }, []);

  const upload = useCallback(async (path: string, file: File, onProgress?: (pct: number) => void) => {
    const ts = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    return fbUpload(`${path}/${ts}_${safeName}`, file, onProgress);
  }, []);

  const deleteFile = useCallback(async (path: string) => {
    await deleteUploadedFile(path);
  }, []);

  return (
    <Ctx.Provider
      value={{
        fbUser,
        fbLoading,
        signIn,
        signUp,
        signOut: signOutFn,
        resetPassword: resetPw,
        upload,
        deleteFile,
        fs: firestoreOps,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useFirebase() {
  const v = useContext(Ctx);
  if (!v) throw new Error("FirebaseProvider missing");
  return v;
}

/** Convenience hook: true if Firebase is connected and user is authenticated */
export function useFirebaseAuth() {
  const { fbUser, fbLoading } = useFirebase();
  return { firebaseUser: fbUser, firebaseLoading: fbLoading, firebaseReady: !fbLoading };
}
