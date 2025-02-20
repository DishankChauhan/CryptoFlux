import { auth, db } from '@/lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ethers } from 'ethers';

export async function signUp(email: string, password: string) {
  try {
    console.log('Starting signup process...');
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('User created:', userCredential.user.uid);
    
    const wallet = ethers.Wallet.createRandom();
    console.log('Wallet created:', wallet.address);
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email: email,
      walletAddress: wallet.address,
      privateKey: wallet.privateKey, // In production, this should be encrypted
      balance: '0',
      createdAt: new Date().toISOString(),
    });
    console.log('User document created in Firestore');

    return { success: true, user: userCredential.user };
  } catch (error: any) {
    console.error('Signup error:', error);
    return { success: false, error: error.message };
  }
}

export async function signIn(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    console.error('Sign in error:', error);
    return { success: false, error: error.message };
  }
}

export async function signInWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    
    // Check if user exists in Firestore
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    
    if (!userDoc.exists()) {
      const wallet = ethers.Wallet.createRandom();
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: userCredential.user.email,
        walletAddress: wallet.address,
        privateKey: wallet.privateKey, // In production, this should be encrypted
        balance: '0',
        createdAt: new Date().toISOString(),
      });
    }

    return { success: true, user: userCredential.user };
  } catch (error: any) {
    console.error('Google sign in error:', error);
    return { success: false, error: error.message };
  }
}

export async function signOut() {
  try {
    await firebaseSignOut(auth);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export function onAuthStateChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}