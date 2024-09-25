import { GetCommunitiesResDTO, UserInfoDTO } from '../../types';
import { SEARCH_ENDPOINT } from '../endpoints';
import { sendRequest } from './request';

export const searchCommunities = async (query: string) => {
	const url = `${SEARCH_ENDPOINT}/communities?q=${query}`;

	const res = await sendRequest({
		method: 'GET',
		endpoint: url,
	});

	return res.data as GetCommunitiesResDTO;
};

export const searchUsers = async (query: string) => {
	const url = `${SEARCH_ENDPOINT}/users?q=${query}`;

	const res = await sendRequest({
		method: 'GET',
		endpoint: url,
	});

	return res.data as UserInfoDTO[];
};
