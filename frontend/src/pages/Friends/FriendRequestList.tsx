import { Chip, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { FriendRequestActionBtn, UserAvatar } from '../../components';
import { FriendRequestT } from '../../types';

interface PropsI {
	friendRequests: FriendRequestT[];
	type: 'sent' | 'received';
}

export function FriendRequestList({ friendRequests, type }: PropsI) {
	const getColor = (status: FriendRequestT['status']) => {
		switch (status) {
			case 'Accepted':
				return 'success';
			case 'Pending':
				return 'primary';
			case 'Rejected':
				return 'error';
			default:
				return 'default';
		}
	};

	return friendRequests.length ? (
		<List disablePadding>
			{friendRequests.map((request, index) => {
				const {
					id,
					user,
					user: { firstName, lastName, email },
					status,
					createdAt,
				} = request;
				const requestDateTime = dayjs(createdAt).format('MMM DD, YYYY h:mm A');
				const secondaryText = type === 'sent' ? `Sent at ${requestDateTime}` : `Received at ${requestDateTime}`;

				return (
					<ListItem
						disablePadding
						key={index}
						secondaryAction={
							<>
								{status === 'Pending' && type === 'sent' && (
									<FriendRequestActionBtn requestId={id} action='cancel' />
								)}
								{status === 'Pending' && type === 'received' && (
									<Stack gap={2} direction='row'>
										<FriendRequestActionBtn requestId={id} action='accept' />
										<FriendRequestActionBtn requestId={id} action='reject' />
									</Stack>
								)}
							</>
						}>
						<ListItemButton
							disabled={status !== 'Pending'}
							disableRipple
							disableTouchRipple
							alignItems='flex-start'>
							<ListItemAvatar>
								<UserAvatar user={user} />
							</ListItemAvatar>
							<ListItemText
								primary={
									<Stack direction='row' gap={2} alignItems='center'>
										<Typography variant='h6'>{`${firstName} ${lastName}`}</Typography>
										<Chip label={status} size='small' color={getColor(status)} />
									</Stack>
								}
								secondary={
									<Stack component={'span'} gap={1}>
										<Typography component='span'>{email}</Typography>
										<Typography component='span' variant='body2'>
											{secondaryText}
										</Typography>
									</Stack>
								}
							/>
						</ListItemButton>
					</ListItem>
				);
			})}
		</List>
	) : (
		<Typography variant='body1' textAlign='center' color='text.secondary'>
			No friend requests {type === 'sent' ? 'sent' : 'received'}.
		</Typography>
	);
}
