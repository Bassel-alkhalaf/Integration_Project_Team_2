import { Star, StarBorderOutlined } from '@mui/icons-material';
import { Checkbox } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { userCommunityQueryKeys } from '../../consts';
import { useUpdateIsStarred } from '../../hooks';
import { UserCommunityT } from '../../types';
import { sortUserCommunities } from '../../utils';

interface PropsI {
	community: UserCommunityT;
}

export function UserCommunityStarBtn({ community }: PropsI) {
	const { mutate: updateIsStarred } = useUpdateIsStarred('pdVWPPaFz6M2EFhoyzg5');
	const queryClient = useQueryClient();

	const updateUserCommunity = (checked: boolean) => {
		queryClient.setQueryData<UserCommunityT[]>(userCommunityQueryKeys.all, oldCommunities => {
			if (!oldCommunities) return [community];
			const updatedCommunities = oldCommunities.map(c =>
				c.id === community.id ? { ...community, isStarred: checked } : c
			);
			return updatedCommunities.sort(sortUserCommunities);
		});
	};

	return (
		<Checkbox
			color='warning'
			icon={<StarBorderOutlined />}
			checkedIcon={<Star />}
			checked={community.isStarred}
			onClick={e => e.stopPropagation()}
			onChange={(_e, checked) =>
				updateIsStarred(
					{
						communityId: community.id,
						isStarred: checked,
					},
					{
						onSuccess: () => {
							queryClient.invalidateQueries({ queryKey: userCommunityQueryKeys.all });
							updateUserCommunity(checked);
							enqueueSnackbar(`${checked ? 'Added' : 'Removed'} star for "${community.name}"`, {
								variant: 'success',
							});
						},
					}
				)
			}
		/>
	);
}
