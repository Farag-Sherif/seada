import { useContext, useCallback } from "react";
import CartContext from "../../helpers/cart";
import { addToCart as addToCartAction } from "../../actions/cart";

export const useCartActions = () => {
  const cartCtx = useContext(CartContext);
  const quantity = Number(cartCtx?.quantity || 1);

  const addToCartUnified = useCallback(
    async (product) => {
      const weight = product?.raw?.weight || "";
      try {
        await addToCartAction(product.id, quantity, weight); // backend/cart cookie
      } catch (e) {
        console.error("addToCartAction failed:", e);
      }
      try {
        cartCtx?.addToCart?.(product, quantity); // local UI
        cartCtx?.refetch?.();
      } catch (e) {
        console.error("cart context update failed:", e);
      }
    },
    [cartCtx, quantity]
  );

  return { addToCartUnified, quantity };
};
