// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDHkE3k09XUzW1ONjN914fWgAHRPDTtsms",
  authDomain: "monisha-databse.firebaseapp.com",
  projectId: "monisha-databse",
  storageBucket: "monisha-databse.firebasestorage.app",
  messagingSenderId: "10224835048",
  appId: "1:10224835048:web:41ebdf9453a559c97fec5d",
  measurementId: "G-J8J31DHXBZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to list all collections in Firestore
async function listAllCollections() {
  try {
    console.log("Checking for collections in Firestore...");
    
    // Unfortunately, the client-side Firebase JS SDK doesn't have a direct method to list all collections
    // We need to use the admin SDK for that, which requires server-side Node.js
    // Instead, let's try to access known collections and report their status
    
    // List of collections to check (add more if you know of any)
    const collectionsToCheck = [
      "products",
      "orders",
      "users",
      "schools",
      "categories",
      "inventory",
      "uniforms",
      "customers"
    ];
    
    console.log("Checking for known collections:");
    
    for (const collectionName of collectionsToCheck) {
      try {
        const collectionRef = collection(db, collectionName);
        const snapshot = await getDocs(collectionRef);
        
        if (!snapshot.empty) {
          console.log(`✅ Collection "${collectionName}" exists and contains ${snapshot.size} documents`);
          
          // Get first document as example
          if (snapshot.size > 0) {
            const firstDoc = snapshot.docs[0];
            console.log(`  Sample document ID: ${firstDoc.id}`);
            console.log(`  Sample data: ${JSON.stringify(firstDoc.data(), null, 2).substring(0, 150)}...`);
          }
        } else {
          console.log(`⚠️ Collection "${collectionName}" exists but is empty`);
        }
      } catch (error) {
        console.log(`❌ Collection "${collectionName}" not found or not accessible`);
      }
    }
    
    console.log("\nNote: To get a complete list of all collections, you would need to use the Firebase Admin SDK in a server environment.");
    
  } catch (error) {
    console.error("Error listing collections:", error);
  }
}

// Run the function
listAllCollections()
  .then(() => {
    console.log("Operation completed");
    process.exit(0);
  })
  .catch(error => {
    console.error("Script failed:", error);
    process.exit(1);
  }); 