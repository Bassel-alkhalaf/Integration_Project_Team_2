import { Button, ListItem, ListItemAvatar, ListItemText, Stack, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useMemo } from 'react';
import { AddFriendBtn, UserAvatar } from '../../components';
import { useAuth } from '../../contexts';
import { useGetFriendRequests, useGetFriendships } from '../../hooks';
import { UserInfoT } from '../../types';

interface PropsI {
	user: UserInfoT;
}

export function UserSearchResultItem({ user }: PropsI) {
	const { accessToken } = useAuth();
	// const navigate = useNavigate();
	const { id, firstName, lastName, email, bio } = user;

	const { data: friends } = useGetFriendships(accessToken as string);
	const isFriend = useMemo(() => friends?.find(f => f.friend.id === id), [friends, id]);

	const { data: requestsReceived } = useGetFriendRequests(accessToken as string, 'received');
	const isRequestReceived = useMemo(
		() => requestsReceived?.find(r => r.user.id === id && r.status === 'Pending'),
		[requestsReceived, id]
	);

	const { data: requestsSent } = useGetFriendRequests(accessToken as string, 'sent');
	const isRequestSent = useMemo(
		() => requestsSent?.find(r => r.user.id === id && r.status === 'Pending'),
		[requestsSent, id]
	);

	const actionBtn = useMemo(() => {
		if (isRequestReceived || isRequestSent) {
			return <Button disabled>Request Pending</Button>;
		} else if (isFriend) {
			return null;
		} else {
			return <AddFriendBtn receiverId={id} />;
		}
	}, [isFriend, isRequestReceived, isRequestSent]);

	return (
		<ListItem
			// onClick={() => navigate(`/user/${id}`)}
			sx={{
				transition: '0.5s',
				'&:hover': { bgcolor: grey[100], cursor: 'pointer' },
			}}
			alignItems='flex-start'
			secondaryAction={actionBtn}>
			{/* userAvatar */}
			<ListItemAvatar>
				<UserAvatar user={user} />
			</ListItemAvatar>

			{/* userInfo */}
			<ListItemText
				primary={
					<Typography variant='h6'>
						{firstName} {lastName}
					</Typography>
				}
				secondary={
					<Stack component={'span'} gap={1}>
						<Typography component='span' variant='body2'>
							{email}
						</Typography>
						<Typography component='span' sx={{ color: 'text.primary' }}>
							{bio || 'No bio available'}
						</Typography>
					</Stack>
				}
			/>
		</ListItem>
	);
}
