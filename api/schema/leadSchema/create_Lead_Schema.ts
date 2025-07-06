import { z } from 'zod';

export const createLeadSchema = z.object({
  id: z.string(),
  success: z.boolean(),
  errors: z.array(z.any()) 
});
