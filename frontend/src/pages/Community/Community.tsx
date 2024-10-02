import { Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { CommunityCard, Loading } from '../../components';
import PostItem from '../../components/PostItem';
import { useAuth } from '../../contexts';
import { useFetchPostsByCommunity, useGetCommunity } from '../../hooks';
import { CommunityT } from '../../types';

export function Community() {
	const { communityId } = useParams<{ communityId: string }>();
	const { user: currentUser } = useAuth();
	const { data: posts, isLoading: isPostLoading } = useFetchPostsByCommunity(communityId as string);

	const { data, isLoading } = useGetCommunity(communityId as string);

	if (isLoading || isPostLoading) return <Loading />;

	return (
		<Stack gap={2}>
			<CommunityCard community={data as CommunityT} />

			<Stack>
				{posts && posts.length > 0 ? (
					posts.map((post, index) => <PostItem key={index} post={post} user={currentUser} />)
				) : (
					<Typography variant='body1' textAlign='center' color='text.secondary'>
						No posts yet.
					</Typography>
				)}
			</Stack>
		</Stack>
	);
}
