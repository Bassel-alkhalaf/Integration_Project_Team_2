import { GetUserCommunityResDTO } from '../../types';
import { USER_COMMUNITY_ENDPOINT } from '../endpoints';
import { sendRequest } from './request';

export const getUserCommunities = async (userId: string) => {
	const url = `${USER_COMMUNITY_ENDPOINT}/userId/${userId}`;

	const res = await sendRequest({
		method: 'GET',
		endpoint: url,
	});

	return res.data as GetUserCommunityResDTO;
};

export const joinCommunity = async (userId: string, communityId: string) => {
	const url = `${USER_COMMUNITY_ENDPOINT}/userId/${userId}/communityId/${communityId}`;

	const res = await sendRequest({
		method: 'POST',
		endpoint: url,
	});

	return res;
};

export const leaveCommunity = async (userId: string, communityId: string) => {
	const url = `${USER_COMMUNITY_ENDPOINT}/userId/${userId}/communityId/${communityId}`;

	const res = await sendRequest({
		method: 'DELETE',
		endpoint: url,
	});

	return res;
};

export const updateIsStarred = async (userId: string, communityId: string, isStarred: boolean) => {
	const url = `${USER_COMMUNITY_ENDPOINT}/userId/${userId}/communityId/${communityId}`;

	const res = await sendRequest({
		method: 'PATCH',
		endpoint: url,
		body: { isStarred },
	});

	return res;
};
