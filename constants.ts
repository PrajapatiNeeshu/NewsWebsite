import { Category } from './types';

// Provided ImgBB API Key
export const IMGBB_API_KEY = '9bbbb7c2154070ea27cc345fc5a1a7ad';

// Placeholder Firebase Config - User must replace these with their own project details
// In a real production app, these should be environment variables.
export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDXG2B2Y88pvW6dCsvZU5naVS90S-75nTE",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef1234567890abcdef"
};

export const NAV_ITEMS = [
  Category.HOME,
  Category.NEWS,
  Category.FASHION,
  Category.GADGETS,
  Category.LIFESTYLE,
  Category.VIDEO
];
