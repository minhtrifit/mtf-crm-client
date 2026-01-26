import { useMemo, useState } from 'react';
import { Product } from '@/types/product';

export const useCart = () => {
  const [cartItems, setCartItems] = useState<
    {
      product: Product;
      quantity: number;
    }[]
  >([]);

  const addToCart = (product: Product, qty = 1) => {
    setCartItems((prev) => {
      const existed = prev.find((item) => item.product.id === product.id);

      if (existed) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + qty } : item,
        );
      }

      return [...prev, { product, quantity: qty }];
    });
  };

  const decreaseQuantity = (productId: string, qty = 1) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.product.id === productId ? { ...item, quantity: item.quantity - qty } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item)),
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalQuantity = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );

  const totalPrice = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cartItems],
  );

  return {
    cartItems,
    addToCart,
    decreaseQuantity,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalQuantity,
    totalPrice,
  };
};
