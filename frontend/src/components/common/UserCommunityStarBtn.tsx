import { Star, StarBorderOutlined } from '@mui/icons-material';
import { Checkbox } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useUpdateIsStarred } from '../../hooks';
import { UserCommunityT } from '../../types';

interface PropsI {
	community: UserCommunityT;
}

export function UserCommunityStarBtn({ community }: PropsI) {
	const { mutate: updateIsStarred } = useUpdateIsStarred('pdVWPPaFz6M2EFhoyzg5');

	return (
		<Checkbox
			color='warning'
			icon={<StarBorderOutlined />}
			checkedIcon={<Star />}
			defaultChecked={community.isStarred}
			onChange={(e, checked) =>
				updateIsStarred({
					communityId: community.id,
					isStarred: checked,
					onSuccess: () => {
						e.target.checked = checked;
						enqueueSnackbar(`${checked ? 'Added' : 'Removed'} star for "${community.name}"`, {
							variant: 'success',
						});
					},
				})
			}
		/>
	);
}
