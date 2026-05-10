import { useQuery } from "@tanstack/react-query";
import { getFavorites, getProduct, getProducts, searchProducts } from "@/actions/products";

export function useProductsQuery(params: Record<string, any>) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
  });
}

export function useProductQuery(id?: string | number) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(id),
    enabled: Boolean(id),
  });
}

export function useFavoritesQuery() {
  return useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
  });
}

export function useProductSearchQuery(name?: string) {
  return useQuery({
    queryKey: ["products", "search", name],
    queryFn: () => searchProducts(name || ""),
    enabled: Boolean(name),
  });
}
