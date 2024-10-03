import React from 'react';
import PostItem from '../../components/PostItem';
import { useAuth } from '../../contexts';

import { Typography } from '@mui/material';
import { useBlockContext } from '../../contexts/useBlockContext';
import { useFetchPrivatePosts } from '../../hooks/apiHooks/post/useFetchPrivateposts';
import { Post } from '../../types/post.type';

export const Home: React.FC = () => {
	const { user } = useAuth();

	const { blockedUserIds } = useBlockContext();
	const res = useFetchPrivatePosts(user?.id!);
	return (
		<div>
			<Typography variant='h4' sx={{ color: '#3f51b5', fontWeight: 'bold' }}>
				Your Feed
			</Typography>

			<div className='post-list'>
				{!res || res.data?.data.length == 0 ? (
					<div style={{ textAlign: 'center', margin: '20px' }}>
						<p>No posts available. Be the first to create a post!</p>
					</div>
				) : (
					res.data?.data.map((post: Post) => {
						if (blockedUserIds.includes(post.authorId as string)) {
							return null;
						}
						return <PostItem key={post.postId} post={post} user={user} />;
					})
				)}
			</div>
		</div>
	);
};
