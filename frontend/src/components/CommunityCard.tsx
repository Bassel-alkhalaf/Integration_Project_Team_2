import { Card, CardActions, CardContent, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { userCommunityQueryKeys } from '../consts';
import { CommunityT, UserCommunityT } from '../types';
import { JoinCommunityBtn, LeaveCommunityBtn, UserCommunityStarBtn } from './common';

interface PropsI {
	community: CommunityT;
}

export function CommunityCard({ community }: PropsI) {
	const { id, name, userCount, description, createdAt } = community;

	const { data: joinedCommunities } = useQuery<UserCommunityT[]>({ queryKey: userCommunityQueryKeys.all });
	const isJoined = useMemo(() => joinedCommunities?.find(c => c.id === id), [joinedCommunities]);

	return (
		<Card
			sx={{
				position: 'relative',
				minWidth: 'fit-content',
				'&:hover': { transform: 'scale(1.02)', transition: '0.3s' },
			}}
			variant='outlined'>
			<CardContent>
				{isJoined && (
					<Stack sx={{ position: 'absolute', right: 6, top: 6 }}>
						<UserCommunityStarBtn community={isJoined} />
					</Stack>
				)}

				<Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
					Since {dayjs(createdAt).format('MM/DD/YYYY')}
				</Typography>
				<Typography variant='h5' component='div'>
					{name}
				</Typography>
				<Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
					{userCount} {userCount > 1 ? 'members' : 'member'}
				</Typography>
				<Typography variant='body2'>{description}</Typography>
			</CardContent>
			<CardActions>
				<JoinCommunityBtn community={community} isJoined={!!isJoined} />
				<LeaveCommunityBtn community={community} isJoined={!!isJoined} />
			</CardActions>
		</Card>
	);
}
