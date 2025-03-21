# Monisha Uniforms Firebase Database Schema

## Database Collections

### 1. uniforms
This collection stores all uniform products available in the store.

**Fields:**
- id: String (document ID)
- name: String (name of the uniform)
- price: Number (price of the uniform)
- images: Array<String> (URLs to product images)
- schoolName: String (name of the school the uniform belongs to)
- school: String (reference to school document ID)
- category: String (category of uniform, e.g., "winter", "summer")
- gender: String (e.g., "Boys", "Girls", "Unisex")
- sizes: Array (available sizes for the uniform)
- variants: Array (variants of the uniform, like different colors or styles)
- rating: Number (average rating of the uniform)
- createdAt: Timestamp (when the uniform was added to the database)
- description: String (detailed description of the uniform)
- type: String (type of uniform, e.g., "Shirt", "Pants", "Skirt")

### 2. schools
This collection stores information about schools for which uniforms are available.

**Fields:**
- id: String (document ID)
- name: String (name of the school)
- logo: String (URL to school logo)
- description: String (description of the school)
- address: String (address of the school)
- contact: String (contact information for the school)

### 3. users
This collection stores user information.

**Fields:**
- uid: String (user ID from Firebase Authentication, used as document ID)
- displayName: String (user's full name)
- email: String (user's email address)
- photoURL: String (URL to user's profile photo, if available)
- createdAt: Timestamp (when the user account was created)
- lastLogin: Timestamp (when the user last logged in)

**Subcollections:**

#### 3.1. users/{userId}/cart
Stores items in a user's shopping cart.

**Fields:**
- id: String (document ID)
- productId: String (ID of the product in the uniforms collection)
- name: String (name of the product)
- price: Number (price of the product)
- image: String (URL to product image)
- size: String (selected size)
- quantity: Number (quantity of the product)
- schoolName: String (name of the school)
- addedAt: Timestamp (when the item was added to cart)
- updatedAt: Timestamp (when the item was last updated)

#### 3.2. users/{userId}/wishlist
Stores items in a user's wishlist.

**Fields:**
- id: String (document ID)
- productId: String (ID of the product in the uniforms collection)
- name: String (name of the product)
- price: Number (price of the product)
- image: String (URL to product image)
- addedAt: Timestamp (when the item was added to wishlist)

## Firebase Functions and Integration

### Authentication Functions
- createUserWithEmailAndPassword: Create a new user account
- signInWithEmailAndPassword: Sign in an existing user
- signOut: Sign out the current user
- sendPasswordResetEmail: Send a password reset email to a user
- onAuthStateChanged: Listen for authentication state changes

### Uniform Product Functions
- getAllUniforms: Retrieve all uniforms
- getRecentUniforms: Get recently added uniforms
- getTopRatedUniforms: Get top-rated uniforms
- getUniformById: Get a specific uniform by ID
- getUniformsByCategory: Get uniforms by category
- getUniformsBySchool: Get uniforms for a specific school

### School Functions
- getAllSchools: Retrieve all schools
- getSchoolById: Get a specific school by ID

### Cart Functions
- getCart: Get the current user's cart items
- addToCart: Add an item to the cart
- removeFromCart: Remove an item from the cart
- updateCartItemQuantity: Update the quantity of an item in the cart
- isInCart: Check if a product is in the cart

### Wishlist Functions
- getWishlist: Get the current user's wishlist items
- addToWishlist: Add an item to the wishlist
- removeFromWishlist: Remove an item from the wishlist
- isInWishlist: Check if a product is in the wishlist
- toggleWishlist: Toggle an item in the wishlist (add if not present, remove if present)

### Synchronization Function
- syncCartAndWishlist: Synchronize localStorage cart and wishlist with Firebase when a user logs in

## Auth State Management
The application uses Firebase Authentication for user management. The authentication state is managed through the Layout component, which listens for auth state changes using onAuthStateChanged. When a user logs in, their localStorage cart and wishlist items are synchronized with Firestore.

## Data Persistence Strategy
The application follows a hybrid approach for data persistence:
1. For logged-in users: All cart and wishlist data is stored in Firestore.
2. For non-logged-in users: Data is stored in localStorage.
3. When a user logs in, any items in localStorage are synced to Firestore and then removed from localStorage.

## Implementation Details

### Cart and Wishlist Management
- When a user adds an item to cart/wishlist:
  - If logged in: Item is stored in Firestore
  - If not logged in: Item is stored in localStorage
  
- When a user logs in:
  - Items from localStorage are synced to Firestore
  - localStorage items are cleared
  
- When a user logs out:
  - The app continues to use localStorage for new additions

### Storage Events
The application uses custom storage events to notify components about changes to cart/wishlist:
- When cart/wishlist changes, `window.dispatchEvent(new Event('storage'))` is called
- Components listen for this event and update their state accordingly

## Critical Dependencies
- Firebase Authentication: For user management
- Firestore: For data storage
- Firebase Storage: For storing images

## Firestore Security Rules Recommendations
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read access to product and school data
    match /uniforms/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    match /schools/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Protect user data, allowing only the user to access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /cart/{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      match /wishlist/{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

## Function Implementation Details

### Firebase Service Implementation

The application uses a centralized firebase.js service file to handle all interactions with Firebase. This service provides functions for:

1. **Product Management:**
   - Getting all uniforms
   - Getting uniforms by category/school
   - Getting uniform details

2. **User Cart Management:**
   - Adding items to cart
   - Removing items from cart
   - Updating item quantities
   - Checking if items are in cart

3. **User Wishlist Management:**
   - Adding items to wishlist
   - Removing items from wishlist
   - Checking if items are in wishlist

4. **Authentication:**
   - User sign-up
   - User sign-in
   - User sign-out
   - Password reset

Each function handles both authenticated and unauthenticated states, using Firestore for authenticated users and localStorage for unauthenticated users.

### Cart and Wishlist Synchronization

The syncCartAndWishlist function synchronizes localStorage cart and wishlist items with Firestore when a user logs in:

```javascript
// Pseudocode for syncCartAndWishlist function
function syncCartAndWishlist() {
  if (!currentUser) return;
  
  // Sync cart
  const localCart = getLocalStorageCart();
  for (const item of localCart) {
    addToFirestoreCart(item);
  }
  clearLocalStorageCart();
  
  // Sync wishlist
  const localWishlist = getLocalStorageWishlist();
  for (const item of localWishlist) {
    addToFirestoreWishlist(item);
  }
  clearLocalStorageWishlist();
}
```

### Event Propagation

To ensure all components stay in sync, the application dispatches a custom storage event whenever cart or wishlist data changes:

```javascript
// Pseudocode for event dispatching
function updateCart(item) {
  // Update cart logic
  
  // Notify other components
  window.dispatchEvent(new Event('storage'));
}
```

Components listen for this event and update their state accordingly:

```javascript
// Pseudocode for event listening in components
useEffect(() => {
  // Listen for storage events
  const handleStorageChange = () => {
    // Refresh data
    fetchCart();
  };
  
  window.addEventListener('storage', handleStorageChange);
  return () => window.removeEventListener('storage', handleStorageChange);
}, []);
```
