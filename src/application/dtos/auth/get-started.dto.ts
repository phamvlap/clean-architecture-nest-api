import { z } from 'zod';

export const getStartedSchema = z.object({
  email: z.string().nonempty().email(),
});

export type GetStartedDto = z.infer<typeof getStartedSchema>;
