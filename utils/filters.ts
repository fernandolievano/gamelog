import { z } from 'zod';

export const gameFiltersSchema = z.object({
  q: z.string().optional(),
});

export type GameFiltersParams = z.infer<typeof gameFiltersSchema>;
