import { z } from 'zod';

export const CommunityUpdateSchema = z.object({
	description: z.string().default('').optional(),
});

export const CommunityCreateSchema = CommunityUpdateSchema.extend({
	name: z
		.string()
		.min(1, { message: 'Community name is required' })
		.max(20, { message: 'Community name cannot exceed 20 characters' }),
});
