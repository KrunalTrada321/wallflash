import {
  getFirestore,
  collection,
  getDocs,
  query,
  limit,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

// 🔹 Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1QSD-C73Ji7mxga56AwMKKDlv-fjmJPM",
  projectId: "wallflash-2f185",
  storageBucket: "wallflash-2f185.firebasestorage.app",
  messagingSenderId: "356851868754",
  appId: "1:356851868754:android:d846d6ecd3ac07f1546b8b"
};

// 🔹 Initialize Firebase App & Firestore 
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ Function to Check if Image Exists
const isValidImage = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

// 🔄 Track last document fetched for each collection
const lastDocs: { [collectionName: string]: QueryDocumentSnapshot<DocumentData> | null } = {};
const PAGE_LIMIT = 12;

export const fetchImagesFromFirestore = async (
  collections: string[],
  reset: boolean = false
): Promise<string[]> => {
  try {
    if (reset) {
      // 🔁 Clear lastDocs if it's a fresh fetch (e.g. pull to refresh)
      for (const name of collections) {
        lastDocs[name] = null;
      }
    }

    const perCollectionLimit = Math.ceil(PAGE_LIMIT / collections.length);

    const fetchPromises = collections.map(async (collectionName) => {
      const collRef = collection(db, collectionName);
      let q;

      const lastDoc = lastDocs[collectionName];
      if (lastDoc) {
        q = query(collRef, limit(perCollectionLimit), startAfter(lastDoc));
      } else {
        q = query(collRef, limit(perCollectionLimit));
      }

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        lastDocs[collectionName] = snapshot.docs[snapshot.docs.length - 1];
      }

      const urls = snapshot.docs.map(doc => doc.data().url);
      const validUrls = await Promise.all(
        urls.map(async (url) => (await isValidImage(url)) ? url : null)
      );
      return validUrls.filter(Boolean);
    });

    const allResults = await Promise.all(fetchPromises);
    const combined = allResults.flat();

    return combined.sort(() => Math.random() - 0.5); // ✅ Shuffle but don't limit again
  } catch (error) {
    console.log('❌ Error in paginated fetch:', error);
    return [];
  }
};
