import {
	AccountCircle as AccountCircleIcon,
	AccountCircleOutlined as AccountCircleOutlinedIcon,
	Feed as FeedIcon,
	FeedOutlined as FeedOutlinedIcon,
	Home as HomeIcon,
	HomeOutlined as HomeOutlinedIcon,
	PeopleAlt as PeopleAltIcon,
	PeopleAltOutlined as PeopleAltOutlinedIcon,
	AdminPanelSettings as AdminPanelSettingsIcon,
	AdminPanelSettingsOutlined as AdminPanelSettingsOutlinedIcon,
} from '@mui/icons-material';
import { Box, Divider, Drawer, List, Toolbar } from '@mui/material';
import { NavItem, UserCommunityList } from '../components';
import { useAuth } from '../contexts';
import React, { useState, useEffect } from 'react';
import { PlaylistComponent} from './../components/ApiMusic';

const MemoizedPlaylistComponent = React.memo(PlaylistComponent);

interface PropsI {
	drawerWidth: number;
	mobileOpen: boolean;
	handleDrawerClose: () => void;
	handleDrawerTransitionEnd: () => void;
}

export function Nav({ drawerWidth, mobileOpen, handleDrawerClose, handleDrawerTransitionEnd }: PropsI) {
	const { user } = useAuth();

	const drawer = (
		<>
			<Toolbar />
			<Divider />
			<List disablePadding>
				<NavItem path='/' label='Home' icon={<HomeOutlinedIcon />} selectedIcon={<HomeIcon />} />

				{user && (
					<>
						<NavItem
							path='/friends'
							label='My Friends'
							icon={<PeopleAltOutlinedIcon />}
							selectedIcon={<PeopleAltIcon />}
						/>
						<NavItem
							path='/posts/me'
							label='My Posts'
							icon={<AccountCircleOutlinedIcon />}
							selectedIcon={<AccountCircleIcon />}
						/>
						{user.role === 'Admin' && (
							<NavItem
								path='/admin'
								label='Admin Panel'
								icon={<AdminPanelSettingsOutlinedIcon />}
								selectedIcon={<AdminPanelSettingsIcon />}
							/>
						)}
					</>
				)}

				<NavItem path='/posts' label='All Posts' icon={<FeedOutlinedIcon />} selectedIcon={<FeedIcon />} />
			</List>

			{user && <UserCommunityList />}

			{/*add API */}
      <Box sx={{ width: drawerWidth, height: drawerWidth, margin: 'auto' }}>
        <MemoizedPlaylistComponent />
      </Box>
		</>
	);

	return (
		<Box component='nav' sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
			<Drawer
				variant='temporary'
				open={mobileOpen}
				onTransitionEnd={handleDrawerTransitionEnd}
				onClose={handleDrawerClose}
				ModalProps={{ keepMounted: true }}
				sx={{
					display: { xs: 'block', sm: 'none' },
					'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
				}}>
				{drawer}
			</Drawer>
			<Drawer
				variant='permanent'
				sx={{
					display: { xs: 'none', sm: 'block' },
					'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
				}}
				open>
				{drawer}
			</Drawer>
		</Box>
	);
}
