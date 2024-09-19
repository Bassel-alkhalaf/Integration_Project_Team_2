import { Add as AddIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Alert,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Typography,
} from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetUserCommunities } from '../hooks';
import { Loading, UserCommunityStarBtn } from './common';

interface PropsI {
	onClickFn: () => void;
}
export function UserCommunityList({ onClickFn }: PropsI) {
	const navigate = useNavigate();

	const { data, refetch, isLoading, isError, isSuccess } = useGetUserCommunities('pdVWPPaFz6M2EFhoyzg5');
	useEffect(() => {
		refetch();
	}, []);

	if (isLoading) return <Loading />;

	if (isError) return <Alert severity='error'>An error occurred.</Alert>;

	if (isSuccess)
		return (
			<Accordion defaultExpanded disableGutters elevation={0} square>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
					<Typography>My Communities</Typography>
				</AccordionSummary>

				<AccordionDetails sx={{ p: 0 }}>
					<List disablePadding>
						<ListItem disablePadding>
							<ListItemButton onClick={() => onClickFn}>
								<ListItemIcon>
									<AddIcon />
								</ListItemIcon>

								<ListItemText primary={'Create a community'} />
							</ListItemButton>
						</ListItem>

						{data.map((community, index) => (
							<ListItem key={index} disablePadding>
								<ListItemButton
									onClick={() => {
										onClickFn();
										navigate(`/community/${community.id}`);
									}}>
									<ListItemIcon onClick={e => e.stopPropagation()}>
										<UserCommunityStarBtn community={community} />
									</ListItemIcon>

									<ListItemText primary={community.name} />
								</ListItemButton>
							</ListItem>
						))}
					</List>
				</AccordionDetails>
			</Accordion>
		);
}
