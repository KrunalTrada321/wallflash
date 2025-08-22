import {
    getFirestore,
    collection,
    getDocs,
    DocumentData,
  } from "firebase/firestore";
  import { initializeApp } from "firebase/app";
  
  // 🔹 Firebase Configuration
  const firebaseConfig = {
    apiKey: "AIzaSyD1QSD-C73Ji7mxga56AwMKKDlv-fjmJPM",
    projectId: "wallflash-2f185",
    storageBucket: "wallflash-2f185.firebasestorage.app",
    messagingSenderId: "356851868754", 
    appId: "1:356851868754:android:d846d6ecd3ac07f1546b8b",
  };
  
  // 🔹 Initialize Firebase App & Firestore
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  
  // ✅ Fetch Season Info (title, description, image)
  export const fetchSeasonInfo = async (): Promise<{
    title: string;
    description: string;
    imageUrl: string;
  } | null> => {
    try {
      const snapshot = await getDocs(collection(db, "SeasonData"));
      if (!snapshot.empty) {
        const doc = snapshot.docs[0]; // take first one (or loop if multiple)
        const data = doc.data();
        return {
          title: data.title,
          description: data.description,
          imageUrl: data.imageUrl,
        };
      }
      return null;
    } catch (error) {
      console.error("❌ Error fetching SeasonData:", error);
      return null;
    }
  };
  
  // ✅ Fetch Season Status Videos
  export const fetchSeasonVideos = async (): Promise<string[]> => {
    try {
      const snapshot = await getDocs(collection(db, "SeasonStatus"));
      if (!snapshot.empty) {
        return snapshot.docs.map((doc: DocumentData) => doc.data().url as string);
      }
      return [];
    } catch (error) {
      console.error("❌ Error fetching SeasonStatus:", error);
      return [];
    }
  };
  