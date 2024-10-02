import { Box, Button, Card, CardActions, CardContent, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useToggleOpenEl, useUserCommunityRelationship } from '../hooks';
import { CommunityT } from '../types';
import { JoinCommunityBtn, LeaveCommunityBtn, UserCommunityStarBtn } from './common';
import { ReportBtn } from './common/ReportBtn';
import { CommunityInputFormDialog } from './CommunityInputFormDialog';

interface PropsI {
	community: CommunityT;
}

export function CommunityCard({ community }: PropsI) {
	const { isOpen, isMobile, openEl, closeEl } = useToggleOpenEl();
	const { id, name, userCount, description, createdAt } = community;
	const { isJoined, isCreator } = useUserCommunityRelationship(id);

	return (
		<Card
			sx={{
				p: 1,
				backgroundColor: '#f0f4f8',
				position: 'relative',
			}}>
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
						<Button onClick={openEl} variant='contained'>
							Edit
						</Button>
						<CommunityInputFormDialog
							isOpen={isOpen}
							isMobile={isMobile}
							closeEl={closeEl}
							formData={community}
						/>
					</>
				) : isJoined ? (
					<Box display='flex' gap='.5rem'>
						<LeaveCommunityBtn community={community} />
						<ReportBtn type='community' id={id} />
					</Box>
				) : (
					<Box display='flex' gap='.5rem'>
						<JoinCommunityBtn community={community} isJoined={!!isJoined} />
						<ReportBtn type='community' id={id} />
					</Box>
				)}
			</CardActions>
		</Card>
	);
}
