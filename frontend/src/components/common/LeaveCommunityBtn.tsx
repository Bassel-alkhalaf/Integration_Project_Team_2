import { LoadingButton } from '@mui/lab';
import { useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { userCommunityQueryKeys } from '../../consts';
import { useLeaveCommunity } from '../../hooks';
import { CommunityT, UserCommunityT } from '../../types';

interface PropsI {
	community: CommunityT;
	isJoined: boolean;
}

export function LeaveCommunityBtn({ community, isJoined }: PropsI) {
	const { id: communityId, name: communityName } = community;

	const queryClient = useQueryClient();
	const { mutate: leaveCommunity, isPending } = useLeaveCommunity('pdVWPPaFz6M2EFhoyzg5');

	const removeUserCommunity = (communityId: string) => {
		queryClient.setQueryData<UserCommunityT[]>(userCommunityQueryKeys.all, oldCommunities => {
			if (!oldCommunities) return [];
			return oldCommunities.filter(community => community.id !== communityId);
		});
	};

	const handleClick = () => {
		leaveCommunity(communityId, {
			onSuccess: () => {
				queryClient.invalidateQueries();
				removeUserCommunity(communityId);
				enqueueSnackbar(`Left "${communityName}"`, { variant: 'success' });
			},
			onError: error => {
				console.log(error);
				enqueueSnackbar('An error occurred', { variant: 'error' });
			},
		});
	};

	return (
		<LoadingButton
			loading={isPending}
			size='small'
			onClick={handleClick}
			color='error'
			sx={{ display: isJoined ? 'block' : 'none' }}>
			Leave
		</LoadingButton>
	);
}
