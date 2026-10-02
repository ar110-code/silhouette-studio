"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, CartItem } from "@/types";

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, size: string, color: string, quantity?: number) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  itemCount: number;
  subtotal: number;
  discountCode: string;
  setDiscountCode: (code: string) => void;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  toastMessage: string | null;
  setToastMessage: (msg: string | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Load cart from localStorage upon mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = localStorage.getItem("silhouette_cart");
      if (stored) {
        setItems(JSON.parse(stored));
      }
      const storedCoupon = localStorage.getItem("silhouette_coupon");
      if (storedCoupon) {
        setDiscountCode(storedCoupon);
      }
    } catch (e) {
      console.error("Failed to load cart from storage", e);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem("silhouette_cart", JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save cart to storage", e);
    }
  }, [items, isMounted]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const addItem = (product: Product, size: string, color: string, quantity = 1) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === size &&
          item.selectedColor === color
      );

      if (existingIndex > -1) {
        const next = [...prev];
        const newQty = next[existingIndex].quantity + quantity;
        next[existingIndex] = { ...next[existingIndex], quantity: newQty };
        return next;
      } else {
        return [...prev, { product, selectedSize: size, selectedColor: color, quantity }];
      }
    });

    showToast(`«${product.title}» به سبد خرید افزوده شد.`);
    setIsCartOpen(true);
  };

  const removeItem = (productId: string, size: string, color: string) => {
    setItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedSize === size &&
            item.selectedColor === color
          )
      )
    );
  };

  const updateQuantity = (
    productId: string,
    size: string,
    color: string,
    quantity: number
  ) => {
    if (quantity <= 0) {
      removeItem(productId, size, color);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (
          item.product.id === productId &&
          item.selectedSize === size &&
          item.selectedColor === color
        ) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setDiscountCode("");
    localStorage.removeItem("silhouette_cart");
    localStorage.removeItem("silhouette_coupon");
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce((sum, item) => {
    const price = item.product.discountPrice ?? item.product.price;
    return sum + price * item.quantity;
  }, 0);

  let discountAmount = 0;
  if (discountCode) {
    const code = discountCode.trim().toUpperCase();
    if (code === "WELCOME20" || code === "KARLANCER") {
      discountAmount = Math.round(subtotal * 0.2);
    } else if (code === "SILHOUETTE") {
      discountAmount = Math.round(subtotal * 0.15);
    }
  }

  const shippingFee = subtotal > 3000000 || subtotal === 0 ? 0 : 65000;
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === "WELCOME20" || clean === "KARLANCER") {
      setDiscountCode(clean);
      localStorage.setItem("silhouette_coupon", clean);
      return { success: true, message: "کد تخفیف ۲۰٪ ویژه با موفقیت اعمال گردید." };
    }
    if (clean === "SILHOUETTE") {
      setDiscountCode(clean);
      localStorage.setItem("silhouette_coupon", clean);
      return { success: true, message: "کد تخفیف ۱۵٪ عضویت با موفقیت اعمال گردید." };
    }
    return { success: false, message: "کد تخفیف وارد شده معتبر یا فعال نیست." };
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        itemCount,
        subtotal,
        discountCode,
        setDiscountCode,
        discountAmount,
        shippingFee,
        totalAmount,
        applyCoupon,
        toastMessage,
        setToastMessage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}