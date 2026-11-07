import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  deleteUser,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { app, firestoreDb } from "../../lib/firebase/config";
import { arrayUnion } from "firebase/firestore";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default class FirebaseService {
  /* Firebase Auth Methods */

  static async signUp(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async googleSignInUp() {
    try {
      const userCredential = await signInWithPopup(auth, provider);
      return userCredential.user;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async signOut() {
    try {
      await signOut(auth);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async findUserByEmail(email) {
    // Looked up before sign-in, so it reads a minimal public index
    // (email -> auth provider) instead of the private users collection.
    const indexDoc = await firestoreDb
      .collection("emailIndex")
      .doc(String(email).trim().toLowerCase())
      .get();
    if (!indexDoc.exists) {
      return {
        doesEmailExist: false,
        emailType: null,
      };
    }
    return {
      doesEmailExist: true,
      emailType: indexDoc.data().authProvider,
    };
  }

  static async indexEmail(email, authProvider) {
    if (!email) return;
    await firestoreDb
      .collection("emailIndex")
      .doc(String(email).trim().toLowerCase())
      .set({ authProvider });
  }

  /* Review Methods */

  /** @returns {Promise<Array<{id: string, rating: number, comment: string, date: string, reviewerName: string}>>} */
  static async getReviews(productId) {
    const snapshot = await firestoreDb
      .collection("reviews")
      .where("productId", "==", String(productId))
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  /** @returns {Promise<{id: string, rating: number, comment: string, date: string, reviewerName: string}>} */
  static async addReview({ productId, uid, reviewerName, rating, comment }) {
    const review = {
      productId: String(productId),
      uid,
      reviewerName,
      rating,
      comment,
      date: new Date().toISOString(),
    };
    const ref = await firestoreDb.collection("reviews").add(review);
    return { id: ref.id, ...review };
  }

  /* User Profile Methods */

  static async updateUserProfile(updates) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No user is currently signed in");
      await updateProfile(user, updates);
      return user;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async deleteAccount() {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No user is currently signed in");
      await deleteUser(user);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /* Password Methods */

  static async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /* Error Handling Methods */

  static handleError(error) {
    console.error("Auth Error:", error);
    return {
      code: error.code,
      message: error.message,
      userMessage: this.getUserFriendlyMessage(error.code),
    };
  }

  static getUserFriendlyMessage(errorCode) {
    const errorMessages = {
      "auth/user-not-found": "No account found with this email",
      "auth/wrong-password": "Incorrect password",
      "auth/email-already-in-use": "An account already exists with this email",
    };
    return errorMessages[errorCode] || "An error occurred. Please try again.";
  }

  /* Product and Order Methods */

  static async getProductOrderInfo(id) {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    try {
      // Run both queries in parallel using Promise.all
      const [totalOrdersSnapshot, recentOrdersSnapshot] = await Promise.all([
        // Query 1: Get total orders count
        firestoreDb
          .collection("orders")
          .where("products", "array-contains", id)
          .get(),

        // Query 2: Get last month's orders count
        firestoreDb
          .collection("orders")
          .where("products", "array-contains", id)
          .where("orderDate", ">=", oneMonthAgo)
          .get(),
      ]);

      const totalOrderDocs = totalOrdersSnapshot.docs.map((doc) => {
        return {
          ...doc.data(),
          id: doc.id, // This adds the document ID to each document
        };
      });

      const recentOrderDocs = recentOrdersSnapshot.docs.map((doc) => {
        return {
          ...doc.data(),
          id: doc.id, // This adds the document ID to each document
        };
      });

      return {
        totalOrders: totalOrderDocs.length,
        recentOrders: recentOrderDocs.length,
      };
    } catch (error) {
      // Handle index building error gracefully
      if (error.message.includes("requires an index")) {
        console.error("Firestore index is being built. Please wait...");
        return { totalOrders: 0, recentOrders: 0 };
      }
      throw error;
    }
  }

  static async addItemToCart(userId, productId, quantity) {
    // Get current user
    const userRef = firestoreDb.collection("users").doc(userId);
    const userDoc = await userRef.get();

    try {
      if (userDoc.exists) {
        const userData = userDoc.data();
        const cart = userData.cart;

        const existingItemIndex = cart?.findIndex(
          (product) => product.productId === productId
        );

        if (existingItemIndex !== -1) {
          // Item exists - update its quantity
          cart[existingItemIndex].quantity += quantity;

          // Update the entire cart array in Firestore
          await userRef.update({
            cart: cart,
          });

          return true;
        } else {
          // Item doesn't exist - add new item
          await userRef.update({
            cart: arrayUnion({
              productId: productId,
              quantity: quantity,
            }),
          });
          return true;
        }
      } else {
        throw new Error("User Not Found.");
      }
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async removeItemFromCart(userId, productId) {
    // Get current user
    const userRef = firestoreDb.collection("users").doc(userId);
    const userDoc = await userRef.get();

    try {
      if (userDoc.exists) {
        const userData = userDoc.data();
        const cart = userData.cart;

        // Find the item index
        const itemIndex = cart?.findIndex(
          (product) => product.productId === productId
        );

        if (itemIndex !== -1) {
          // Item exists - remove it from cart
          cart[itemIndex].quantity -= 1;
          
          if (cart[itemIndex].quantity == 0) {
            cart.splice(itemIndex, 1); 
          }
          // Update the entire cart array in Firestore
          await userRef.update({
            cart: cart,
          });

          return true;
        } else {
          // Item doesn't exist in cart
          throw new Error("Item not found in cart.");
        }
      } else {
        throw new Error("User Not Found.");
      }
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async addItemToWishlist(userId, productId) {
    // Get current user
    const userRef = firestoreDb.collection("users").doc(userId);
    const userDoc = await userRef.get();

    try {
      if (userDoc.exists) {
        const userData = userDoc.data();
        const wishlist = userData.wishlist;

        const existingItemIndex = wishlist?.findIndex(
          (item) => item === productId
        );

        if (existingItemIndex !== -1) {
          // Item exists - Continue
          return false;
        } else {
          // Item doesn't exist - add new item
          await userRef.update({
            wishlist: arrayUnion(productId),
          });
          return true;
        }
      } else {
        throw new Error("User Not Found.");
      }
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /* Order Methods */

  /**
   * Demo checkout: records the order and empties the cart in one batch.
   * No payment is taken.
   */
  static async placeOrder({ uid, items, total }) {
    const orderRef = firestoreDb.collection("orders").doc();
    const batch = firestoreDb.batch();
    batch.set(orderRef, {
      uid,
      products: items.map((item) => String(item.productId)),
      items,
      total,
      orderDate: new Date(),
    });
    batch.update(firestoreDb.collection("users").doc(uid), { cart: [] });
    await batch.commit();
    return orderRef.id;
  }

  /** @returns {Promise<Array<{id: string, total: number, orderDate: string, items: Array<{productId: string, title: string, price: number, quantity: number, thumbnail: string}>}>>} */
  static async getOrders(uid) {
    const snapshot = await firestoreDb
      .collection("orders")
      .where("uid", "==", uid)
      .get();
    return snapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          total: data.total,
          items: data.items,
          orderDate: data.orderDate?.toDate?.().toISOString() ?? "",
        };
      })
      .sort((a, b) => b.orderDate.localeCompare(a.orderDate));
  }

  /* Account Methods */

  static async deleteAccountAndData() {
    const user = auth.currentUser;
    if (!user) throw new Error("No user is currently signed in");
    // Delete auth first: it can fail (recent login required) and we must not
    // wipe the profile in that case.
    await deleteUser(user);
    await firestoreDb.collection("users").doc(user.uid).delete();
  }
}
