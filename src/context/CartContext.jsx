import { useEffect, useMemo, useState } from 'react';
import { CartContext } from './cartCore';
import { getCartItemPrice } from './cartUtils';
import { products } from '../pages/customer/productData';

const CART_STORAGE_KEY = 'inframart_cart';

const normalizeCartItem = (item) => {
  const product = products.find((productItem) => productItem.id === item?.id);
  const quantity = Math.max(1, Number(item?.quantity) || 1);

  return {
    ...(product || {}),
    ...item,
    ...(product || {}),
    quantity,
  };
};

const readStoredCart = () => {
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    const parsedCart = storedCart ? JSON.parse(storedCart) : [];
    return Array.isArray(parsedCart) ? parsedCart.map(normalizeCartItem).filter((item) => item.id) : [];
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(readStoredCart);
  const normalizedCartItems = useMemo(() => cartItems.map(normalizeCartItem), [cartItems]);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(normalizedCartItems));
  }, [normalizedCartItems]);

  const addToCart = (product, quantity = 1) => {
    if (!product?.id) {
      return;
    }

    const quantityToAdd = Math.max(1, Number(quantity) || 1);

    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id ? normalizeCartItem({ ...item, ...product, quantity: item.quantity + quantityToAdd }) : item
        );
      }

      return [
        ...currentItems,
        normalizeCartItem({
          ...product,
          quantity: quantityToAdd,
        }),
      ];
    });
  };

  const increaseQuantity = (productId) => {
    setCartItems((currentItems) =>
      currentItems.map((item) => (item.id === productId ? normalizeCartItem({ ...item, quantity: item.quantity + 1 }) : item))
    );
  };

  const decreaseQuantity = (productId) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId ? normalizeCartItem({ ...item, quantity: Math.max(1, item.quantity - 1) }) : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((currentItems) => currentItems.filter((item) => item.id !== productId));
  };

  const clearCart = () => setCartItems([]);

  const cartSummary = useMemo(() => {
    const subtotal = normalizedCartItems.reduce((total, item) => total + getCartItemPrice(item) * item.quantity, 0);
    const discount = 0;
    const deliveryCharge = subtotal > 0 && subtotal < 5000 ? 250 : 0;
    const grandTotal = subtotal + deliveryCharge - discount;
    const cartCount = normalizedCartItems.length;

    return {
      cartCount,
      deliveryCharge,
      discount,
      grandTotal,
      subtotal,
    };
  }, [normalizedCartItems]);

  const value = useMemo(
    () => ({
      addToCart,
      cartItems: normalizedCartItems,
      clearCart,
      decreaseQuantity,
      increaseQuantity,
      removeFromCart,
      ...cartSummary,
    }),
    [normalizedCartItems, cartSummary]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
