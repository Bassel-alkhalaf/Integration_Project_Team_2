import { z } from 'zod';
import { CommunityCreateSchema, CommunityUpdateSchema } from '../schemas';

export type CommunityT = {
	id: string;
	name: string;
	description: string;
	userCount: number;
	createdAt: string;
};

export type GetCommunitiesResDTO = CommunityT[];

export type CommunityCreateDTO = z.infer<typeof CommunityCreateSchema>;

export type CommunityUpdateDTO = z.infer<typeof CommunityUpdateSchema>;
