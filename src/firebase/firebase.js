// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getFirestore, 
  collection, 
  doc,
  setDoc,
  getDoc
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCq068vKiPks_x18_rvXcuPOh1HbRQhDmw",
  authDomain: "laura-ef296.firebaseapp.com",
  projectId: "laura-ef296",
  storageBucket: "laura-ef296.firebasestorage.app",
  messagingSenderId: "977965734997",
  appId: "1:977965734997:web:c3c8fb895b9827390608dc",
  measurementId: "G-XZ6WWN387T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export const addCalendarData = async (calendarData) => {
  try {
    const docRef = doc(db, "calendar", "default");
    
    // First get existing data
    const docSnap = await getDoc(docRef);
    let existingData = {};
    
    if (docSnap.exists()) {
      existingData = docSnap.data();
    }

    // Create a key for this month/year
    const monthKey = `${calendarData.year}-${calendarData.month}`;
    
    // Update only this month's data while preserving other months
    await setDoc(docRef, {
      ...existingData,
      [monthKey]: {
        month: calendarData.month,
        year: calendarData.year,
        days: calendarData.days,
        timestamp: new Date()
      }
    });

    console.log('Calendar data exported successfully');
    return true;
  } catch (error) {
    console.error('Error adding calendar data:', error);
    throw error;
  }
};

export const getCalendarData = async (month, year) => {
  try {
    const docRef = doc(db, "calendar", "default");
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const monthKey = `${year}-${month}`;
      const data = docSnap.data();
      
      if (data[monthKey]) {
        return data[monthKey];
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting calendar data:', error);
    throw error;
  }
};

export const resetCalendarData = async () => {
  try {
    const docRef = doc(db, "calendar", "default");
    await setDoc(docRef, {});  // Clear all data
    console.log('Calendar data reset successfully');
    return true;
  } catch (error) {
    console.error('Error resetting calendar data:', error);
    throw error;
  }
};
