
import { UserInfoDTO } from '../../types/user.type';
import { USER_ENDPOINT } from '../endpoints';
import { sendRequest } from './request';

export const getUserInfo = async (email: string) => {
	const url = `${USER_ENDPOINT}`;

	const res = await sendRequest({
		method: 'GET',
		endpoint: url,
		body: email
	});

	return res.data as UserInfoDTO;
};

