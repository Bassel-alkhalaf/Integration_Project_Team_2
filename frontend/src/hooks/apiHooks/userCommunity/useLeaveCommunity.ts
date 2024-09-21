import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { leaveCommunity } from '../../../api';
import { useGenericErrHandler } from '../../errorHandler/useGenericErrHandler';

export const useLeaveCommunity = (userId: string) => {
	const errorHandler = useGenericErrHandler();

	return useMutation({
		mutationFn: (communityId: string) => leaveCommunity(userId, communityId),
		onError: err => {
			console.error(err);
			errorHandler(err as AxiosError);
		},
	});
};
