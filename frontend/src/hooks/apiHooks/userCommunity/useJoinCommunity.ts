import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { joinCommunity } from '../../../api';
import { useGenericErrHandler } from '../../errorHandler/useGenericErrHandler';

export const useJoinCommunity = (
	userId: string,
	communityId: string,
	options?: { onSuccess: (data?: unknown) => void }
) => {
	const errorHandler = useGenericErrHandler();

	return useMutation({
		mutationFn: () => joinCommunity(userId, communityId),
		onError: err => {
			console.error(err);
			errorHandler(err as AxiosError);
		},
		...options,
	});
};
