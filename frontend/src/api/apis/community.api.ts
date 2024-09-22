import { CommunityCreateDTO } from '../../types';
import { COMMUNITY_ENDPOINT } from '../endpoints';
import { sendRequest } from './request';

export const createCommunity = async (accessToken: string, data: CommunityCreateDTO) => {
	const res = await sendRequest({
		method: 'POST',
		endpoint: COMMUNITY_ENDPOINT,
		accessToken,
		body: data,
	});

	return res;
};
