import { z } from 'zod';

export const SignUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const CreateMoodEntrySchema = z.object({
  entry_date: z.string().date('Invalid date format'),
  entry_time_label: z.string().max(50).optional().or(z.literal('')),
  mood: z.number().int().min(1).max(10),
  anxiety: z.number().int().min(1).max(10),
  energy: z.number().int().min(1).max(10),
  notes: z.string().max(2000).optional().or(z.literal('')),
  triggers: z
    .string()
    .optional()
    .or(z.literal(''))
    .transform((val) =>
      val
        ?.split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0)
        .slice(0, 20) || []
    ),
  helped: z
    .string()
    .optional()
    .or(z.literal(''))
    .transform((val) =>
      val
        ?.split(',')
        .map((h) => h.trim())
        .filter((h) => h.length > 0)
        .slice(0, 20) || []
    ),
  felt_safe: z.boolean().optional().default(false),
});

export const UpdateMoodEntrySchema = CreateMoodEntrySchema.partial();

export const ImportEntriesSchema = z.array(
  z.object({
    id: z.string().uuid().optional(),
    created_at: z.string().datetime().optional(),
    person_name: z.string().default('Blue Hour'),
    entry_date: z.string().date(),
    entry_time_label: z.string().optional().nullable(),
    mood: z.number().int().min(1).max(10),
    anxiety: z.number().int().min(1).max(10),
    energy: z.number().int().min(1).max(10),
    notes: z.string().optional().nullable(),
    triggers: z.array(z.string()).optional().nullable(),
    helped: z.array(z.string()).optional().nullable(),
    felt_safe: z.boolean().default(false),
  })
);

export type SignUp = z.infer<typeof SignUpSchema>;
export type Login = z.infer<typeof LoginSchema>;
export type CreateMoodEntry = z.infer<typeof CreateMoodEntrySchema>;
export type UpdateMoodEntry = z.infer<typeof UpdateMoodEntrySchema>;
export type ImportEntries = z.infer<typeof ImportEntriesSchema>;
