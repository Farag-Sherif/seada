import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addToCart, checkout, checkoutGuest, getCart, removeAllFromCart, removeFromCart, updateCartQuantity } from "@/actions/cart";

export function useCartQuery() {
  return useQuery({ queryKey: ["cart"], queryFn: getCart });
}

export function useAddToCartMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, qty, weight }: { itemId: string | number; qty: string | number; weight?: string }) => addToCart(itemId, qty, weight),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });
}

export function useUpdateCartQuantityMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, qty }: { itemId: string | number; qty: string | number }) => updateCartQuantity(itemId, qty),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });
}

export function useRemoveFromCartMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string | number) => removeFromCart(itemId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });
}

export function useClearCartMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeAllFromCart,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });
}

export function useCheckoutMutation() {
  return useMutation({ mutationFn: checkout });
}

export function useGuestCheckoutMutation() {
  return useMutation({ mutationFn: checkoutGuest });
}
