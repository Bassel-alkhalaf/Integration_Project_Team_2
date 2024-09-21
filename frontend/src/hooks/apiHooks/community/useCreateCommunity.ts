import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { createCommunity } from '../../../api';
import { CommunityCreateDTO } from '../../../types';
import { useGenericErrHandler } from '../../errorHandler/useGenericErrHandler';

export const useCreateCommunity = (userId: string) => {
	const errorHandler = useGenericErrHandler();

	return useMutation({
		mutationFn: (data: CommunityCreateDTO) => createCommunity(userId, data),
		onError: err => {
			console.error(err);
			errorHandler(err as AxiosError);
		},
	});
};
