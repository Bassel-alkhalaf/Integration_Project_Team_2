import { ExpandLess as ExpandLessIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import {
	Alert,
	CircularProgress,
	Collapse,
	Divider,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { useGetUserCommunities, useToggleOpenEl } from '../hooks';
import { CreateCommunityDialog } from './CreateCommunityDialog';
import { UserCommunityItem } from './UserCommunityItem';

export function UserCommunityList() {
	const { isOpen, toggleEl } = useToggleOpenEl(true);

	const { data, isLoading, isError } = useGetUserCommunities('pdVWPPaFz6M2EFhoyzg5');

	const renderList = () => {
		if (isLoading)
			return (
				<ListItem sx={{ display: 'flex', justifyContent: 'center', pb: 2 }}>
					<CircularProgress size={25} />
				</ListItem>
			);

		if (isError) return <Alert severity='error'>An error occurred.</Alert>;

		return data?.map((community, index) => <UserCommunityItem key={index} community={community} />);
	};

	return (
		<List disablePadding>
			<Divider />

			<ListItem disablePadding sx={{ backgroundColor: grey[200] }}>
				<ListItemButton onClick={toggleEl} sx={{ height: '56px' }}>
					<ListItemText primary='My Communities' />
					{isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
				</ListItemButton>
			</ListItem>

			<Collapse in={isOpen} unmountOnExit>
				<List>
					<CreateCommunityDialog />

					{renderList()}
				</List>
			</Collapse>

			<Divider />
		</List>
	);
}
