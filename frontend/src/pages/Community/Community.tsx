import { Stack } from '@mui/material';
import { useParams } from 'react-router-dom';
import { CommunityCard, Loading } from '../../components';
import { useGetCommunity } from '../../hooks';
import { CommunityT } from '../../types';

export function Community() {
	const { communityId } = useParams();

	const { data, isLoading } = useGetCommunity(communityId as string);

	if (isLoading) return <Loading />;

	return (
		<Stack gap={2}>
			<CommunityCard community={data as CommunityT} />
		</Stack>
	);
}
