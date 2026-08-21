"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export interface CartItem {
  productId: string;
  slug: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

interface StoredCart {
  items: CartItem[];
  version: string;
  timestamp: number;
}

export interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CART_STORAGE_KEY = "vigoleis-cart";
const CART_VERSION = "1";

const CartContext = createContext<CartContextValue | null>(null);

function parseCart(value: string | null): CartItem[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as Partial<StoredCart>;
    if (
      parsed &&
      Array.isArray(parsed.items) &&
      typeof parsed.version === "string"
    ) {
      return parsed.items.filter(
        (item): item is CartItem =>
          Boolean(
            item &&
              typeof item.productId === "string" &&
              typeof item.title === "string" &&
              typeof item.price === "number" &&
              typeof item.quantity === "number",
          ),
      );
    }
  } catch {
    // ignore malformed entries
  }
  return [];
}

function writeCart(items: CartItem[]) {
  const record: StoredCart = {
    items,
    version: CART_VERSION,
    timestamp: Date.now(),
  };
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(record));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  // When the cart is hydrated from storage (initial load or a cross-tab
  // `storage` event), we skip the next persist so we don't immediately
  // rewrite the same data and ping-pong between tabs.
  const skipPersist = useRef(false);

  useEffect(() => {
    setItems(parseCart(window.localStorage.getItem(CART_STORAGE_KEY)));
    skipPersist.current = true;
    setLoaded(true);

    const handleStorage = (event: StorageEvent) => {
      if (event.key === CART_STORAGE_KEY) {
        skipPersist.current = true;
        setItems(parseCart(event.newValue));
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    if (skipPersist.current) {
      skipPersist.current = false;
      return;
    }
    writeCart(items);
  }, [items, loaded]);

  const addItem = useCallback<CartContextValue["addItem"]>((item, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        );
      }
      return [...prev, { ...item, quantity }];
    });
  }, []);

  const removeItem = useCallback<CartContextValue["removeItem"]>((productId) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const updateQuantity = useCallback<CartContextValue["updateQuantity"]>(
    (productId, quantity) => {
      setItems((prev) => {
        if (quantity <= 0) {
          return prev.filter((i) => i.productId !== productId);
        }
        return prev.map((i) =>
          i.productId === productId ? { ...i, quantity } : i,
        );
      });
    },
    [],
  );

  const clearCart = useCallback<CartContextValue["clearCart"]>(() => {
    setItems([]);
  }, []);

  const count = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items],
  );
  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items],
  );

  const value = useMemo<CartContextValue>(
    () => ({ items, count, subtotal, addItem, removeItem, updateQuantity, clearCart }),
    [items, count, subtotal, addItem, removeItem, updateQuantity, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
