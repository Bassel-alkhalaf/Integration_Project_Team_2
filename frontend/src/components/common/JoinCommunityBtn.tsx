import { LoadingButton } from '@mui/lab';
import { Button } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { userCommunityQueryKeys } from '../../consts';
import { useJoinCommunity } from '../../hooks';
import { CommunityT, UserCommunityT } from '../../types';
import { sortUserCommunities } from '../../utils';

interface PropsI {
	community: CommunityT;
	isJoined: boolean;
}

export function JoinCommunityBtn({ community, isJoined }: PropsI) {
	const { id: communityId, name: communityName } = community;

	const queryClient = useQueryClient();
	const { mutate: joinCommunity, isPending } = useJoinCommunity('pdVWPPaFz6M2EFhoyzg5');

	const addUserCommunity = (newCommunity: UserCommunityT) => {
		queryClient.setQueryData<UserCommunityT[]>(userCommunityQueryKeys.all, oldCommunities => {
			if (!oldCommunities) return [newCommunity];
			const updatedCommunities = [...oldCommunities, newCommunity];
			return updatedCommunities.sort(sortUserCommunities);
		});
	};

	const handleClick = () => {
		joinCommunity(communityId, {
			onSuccess: res => {
				queryClient.invalidateQueries({ queryKey: userCommunityQueryKeys.all });
				addUserCommunity(res);
				enqueueSnackbar(`Joined "${communityName}"`, { variant: 'success' });
			},
			onError: error => {
				console.log(error);
				enqueueSnackbar('An error occurred', { variant: 'error' });
			},
		});
	};

	return isJoined ? (
		<Button size='small' disabled>
			Joined
		</Button>
	) : (
		<LoadingButton loading={isPending} size='small' onClick={handleClick}>
			Join
		</LoadingButton>
	);
}
