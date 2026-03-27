import { z } from 'zod';

export const ITEM_TYPES = [
  'attraction',
  'restaurant',
  'hotel',
  'transport',
  'flight',
  'activity',
  'other',
] as const;

export const itemSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  type: z.enum(ITEM_TYPES),
  description: z.string().trim().optional(),
  time: z.string().optional(),
  location: z.string().trim().optional(),
  reservationNumber: z.string().trim().optional(),
  cost: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.coerce.number().min(0, 'Cost cannot be negative').optional(),
  ),
  notes: z.string().trim().optional(),
});

export type ItemSchemaInput = z.input<typeof itemSchema>;
export type ItemSchemaOutput = z.output<typeof itemSchema>;
