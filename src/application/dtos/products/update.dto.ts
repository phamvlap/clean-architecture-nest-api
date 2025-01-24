import { z } from 'zod';

export const updateProductSchema = z.object({
  title: z.string().nonempty().optional(),
  description: z.string().optional().optional(),
  sku: z.string().nonempty().optional(),
  price: z.number().positive().optional(),
  features: z.array(z.string()).optional().optional(),
  specifications: z.string().nonempty().optional(),
  images: z.array(z.string()).nonempty().optional(),
  warranty: z.string().optional().optional(),
  deliveryInformation: z.string().optional().optional(),
  categoryId: z.string().nonempty().uuid().optional(),
  brandId: z.string().nonempty().uuid().optional(),
});

export type UpdateProductDto = z.infer<typeof updateProductSchema>;
