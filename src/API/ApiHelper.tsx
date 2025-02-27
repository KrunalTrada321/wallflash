import { getFirestore, collection, getDocs } from 'firebase/firestore';
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


export const fetchImagesFromFirestore = async (collections) => {
  try {
    // 🔹 Fetch all collections in parallel
    const fetchPromises = collections.map(async (collectionName: string) => {
      const querySnapshot = await getDocs(collection(db, collectionName));
      return querySnapshot.docs.map(doc => doc.data().url); // Extract URLs
    });

    const imagesArray = await Promise.all(fetchPromises); // Wait for all collections
    return imagesArray.flat(); // Flatten into a single array of URLs
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
};
