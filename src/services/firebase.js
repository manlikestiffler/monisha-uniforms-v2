// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs, getDoc, doc, query, orderBy, limit, where, addDoc, updateDoc, deleteDoc, setDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Helper function to generate a unique user ID or get existing one
const getUserId = () => {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('userId', userId);
  }
  return userId;
};

// Firebase service functions
const firebaseService = {
  // Get all uniforms
  getAllUniforms: async () => {
    try {
      const uniformsRef = collection(db, "uniforms");
      const uniformsSnapshot = await getDocs(uniformsRef);
      return uniformsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting uniforms:", error);
      throw error;
    }
  },

  // Get recent uniforms
  getRecentUniforms: async (limitCount = 4) => {
    try {
      const uniformsRef = collection(db, "uniforms");
      const q = query(uniformsRef, orderBy("createdAt", "desc"), limit(limitCount));
      const uniformsSnapshot = await getDocs(q);
      return uniformsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting recent uniforms:", error);
      throw error;
    }
  },

  // Get top rated uniforms
  getTopRatedUniforms: async (limitCount = 4) => {
    try {
      const uniformsRef = collection(db, "uniforms");
      // Note: If your uniforms collection doesn't have a rating field,
      // you might need to modify this query
      const q = query(uniformsRef, orderBy("rating", "desc"), limit(limitCount));
      const uniformsSnapshot = await getDocs(q);
      return uniformsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting top rated uniforms:", error);
      // If rating field doesn't exist, fall back to recent uniforms
      return await firebaseService.getRecentUniforms(limitCount);
    }
  },

  // Get uniform by ID
  getUniformById: async (id) => {
    try {
      const uniformRef = doc(db, "uniforms", id);
      const uniformSnapshot = await getDoc(uniformRef);
      
      if (uniformSnapshot.exists()) {
        return {
          id: uniformSnapshot.id,
          ...uniformSnapshot.data()
        };
      } else {
        throw new Error("Uniform not found");
      }
    } catch (error) {
      console.error("Error getting uniform:", error);
      throw error;
    }
  },

  // Get uniforms by category
  getUniformsByCategory: async (category) => {
    try {
      const uniformsRef = collection(db, "uniforms");
      const q = query(uniformsRef, where("category", "==", category));
      const uniformsSnapshot = await getDocs(q);
      return uniformsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting uniforms by category:", error);
      throw error;
    }
  },

  // Get uniforms by school
  getUniformsBySchool: async (schoolId) => {
    try {
      const uniformsRef = collection(db, "uniforms");
      const q = query(uniformsRef, where("school", "==", schoolId));
      const uniformsSnapshot = await getDocs(q);
      return uniformsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting uniforms by school:", error);
      throw error;
    }
  },

  // Get all schools
  getAllSchools: async () => {
    try {
      const schoolsRef = collection(db, "schools");
      const schoolsSnapshot = await getDocs(schoolsRef);
      return schoolsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting schools:", error);
      throw error;
    }
  },

  // Get school by ID
  getSchoolById: async (id) => {
    try {
      const schoolRef = doc(db, "schools", id);
      const schoolSnapshot = await getDoc(schoolRef);
      
      if (schoolSnapshot.exists()) {
        return {
          id: schoolSnapshot.id,
          ...schoolSnapshot.data()
        };
      } else {
        throw new Error("School not found");
      }
    } catch (error) {
      console.error("Error getting school:", error);
      throw error;
    }
  },

  // CART FUNCTIONS
  // Get user's cart
  getCart: async () => {
    try {
      const user = auth.currentUser;
      
      if (!user) {
        // Return localStorage cart if not logged in
        return JSON.parse(localStorage.getItem('cart')) || [];
      }
      
      const cartRef = collection(db, "users", user.uid, "cart");
      const snapshot = await getDocs(cartRef);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting cart:", error);
      return [];
    }
  },

  // Add item to cart
  addToCart: async (cartItem) => {
    try {
      const user = auth.currentUser;
      
      if (!user) {
        // Store in localStorage if not logged in
        const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItemIndex = currentCart.findIndex(
          item => item.id === cartItem.id && item.size === cartItem.size
        );
        
        if (existingItemIndex >= 0) {
          currentCart[existingItemIndex].quantity += 1;
        } else {
          currentCart.push(cartItem);
        }
        
        localStorage.setItem('cart', JSON.stringify(currentCart));
        return true;
      }
      
      // Check if item already exists in cart with same size
      const cartRef = collection(db, "users", user.uid, "cart");
      const q = query(cartRef, where("id", "==", cartItem.id), where("size", "==", cartItem.size));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        // Item already exists, update quantity
        const existingItem = snapshot.docs[0];
        const existingData = existingItem.data();
        
        await updateDoc(doc(db, "users", user.uid, "cart", existingItem.id), {
          quantity: existingData.quantity + 1,
          updatedAt: serverTimestamp()
        });
      } else {
        // Add new item to cart
        await addDoc(cartRef, {
          ...cartItem,
          addedAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      
      return true;
    } catch (error) {
      console.error("Error adding to cart:", error);
      return false;
    }
  },

  // Remove item from cart
  removeFromCart: async (cartItemId) => {
    try {
      const user = auth.currentUser;
      
      if (!user) {
        // Remove from localStorage if not logged in
        const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
        const updatedCart = currentCart.filter(item => item.id !== cartItemId);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        return true;
      }
      
      // Remove from Firestore
      await deleteDoc(doc(db, "users", user.uid, "cart", cartItemId));
      return true;
    } catch (error) {
      console.error("Error removing from cart:", error);
      return false;
    }
  },

  // Update cart item quantity
  updateCartItemQuantity: async (cartItemId, quantity) => {
    try {
      const user = auth.currentUser;
      
      if (!user) {
        // Update in localStorage if not logged in
        const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
        const updatedCart = currentCart.map(item => {
          if (item.id === cartItemId) {
            return { ...item, quantity };
          }
          return item;
        });
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        return true;
      }
      
      // Update in Firestore
      await updateDoc(doc(db, "users", user.uid, "cart", cartItemId), {
        quantity,
        updatedAt: serverTimestamp()
      });
      
      return true;
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
      return false;
    }
  },

  // Check if item is in cart
  isInCart: async (productId) => {
    try {
      const user = auth.currentUser;
      
      if (!user) {
        // Check localStorage if not logged in
        const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
        return currentCart.some(item => item.id === productId);
      }
      
      // Check Firestore
      const cartRef = collection(db, "users", user.uid, "cart");
      const q = query(cartRef, where("id", "==", productId));
      const snapshot = await getDocs(q);
      
      return !snapshot.empty;
    } catch (error) {
      console.error("Error checking if in cart:", error);
      return false;
    }
  },

  // WISHLIST FUNCTIONS
  // Get user's wishlist
  getWishlist: async () => {
    try {
      const user = auth.currentUser;
      
      if (!user) {
        // Return localStorage wishlist if not logged in
        return JSON.parse(localStorage.getItem('wishlist')) || [];
      }
      
      const wishlistRef = collection(db, "users", user.uid, "wishlist");
      const snapshot = await getDocs(wishlistRef);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting wishlist:", error);
      return [];
    }
  },

  // Add item to wishlist
  addToWishlist: async (wishlistItem) => {
    try {
      const user = auth.currentUser;
      
      if (!user) {
        // Store in localStorage if not logged in
        const currentWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        if (!currentWishlist.some(item => item.id === wishlistItem.id)) {
          currentWishlist.push(wishlistItem);
          localStorage.setItem('wishlist', JSON.stringify(currentWishlist));
        }
        return true;
      }
      
      // Check if item already exists in wishlist
      const wishlistRef = collection(db, "users", user.uid, "wishlist");
      const q = query(wishlistRef, where("id", "==", wishlistItem.id));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        // Add new item to wishlist
        await addDoc(wishlistRef, {
          ...wishlistItem,
          addedAt: serverTimestamp()
        });
      }
      
      return true;
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      return false;
    }
  },

  // Remove item from wishlist
  removeFromWishlist: async (productId) => {
    try {
      const user = auth.currentUser;
      
      if (!user) {
        // Remove from localStorage if not logged in
        const currentWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        const updatedWishlist = currentWishlist.filter(item => item.id !== productId);
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
        return true;
      }
      
      // Find and remove item from Firestore
      const wishlistRef = collection(db, "users", user.uid, "wishlist");
      const q = query(wishlistRef, where("id", "==", productId));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        // Delete the first matching document
        await deleteDoc(doc(db, "users", user.uid, "wishlist", snapshot.docs[0].id));
      }
      
      return true;
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      return false;
    }
  },

  // Check if item is in wishlist
  isInWishlist: async (productId) => {
    try {
      const user = auth.currentUser;
      
      if (!user) {
        // Check localStorage if not logged in
        const currentWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        return currentWishlist.some(item => item.id === productId);
      }
      
      // Check Firestore
      const wishlistRef = collection(db, "users", user.uid, "wishlist");
      const q = query(wishlistRef, where("id", "==", productId));
      const snapshot = await getDocs(q);
      
      return !snapshot.empty;
    } catch (error) {
      console.error("Error checking if in wishlist:", error);
      return false;
    }
  },

  // Toggle wishlist (add if not present, remove if present)
  toggleWishlist: async (item) => {
    try {
      const isInWishlist = await firebaseService.isInWishlist(item.id);
      
      if (isInWishlist) {
        return await firebaseService.removeFromWishlist(item.id);
      } else {
        return await firebaseService.addToWishlist(item);
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      return false;
    }
  },

  // Synchronize localStorage with Firestore when user logs in
  syncCartAndWishlist: async () => {
    const user = auth.currentUser;
    
    if (!user) return;
    
    try {
      // Sync cart
      const localCart = JSON.parse(localStorage.getItem('cart')) || [];
      
      if (localCart.length > 0) {
        // Fetch existing cart items to avoid duplicates
        const cartRef = collection(db, "users", user.uid, "cart");
        const cartSnapshot = await getDocs(cartRef);
        const existingCartItems = cartSnapshot.docs.map(doc => ({
          docId: doc.id,
          ...doc.data()
        }));
        
        for (const item of localCart) {
          // Check if item with same ID and size exists
          const existingItem = existingCartItems.find(
            existingItem => existingItem.id === item.id && existingItem.size === item.size
          );
          
          if (existingItem) {
            // Update quantity if item exists
            await updateDoc(doc(db, "users", user.uid, "cart", existingItem.docId), {
              quantity: existingItem.quantity + item.quantity,
              updatedAt: serverTimestamp()
            });
          } else {
            // Add new item
            await addDoc(cartRef, {
              ...item,
              addedAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            });
          }
        }
        // Clear localStorage cart after syncing
        localStorage.removeItem('cart');
      }
      
      // Sync wishlist
      const localWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
      
      if (localWishlist.length > 0) {
        // Fetch existing wishlist items to avoid duplicates
        const wishlistRef = collection(db, "users", user.uid, "wishlist");
        const wishlistSnapshot = await getDocs(wishlistRef);
        const existingWishlistItems = wishlistSnapshot.docs.map(doc => ({
          docId: doc.id,
          ...doc.data()
        }));
        
        for (const item of localWishlist) {
          // Check if item with same ID exists
          const existingItem = existingWishlistItems.find(
            existingItem => existingItem.id === item.id
          );
          
          if (!existingItem) {
            // Add new item only if it doesn't exist
            await addDoc(wishlistRef, {
              ...item,
              addedAt: serverTimestamp()
            });
          }
        }
        // Clear localStorage wishlist after syncing
        localStorage.removeItem('wishlist');
      }
      
      // Dispatch storage event to update UI
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error("Error syncing cart and wishlist:", error);
    }
  }
};

export default firebaseService; 