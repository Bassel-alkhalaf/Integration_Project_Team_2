import { Button } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { CreatePostDialog } from '../../components/CreatePostDialogue';
import PostItem from '../../components/PostItem';
import { useAuth } from '../../contexts';

import { useBlockContext } from '../../contexts/useBlockContext';
import { useFetchPrivatePosts } from '../../hooks/apiHooks/post/useFetchPrivateposts';
import { Post } from '../../types/post.type';

export const Home: React.FC = () => {
	const [open, setOpen] = useState(false);

	const { user } = useAuth();
	const authorInfo = useMemo(() => {
		return { authorId: user?.id || '', authorName: `${user?.firstName || ''} ${user?.lastName || ''}` };
	}, [user]);
	const { authorId, authorName } = authorInfo;
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const { blockedUserIds } = useBlockContext();
	const res = useFetchPrivatePosts(user?.id!);
	return (
		<div>
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

			{/* Create Post Button */}
			<div className='actions'>
				<Button variant='contained' color='primary' onClick={handleOpen}>
					Create a Post
				</Button>
			</div>

			{/* Create Post Dialog */}
			<CreatePostDialog
				authorName={authorName} // Replace with dynamic data
				authorId={authorId}
				open={open}
				onClose={handleClose}
			/>
		</div>
	);
};
