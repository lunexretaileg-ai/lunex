import { z } from 'zod';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

const productVariantSchema = z.object({
  id: z.number(),
  productId: z.number(),
  storage: z.string().nullable(),
  color: z.string().nullable(),
  conditionScore: z.number(),
  batteryHealth: z.number(),
  cosmeticCondition: z.string().nullable(),
  lunexPrice: z.union([z.string(), z.number()]),
  marketPrice: z.union([z.string(), z.number()]),
  stockQuantity: z.number(),
  isAvailable: z.boolean(),
});

const productSpecSchema = z.object({
  id: z.number(),
  productId: z.number(),
  variantId: z.number().nullable(),
  specKey: z.string(),
  specValue: z.string(),
  sortOrder: z.number(),
});

const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  category: z.string(),
  deviceType: z.string(),
  releaseYear: z.number().nullable(),
  description: z.string(),
  imageUrl: z.string(),
  createdAt: z.union([z.string(), z.date()]).nullable(),
});

const productWithVariantsSchema = productSchema.extend({
  variants: z.array(productVariantSchema),
  specs: z.array(productSpecSchema).optional(),
});


export const api = {
  products: {
    list: {
      method: 'GET' as const,
      path: '/api/products' as const,
      input: z.object({
        category: z.string().optional(),
        deviceType: z.string().optional(),
        minCondition: z.coerce.number().optional(),
        minBattery: z.coerce.number().optional(),
        search: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(productWithVariantsSchema),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/products/:slug' as const,
      responses: {
        200: productWithVariantsSchema,
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type ProductsListResponse = z.infer<typeof api.products.list.responses[200]>;
export type ProductResponse = z.infer<typeof api.products.get.responses[200]>;
