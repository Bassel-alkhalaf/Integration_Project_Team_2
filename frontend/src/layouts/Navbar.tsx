// import {
// 	AccountCircle as AccountCircleIcon,
// 	AccountCircleOutlined as AccountCircleOutlinedIcon,
// 	Feed as FeedIcon,
// 	FeedOutlined as FeedOutlinedIcon,
// 	Home as HomeIcon,
// 	HomeOutlined as HomeOutlinedIcon,
// 	Menu as MenuIcon,
// 	PeopleAlt as PeopleAltIcon,
// 	PeopleAltOutlined as PeopleAltOutlinedIcon,
// } from '@mui/icons-material';
// import {
// 	AppBar,
// 	Box,
// 	Button,
// 	CssBaseline,
// 	Divider,
// 	Drawer,
// 	IconButton,
// 	List,
// 	Stack,
// 	Toolbar,
// 	Typography,
// 	useMediaQuery,
// 	useTheme,
// } from '@mui/material';
// import { useState } from 'react';
// import { Outlet, useNavigate } from 'react-router-dom';
// import { GlobalSearch, NavItem, UserAvatarMenu, UserCommunityList } from '../components';
// import { useAuth } from '../contexts';
// import { Footer } from './Footer';

// const drawerWidth = 240;

// export function Navbar() {
// 	const { auth } = useAuth();
// 	const navigate = useNavigate();
// 	const theme = useTheme();
// 	const isMobile = useMediaQuery(theme.breakpoints.down('md'));

// 	const [mobileOpen, setMobileOpen] = useState(false);
// 	const [isClosing, setIsClosing] = useState(false);

// 	const handleDrawerClose = () => {
// 		setIsClosing(true);
// 		setMobileOpen(false);
// 	};

// 	const handleDrawerTransitionEnd = () => {
// 		setIsClosing(false);
// 	};

// 	const handleDrawerToggle = () => {
// 		if (!isClosing) {
// 			setMobileOpen(!mobileOpen);
// 		}
// 	};

// 	const drawer = (
// 		<>
// 			<Toolbar />
// 			<Divider />
// 			<List disablePadding>
// 				<NavItem path='/' label='Home' icon={<HomeOutlinedIcon />} selectedIcon={<HomeIcon />} />

// 				<NavItem
// 					path='/friends'
// 					label='My Friends'
// 					icon={<PeopleAltOutlinedIcon />}
// 					selectedIcon={<PeopleAltIcon />}
// 				/>

// 				<NavItem
// 					path='/posts/me'
// 					label='My Posts'
// 					icon={<AccountCircleOutlinedIcon />}
// 					selectedIcon={<AccountCircleIcon />}
// 				/>

// 				<NavItem path='/posts' label='All Posts' icon={<FeedOutlinedIcon />} selectedIcon={<FeedIcon />} />
// 			</List>

// 			<UserCommunityList />
// 		</>
// 	);

// 	return (
// 		<Box sx={{ display: 'flex', height: '100vh' }}>
// 			<CssBaseline />
// 			<AppBar position='fixed' sx={{ zIndex: theme.zIndex.drawer + 1 }}>
// 				<Toolbar>
// 					<IconButton
// 						color='inherit'
// 						aria-label='open drawer'
// 						edge='start'
// 						onClick={handleDrawerToggle}
// 						sx={{ mr: 2, display: { sm: 'none' } }}>
// 						<MenuIcon />
// 					</IconButton>

// 					<Typography
// 						variant='h6'
// 						noWrap
// 						component='div'
// 						onClick={() => navigate('/')}
// 						sx={{ cursor: 'pointer' }}>
// 						OurForum&#8482;
// 					</Typography>

// 					<Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
// 						<Box sx={{ display: isMobile ? 'none' : 'flex', width: '80%' }}>
// 							<GlobalSearch />
// 						</Box>
// 					</Box>

// 					<Box sx={{ display: auth ? 'block' : 'none', justifyContent: 'end' }}>
// 						<UserAvatarMenu />
// 					</Box>

// 					<Box
// 						sx={{
// 							display: auth ? 'none' : 'flex',
// 							justifyContent: 'end',
// 							gap: 2,
// 							'& .MuiButton-root': { color: 'inherit' },
// 						}}>
// 						<Button onClick={() => navigate('/register')}>Register</Button>
// 						<Button onClick={() => navigate('/login')}>Login</Button>
// 					</Box>
// 				</Toolbar>
// 			</AppBar>

// 			<Box component='nav' sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
// 				<Drawer
// 					variant='temporary'
// 					open={mobileOpen}
// 					onTransitionEnd={handleDrawerTransitionEnd}
// 					onClose={handleDrawerClose}
// 					ModalProps={{ keepMounted: true }}
// 					sx={{
// 						display: { xs: 'block', sm: 'none' },
// 						'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
// 					}}>
// 					{drawer}
// 				</Drawer>
// 				<Drawer
// 					variant='permanent'
// 					sx={{
// 						display: { xs: 'none', sm: 'block' },
// 						'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
// 					}}
// 					open>
// 					{drawer}
// 				</Drawer>
// 			</Box>

// 			<Stack component='main' sx={{ flexGrow: 1, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
// 				<Toolbar />

// 				<Stack sx={{ flexGrow: 1, overflow: 'auto' }}>
// 					<Box sx={{ flexGrow: 1, p: 3 }}>
// 						<Outlet />
// 					</Box>

// 					<Footer />
// 				</Stack>
// 			</Stack>
// 		</Box>
// 	);
// }



// Navbar.tsx
import {
	AccountCircle as AccountCircleIcon,
	AccountCircleOutlined as AccountCircleOutlinedIcon,
	Feed as FeedIcon,
	FeedOutlined as FeedOutlinedIcon,
	Home as HomeIcon,
	HomeOutlined as HomeOutlinedIcon,
	Menu as MenuIcon,
	PeopleAlt as PeopleAltIcon,
	PeopleAltOutlined as PeopleAltOutlinedIcon,
  } from '@mui/icons-material';
  import {
	AppBar,
	Box,
	Button,
	CssBaseline,
	Divider,
	Drawer,
	IconButton,
	List,
	Stack,
	Toolbar,
	Typography,
	useMediaQuery,
	useTheme,
  } from '@mui/material';
  import { useState } from 'react';
  import { Outlet, useNavigate } from 'react-router-dom';
  import { GlobalSearch, NavItem, UserAvatarMenu, UserCommunityList } from '../components';
  import { useAuth } from '../contexts'; // Import from the updated contexts
  import { Footer } from './Footer';
  
  const drawerWidth = 240;
  
  export function Navbar() {
	const { user, logout } = useAuth(); // Use the correct useAuth hook
	const navigate = useNavigate();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
	const [mobileOpen, setMobileOpen] = useState(false);
	const [isClosing, setIsClosing] = useState(false);
  
	const handleDrawerClose = () => {
	  setIsClosing(true);
	  setMobileOpen(false);
	};
  
	const handleDrawerTransitionEnd = () => {
	  setIsClosing(false);
	};
  
	const handleDrawerToggle = () => {
	  if (!isClosing) {
		setMobileOpen(!mobileOpen);
	  }
	};
  
	const handleLogout = async () => {
	  await logout();
	  navigate('/login');
	};
  
	const drawer = (
	  <>
		<Toolbar />
		<Divider />
		<List disablePadding>
		  <NavItem path='/' label='Home' icon={<HomeOutlinedIcon />} selectedIcon={<HomeIcon />} />
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
		  <NavItem path='/posts' label='All Posts' icon={<FeedOutlinedIcon />} selectedIcon={<FeedIcon />} />
		</List>
		<UserCommunityList />
	  </>
	);
  
	return (
	  <Box sx={{ display: 'flex', height: '100vh' }}>
		<CssBaseline />
		<AppBar position='fixed' sx={{ zIndex: theme.zIndex.drawer + 1 }}>
		  <Toolbar>
			<IconButton
			  color='inherit'
			  aria-label='open drawer'
			  edge='start'
			  onClick={handleDrawerToggle}
			  sx={{ mr: 2, display: { sm: 'none' } }}
			>
			  <MenuIcon />
			</IconButton>
  
			<Typography
			  variant='h6'
			  noWrap
			  component='div'
			  onClick={() => navigate('/')}
			  sx={{ cursor: 'pointer' }}
			>
			  OurForum&#8482;
			</Typography>
  
			<Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
			  <Box sx={{ display: isMobile ? 'none' : 'flex', width: '80%' }}>
				<GlobalSearch />
			  </Box>
			</Box>
  
			{/* Conditionally render the Login/Register or Logout */}
			{user ? (
			  <Box sx={{ display: 'flex', gap: 2 }}>
				<UserAvatarMenu />
				<Button onClick={handleLogout} color='inherit'>
				  Logout
				</Button>
			  </Box>
			) : (
			  <Box sx={{ display: 'flex', gap: 2 }}>
				<Button onClick={() => navigate('/register')} color='inherit'>
				  Register
				</Button>
				<Button onClick={() => navigate('/login')} color='inherit'>
				  Login
				</Button>
			  </Box>
			)}
		  </Toolbar>
		</AppBar>
  
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
			}}
		  >
			{drawer}
		  </Drawer>
		  <Drawer
			variant='permanent'
			sx={{
			  display: { xs: 'none', sm: 'block' },
			  '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
			}}
			open
		  >
			{drawer}
		  </Drawer>
		</Box>
  
		<Stack component='main' sx={{ flexGrow: 1, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
		  <Toolbar />
  
		  <Stack sx={{ flexGrow: 1, overflow: 'auto' }}>
			<Box sx={{ flexGrow: 1, p: 3 }}>
			  <Outlet />
			</Box>
  
			<Footer />
		  </Stack>
		</Stack>
	  </Box>
	);
  }
  