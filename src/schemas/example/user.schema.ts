import { z } from 'zod';

/**
 * INPUT SCHEMAS (For Validation)
 * These define what the user sends to the API
 */
export const createUserSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const updateUserSchema = z.object({
    name: z.string().min(1).max(100).optional(),
    email: z.string().email('Invalid email format').optional(),
    password: z.string().min(6, 'Password must be at least 6 characters long').optional(),
});

// TypeScript types inferred from the schemas above
export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;

/**
 * OUTPUT TYPES
 * This is what we send back to the user (no passwords!)
 */
export interface UserProfile {
    id: string | number;
    name: string;
    email: string;
    created_at: string | Date;
    updated_at: string | Date;
}
