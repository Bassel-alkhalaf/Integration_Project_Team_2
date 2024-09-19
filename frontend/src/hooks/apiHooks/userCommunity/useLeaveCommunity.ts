import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { leaveCommunity } from '../../../api';
import { useGenericErrHandler } from '../../errorHandler/useGenericErrHandler';

export const useLeaveCommunity = (
	userId: string,
	communityId: string,
	options?: { onSuccess: (data?: unknown) => void }
) => {
	const errorHandler = useGenericErrHandler();
	return useMutation({
		mutationFn: () => leaveCommunity(userId, communityId),
		onError: err => {
			console.error(err);
			errorHandler(err as AxiosError);
		},
		...options,
	});
};
