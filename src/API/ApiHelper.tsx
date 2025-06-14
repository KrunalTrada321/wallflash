
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
 
// ✅ Function to Check if Image Exists
const isValidImage = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' }); // 🔹 HEAD request to check if the file exists
    return response.ok; // ✅ True if image exists (status 200)
  } catch {
    return false; // ❌ Image does not exist or error occurred
  }
};


export const fetchImagesFromFirestore = async (collections) => {
  try {
    // 🔹 Fetch all collections in parallel
    const fetchPromises = collections.map(async (collectionName) => {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const urls = querySnapshot.docs.map(doc => doc.data().url); // Extract URLs
      
      // 🔹 Check if images exist before returning them
      const validUrls = await Promise.all(urls.map(async (url) => (await isValidImage(url)) ? url : null));
      return validUrls.filter(Boolean); // Remove null values (invalid images)
    });

    const imagesArray = await Promise.all(fetchPromises); // Wait for all collections
    return imagesArray.flat(); // Flatten into a single array of URLs
  } catch (error) {
    console.log('❌ Error fetching images:', error);
    return [];
  }
}; 
  
 