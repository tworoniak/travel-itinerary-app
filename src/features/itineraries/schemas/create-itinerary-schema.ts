import { z } from 'zod';
import { parseLocalDate } from '@/features/itineraries/utils/date';

export const createItinerarySchema = z
  .object({
    title: z.string().trim().min(2, 'Trip title is required'),
    destination: z.string().trim().min(2, 'Destination is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    travelers: z.coerce.number().min(1, 'At least 1 traveler is required'),
    budget: z.coerce.number().min(0, 'Budget cannot be negative').optional(),
    currency: z.string().trim().min(1).default('USD'),
    coverImage: z
      .string()
      .url('Enter a valid image URL')
      .optional()
      .or(z.literal('')),
    notes: z.string().trim().optional(),
  })
  .refine(
    (data) => parseLocalDate(data.endDate) >= parseLocalDate(data.startDate),
    {
      message: 'End date must be on or after start date',
      path: ['endDate'],
    },
  );

export type CreateItineraryFormValues = z.input<typeof createItinerarySchema>;
export type CreateItineraryValues = z.output<typeof createItinerarySchema>;
