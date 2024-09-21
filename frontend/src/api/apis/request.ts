import axios from 'axios';
import { envConfig } from '../../config';

type RequestOptionsT = {
	endpoint: string;
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	headers?: { [key: string]: string };
	body?: unknown;
};

export const sendRequest = async ({ endpoint, method = 'GET', headers, body }: RequestOptionsT) => {
	const url = `${envConfig.BASE_API}/${endpoint}`;

	try {
		const config = {
			headers,
		};

		switch (method) {
			case 'POST':
				return await axios.post(url, body, config);
			case 'PUT':
				return await axios.put(url, body, config);
			case 'PATCH':
				return await axios.patch(url, body, config);
			case 'DELETE':
				return await axios.delete(url, config);
			default: // 'GET'
				return await axios.get(url, config);
		}
	} catch (error) {
		console.error('Request failed:', error);
		throw error;
	}
};