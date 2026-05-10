import React, { useState, useEffect } from "react";
import Context from "./index";
import { toast } from "react-toastify";
import i18next from "../../components/constant/i18n";

/* ================= helpers ================= */
const tr = (key) => {
  try {
    const v = i18next.t(key);
    return v && v !== key ? v : key;
  } catch {
    return key;
  }
};

/* ================= Storage Helpers ================= */

const canUseStorage = () => typeof window !== "undefined";

const readCart = () => {
  if (!canUseStorage()) return [];
  try {
    const raw = localStorage.getItem("cartList");
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeCart = (items) => {
  if (!canUseStorage()) return;
  try {
    localStorage.setItem("cartList", JSON.stringify(items || []));
  } catch {}
};

/* ================= Utils ================= */

const asNumber = (v, d = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
};

const getId = (it) =>
  it?.id ??
  it?.item_id ??
  it?.product_id ??
  it?.productId ??
  it?.sku ??
  it?.code ??
  it?.slug ??
  it?.uuid ??
  null;

const unitPrice = (item) => {
  const price = asNumber(item?.price, 0);
  const discount = asNumber(item?.discount, 0);
  return +(price - (price * discount) / 100).toFixed(2);
};

const lineTotal = (item, qty) =>
  +(unitPrice(item) * asNumber(qty, 1)).toFixed(2);

/* ================= Provider ================= */

const CartProvider = (props) => {
  const [cartItems, setCartItems] = useState(readCart);
  const [cartTotal, setCartTotal] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [stock, setStock] = useState("InStock");

  /* sync + persist */
  useEffect(() => {
    const total = cartItems.reduce(
      (sum, item) => sum + asNumber(item.total, 0),
      0
    );
    setCartTotal(+total.toFixed(2));
    writeCart(cartItems);
  }, [cartItems]);

  const persist = (next) => {
    setCartItems(Array.isArray(next) ? next : []);
  };

  /* ================= CORE CART ACTIONS ================= */

  const addToCart = (item, qty = 1) => {
    const id = getId(item);

    if (id == null) {
      toast.error(tr("missing_product_id"));
      return;
    }

    const quantity = Math.max(1, asNumber(qty, 1));
    const index = cartItems.findIndex((x) => getId(x) === id);

    if (index !== -1) {
      const updated = [...cartItems];
      updated[index] = {
        ...updated[index],
        ...item,
        qty: quantity,
        total: lineTotal(item, quantity),
      };
      persist(updated);
    } else {
      persist([
        ...cartItems,
        {
          ...item,
          qty: quantity,
          total: lineTotal(item, quantity),
        },
      ]);
    }

    toast.success(tr("product_added_successfully"));
  };

  const addToCartUnified = (item, maybeQty) => {
    const qty =
      maybeQty !== undefined
        ? Math.max(1, asNumber(maybeQty, 1))
        : Math.max(1, asNumber(item?.qty, 1) || 1);
    addToCart(item, qty);
  };

  const removeFromCart = (item) => {
    const id = getId(item);
    persist(cartItems.filter((x) => getId(x) !== id));
    toast.error(tr("product_removed_successfully"));
  };

  const updateQty = (item, qty) => {
    const quantity = Math.max(1, asNumber(qty, 1));
    const id = getId(item);
    const index = cartItems.findIndex((x) => getId(x) === id);

    if (index !== -1) {
      const updated = [...cartItems];
      const merged = { ...updated[index], ...item };
      updated[index] = {
        ...merged,
        qty: quantity,
        total: lineTotal(merged, quantity),
      };
      persist(updated);
      toast.info(tr("product_qty_updated"));
    } else {
      persist([
        ...cartItems,
        {
          ...item,
          qty: quantity,
          total: lineTotal(item, quantity),
        },
      ]);
      toast.success(tr("product_added_successfully"));
    }
  };

  /* ================= UI Helpers ================= */

  const minusQty = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      setStock("InStock");
    }
  };

  const plusQty = (item) => {
    if (!item?.stock || item.stock >= quantity + 1) {
      setQuantity(quantity + 1);
    } else {
      setStock("Out of Stock!");
    }
  };

  /* ================= Extra Helpers ================= */

  const clearCart = () => {
    persist([]);
    try {
      localStorage.removeItem("cartList");
    } catch {}
  };

  const setState = (next) => persist(next);

  /* ================= PROVIDER ================= */

  return (
    <Context.Provider
      value={{
        ...props,
        state: cartItems,
        cartTotal,
        quantity,
        setQuantity,
        stock,

        addToCart,
        addToCartUnified,
        removeFromCart,
        updateQty,

        plusQty,
        minusQty,

        clearCart,
        setState,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export default CartProvider;