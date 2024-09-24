import { Button, Card, CardActions, CardContent, Stack, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useToggleOpenEl, useUserCommunityRelationship } from '../hooks';
import { CommunityT } from '../types';
import { JoinCommunityBtn, LeaveCommunityBtn, UserCommunityStarBtn } from './common';
import { CommunityInputFormDialog } from './CommunityInputFormDialog';

interface PropsI {
	community: CommunityT;
}

export function CommunityCard({ community }: PropsI) {
	const navigate = useNavigate();
	const { isOpen, isMobile, openEl, closeEl } = useToggleOpenEl();
	const { id, name, userCount, description, createdAt } = community;
	const { isJoined, isCreator } = useUserCommunityRelationship(id);

	return (
		<Card
			onClick={() => navigate(`/community/${id}`)}
			sx={{
				position: 'relative',
				minWidth: 'fit-content',
				transition: '0.5s',
				'&:hover': { bgcolor: grey[100], cursor: 'pointer' },
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
				{isCreator ? (
					<>
						<Button onClick={openEl}>Edit</Button>
						<CommunityInputFormDialog
							isOpen={isOpen}
							isMobile={isMobile}
							closeEl={closeEl}
							formData={community}
						/>
					</>
				) : isJoined ? (
					<LeaveCommunityBtn community={community} />
				) : (
					<JoinCommunityBtn community={community} isJoined={!!isJoined} />
				)}
			</CardActions>
		</Card>
	);
}
