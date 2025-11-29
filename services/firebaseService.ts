import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getDatabase, ref, push, set, onValue, Database, DataSnapshot } from 'firebase/database';
import { FIREBASE_CONFIG } from '../constants';
import { Post } from '../types';

let app: FirebaseApp;
let db: Database;

// Initialize Firebase only if config is valid (basic check) and not already initialized
const initFirebase = () => {
  if (getApps().length === 0) {
    // Check if the user has actually updated the placeholder config
    if (FIREBASE_CONFIG.apiKey === "YOUR_API_KEY") {
      console.warn("Firebase config is missing. Posts will not load. Please update constants.ts");
      return null;
    }
    app = initializeApp(FIREBASE_CONFIG);
    db = getDatabase(app);
  } else {
    app = getApps()[0];
    db = getDatabase(app);
  }
  return db;
};

export const subscribeToProps = (callback: (posts: Post[]) => void) => {
  const database = initFirebase();
  if (!database) return () => {};

  const postsRef = ref(database, 'posts');
  
  const unsubscribe = onValue(postsRef, (snapshot: DataSnapshot) => {
    const data = snapshot.val();
    const loadedPosts: Post[] = [];
    
    if (data) {
      Object.keys(data).forEach((key) => {
        loadedPosts.push({
          id: key,
          ...data[key],
        });
      });
    }
    
    // Sort by newest first
    loadedPosts.sort((a, b) => b.timestamp - a.timestamp);
    callback(loadedPosts);
  });

  return unsubscribe; // Return cleanup function
};

export const createPost = async (postData: Omit<Post, 'id'>): Promise<void> => {
  const database = initFirebase();
  if (!database) throw new Error("Firebase not configured");

  const postsRef = ref(database, 'posts');
  const newPostRef = push(postsRef);
  await set(newPostRef, postData);
};
