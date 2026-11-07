// StoreService.js
const BASE_URL = "https://dummyjson.com";

export const StoreService = {
  getAllProducts: async () => {
    try {
      const response = await fetch(`${BASE_URL}/products?limit=0`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  getProductById: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/products/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  },

  getProductsByCategory: async (category, limit) => {
    try {
      if (!limit) limit = 0;
      const response = await fetch(
        `${BASE_URL}/products/category/${category}?limit=${limit}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching category products:", error);
      throw error;
    }
  },

  getCartProducts: async (cart) => {
    try {
      const response = await fetch(`${BASE_URL}/products?limit=0`);
      const data = await response.json();

      const productMap = new Map(
        data?.products?.map((product) => [product.id, product])
      );

      return cart
        .map((cartItem) => ({
          productData: productMap.get(Number(cartItem.productId)),
          quantity: cartItem.quantity,
        }))
        .filter((item) => item.productData != undefined);
    } catch (error) {
      throw error;
    }
  },

  getWishlistProducts: async (wishlist) => {
    try {
      const response = await fetch(`${BASE_URL}/products?limit=0`);
      const data = await response.json();

      const productMap = new Map(
        data?.products?.map((product) => [product.id, product])
      );

      return wishlist
        .map((item) => ({
          productData: productMap.get(Number(item)),
        }))
        .filter((item) => item.productData != undefined);
    } catch (error) {
      throw error;
    }
  },

  searchProducts: async (query) => {
    try {
      const response = await fetch(`${BASE_URL}/products/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

};
