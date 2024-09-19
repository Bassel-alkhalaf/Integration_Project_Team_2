import { Add, ExpandMore, Star, StarBorderOutlined } from '@mui/icons-material';
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Checkbox,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Typography,
} from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetUserCommunities } from '../hooks';
import { useUpdateIsStarred } from '../hooks/apiHooks/userCommunity/useUpdateIsStarred';
import { Loading } from './Loading';

interface PropsI {
	onClickFn: () => void;
}
export function UserCommunityList({ onClickFn }: PropsI) {
	const navigate = useNavigate();

	const { data, refetch, isLoading, isError, isSuccess } = useGetUserCommunities('pdVWPPaFz6M2EFhoyzg5');
	useEffect(() => {
		refetch();
	}, []);

	const { mutate: updateIsStarred } = useUpdateIsStarred('pdVWPPaFz6M2EFhoyzg5');

	if (isLoading) return <Loading />;
	if (isError) return;

	if (isSuccess)
		return (
			<Accordion defaultExpanded disableGutters elevation={0} square>
				<AccordionSummary expandIcon={<ExpandMore />}>
					<Typography>My Communities</Typography>
				</AccordionSummary>

				<AccordionDetails sx={{ p: 0 }}>
					<List disablePadding>
						<ListItem disablePadding>
							<ListItemButton onClick={() => onClickFn}>
								<ListItemIcon>
									<Add />
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
										<Checkbox
											color='warning'
											icon={<StarBorderOutlined />}
											checkedIcon={<Star />}
											defaultChecked={community.isStarred}
											onChange={(e, checked) =>
												updateIsStarred({
													communityId: community.id,
													isStarred: checked,
													onSuccess: () => {
														e.target.checked = checked;
														enqueueSnackbar(
															`${checked ? 'Added' : 'Removed'} star for "${
																community.name
															}"`,
															{
																variant: 'success',
															}
														);
													},
												})
											}
										/>
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
