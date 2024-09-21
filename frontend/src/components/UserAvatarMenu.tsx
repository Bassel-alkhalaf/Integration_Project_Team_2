import { Box, IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';
import { useAuth } from '../contexts';
import { UserAvatar } from './UserAvatar';

export function UserAvatarMenu() {
	const { auth, logout } = useAuth();

	const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	return (
		auth && (
			<Box sx={{ flexGrow: 0 }}>
				<Tooltip title={auth.user.username}>
					<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
						<UserAvatar user={auth.user} />
					</IconButton>
				</Tooltip>
				<Menu
					disableScrollLock={true}
					sx={{ mt: '45px' }}
					anchorEl={anchorElUser}
					anchorOrigin={{
						vertical: 'top',
						horizontal: 'right',
					}}
					keepMounted
					transformOrigin={{
						vertical: 'top',
						horizontal: 'right',
					}}
					open={Boolean(anchorElUser)}
					onClose={handleCloseUserMenu}>
					{/* <MenuItem
						onClick={() => {
							handleCloseUserMenu();
							navigate('/user');
						}}>
						<Typography>User Space</Typography>
					</MenuItem>
					<MenuItem
						onClick={() => {
							handleCloseUserMenu();
							// navigate('/user/settings');
						}}>
						<Typography>Settings</Typography>
					</MenuItem>
					<Divider /> */}
					<MenuItem onClick={logout}>
						<Typography>Logout</Typography>
					</MenuItem>
				</Menu>
			</Box>
		)
	);
}
