import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { updateIsStarred } from '../../../api';
import { useGenericErrHandler } from '../../errorHandler/useGenericErrHandler';

export const useUpdateIsStarred = (userId: string, options?: { onSuccess: (data?: unknown) => void }) => {
	const errorHandler = useGenericErrHandler();

	return useMutation({
		mutationFn: async ({
			communityId,
			isStarred,
			onSuccess,
		}: {
			communityId: string;
			isStarred: boolean;
			onSuccess?: (data?: unknown) => void;
		}) => {
			const res = await updateIsStarred(userId, communityId, isStarred);

			if (onSuccess) {
				onSuccess(res.data);
			}
			return res.data;
		},
		onError: err => {
			console.error(err);
			errorHandler(err as AxiosError);
		},
		...options,
	});
};
