import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { updateIsStarred } from '../../../api';
import { useGenericErrHandler } from '../../errorHandler/useGenericErrHandler';

export const useUpdateIsStarred = (userId: string) => {
	const errorHandler = useGenericErrHandler();

	return useMutation({
		mutationFn: ({ communityId, isStarred }: { communityId: string; isStarred: boolean }) =>
			updateIsStarred(userId, communityId, isStarred),
		onError: err => {
			console.error(err);
			errorHandler(err as AxiosError);
		},
	});
};
