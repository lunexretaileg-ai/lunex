import { useQuery } from "@tanstack/react-query";
import { api, buildUrl, type ProductsListResponse, type ProductResponse } from "@shared/routes";
import type { ProductsQueryParams } from "@shared/schema";
import { z } from "zod";

function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw new Error(`Data validation failed for ${label}`);
  }
  return result.data;
}

export function useProducts(params?: ProductsQueryParams) {
  return useQuery({
    queryKey: [api.products.list.path, params],
    queryFn: async () => {
      const url = new URL(api.products.list.path, window.location.origin);
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== "") {
            url.searchParams.append(key, String(value));
          }
        });
      }

      const res = await fetch(url.pathname + url.search, { credentials: "include" });
      if (!res.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await res.json();
      return parseWithLogging<ProductsListResponse>(
        api.products.list.responses[200], 
        data, 
        "products.list"
      );
    },
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: [api.products.get.path, slug],
    queryFn: async () => {
      const url = buildUrl(api.products.get.path, { slug });
      const res = await fetch(url, { credentials: "include" });
      
      if (res.status === 404) return null;
      if (!res.ok) throw new Error('Failed to fetch product details');
      
      const data = await res.json();
      return parseWithLogging<ProductResponse>(
        api.products.get.responses[200], 
        data, 
        "products.get"
      );
    },
    enabled: !!slug,
  });
}
