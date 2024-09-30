import { LoadingButton } from '@mui/lab';
import { useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { friendRequestQueryKeys } from '../../consts';
import { useAuth } from '../../contexts';
import { useCreateFriendRequest } from '../../hooks';

interface AddFriendsProps {
	receiverId: string;
}

export function AddFriendBtn({ receiverId }: AddFriendsProps) {
	const { accessToken } = useAuth();
	const queryClient = useQueryClient();
	const { mutate: sendFriendRequest, isPending } = useCreateFriendRequest(accessToken as string);

	const handleBtnClick = () => {
		sendFriendRequest(receiverId, {
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: friendRequestQueryKeys.type('sent') });
				enqueueSnackbar('Friend request sent successfully', { variant: 'success' });
			},
			onError: () => enqueueSnackbar('Failed to send friend request', { variant: 'error' }),
		});
	};

	return (
		<LoadingButton loading={isPending} onClick={handleBtnClick} size='small'>
			Add Friend
		</LoadingButton>
	);
}
