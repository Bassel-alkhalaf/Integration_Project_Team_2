import { Card, CardContent, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { CommunityT } from '../types';

interface PropsI {
	community: CommunityT;
}

export function CommunityCard({ community }: PropsI) {
	const { id, name, userCount, description, createdAt } = community;

	return (
		<Card
			sx={{ minWidth: 'fit-content', '&:hover': { transform: 'scale(1.05)', transition: '0.3s' } }}
			variant='outlined'>
			<CardContent>
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
		</Card>
	);
}
