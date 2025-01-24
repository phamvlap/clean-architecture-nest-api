import { z } from 'zod';

export const filterProductSchema = z.object({
  page: z
    .string()
    .transform((value) => +value)
    .pipe(z.number().int().positive().min(1))
    .optional(),
  limit: z
    .string()
    .transform((value) => +value)
    .pipe(z.number().int().positive())
    .optional(),
  noPagination: z
    .enum(['true', 'false'])
    .default('true')
    .transform((value) => value === 'true'),
  search: z.string().optional(),
  filter: z
    .string()
    .transform((value) => JSON.parse(value))
    .pipe(
      z.array(
        z.object({
          field: z.enum(['category', 'brand']),
          value: z.string(),
        }),
      ),
    )
    .optional(),
  sort: z
    .string()
    .transform((value) => JSON.parse(value))
    .pipe(
      z.array(
        z.object({
          field: z.enum(['title', 'price']),
          value: z.enum(['asc', 'desc']),
        }),
      ),
    )
    .optional(),
});

export type FilterProductDto = z.infer<typeof filterProductSchema>;
