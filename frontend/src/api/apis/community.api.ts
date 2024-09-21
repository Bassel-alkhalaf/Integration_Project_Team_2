import { CommunityCreateDTO } from '../../types';
import { COMMUNITY_ENDPOINT } from '../endpoints';
import { sendRequest } from './request';

export const createCommunity = async (userId: string, data: CommunityCreateDTO) => {
	const url = `${COMMUNITY_ENDPOINT}/userId/${userId}`;

	const res = await sendRequest({
		method: 'POST',
		endpoint: url,
		body: data,
	});

	return res;
};
