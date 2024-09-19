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
	Divider,
	IconButton,
	Link,
	List,
	Drawer as MuiDrawer,
	Toolbar,
	Typography,
	useMediaQuery,
} from '@mui/material';
import { CSSObject, Theme, styled, useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavItem, UserAvatarMenu, UserCommunityList } from '../components';
import { useAuth } from '../contexts';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
	width: drawerWidth,
	transition: theme.transitions.create('width', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen,
	}),
	overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
	transition: theme.transitions.create('width', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	overflowX: 'hidden',
	width: `calc(${theme.spacing(8)} + 1px)`,
	[theme.breakpoints.down('sm')]: {
		width: `calc(${theme.spacing(6)} + 1px)`,
	},
});

const Drawer = styled(MuiDrawer)(({ theme, open }) => ({
	width: drawerWidth,
	flexShrink: 0,
	whiteSpace: 'nowrap',
	boxSizing: 'border-box',
	...(open && {
		...openedMixin(theme),
		'& .MuiDrawer-paper': openedMixin(theme),
	}),
	...(!open && {
		...closedMixin(theme),
		'& .MuiDrawer-paper': closedMixin(theme),
	}),
}));

export function Nav() {
	const navigate = useNavigate();
	const { auth } = useAuth();

	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));

	const [open, setOpen] = useState(!isMobile);

	const toggleDrawer = () => {
		setOpen(!open);
	};

	const closeDrawerOnMobile = () => {
		isMobile && setOpen(false);
	};

	const drawerContent = (open: boolean) => (
		<>
			<Toolbar />
			<Divider />

			<List disablePadding>
				<NavItem
					open={open}
					path='/'
					label='Home'
					icon={<HomeOutlinedIcon />}
					selectedIcon={<HomeIcon />}
					onClickFn={closeDrawerOnMobile}
				/>
				<NavItem
					open={open}
					path='/friends'
					label='My friends'
					icon={<PeopleAltOutlinedIcon />}
					selectedIcon={<PeopleAltIcon />}
					onClickFn={closeDrawerOnMobile}
				/>
				<NavItem
					open={open}
					path='/posts/me'
					label='My Posts'
					icon={<AccountCircleOutlinedIcon />}
					selectedIcon={<AccountCircleIcon />}
					onClickFn={closeDrawerOnMobile}
				/>
				<NavItem
					open={open}
					path='/posts'
					label='All Posts'
					icon={<FeedOutlinedIcon />}
					selectedIcon={<FeedIcon />}
					onClickFn={closeDrawerOnMobile}
				/>
			</List>

			<Divider />

			<UserCommunityList onClickFn={closeDrawerOnMobile} />
		</>
	);

	return (
		<>
			<AppBar position='fixed' sx={{ zIndex: theme.zIndex.drawer + 1 }}>
				<Toolbar>
					<IconButton
						color='inherit'
						aria-label='open drawer'
						onClick={toggleDrawer}
						edge='start'
						sx={{ mr: 2 }}>
						<MenuIcon />
					</IconButton>
					<Link
						component='button'
						onClick={() => {
							closeDrawerOnMobile();
							navigate('/');
						}}>
						<Typography variant='h6' component='span' color={'primary.contrastText'}>
							OurForum&#8482;
						</Typography>
					</Link>

					<Box sx={{ flexGrow: 1 }}>
						{/* <Box sx={{ display: isMobile ? 'none' : 'flex' }}>
							<GlobalSearch />
						</Box> */}
					</Box>

					<Box sx={{ display: auth ? 'block' : 'none', justifyContent: 'end' }}>
						<UserAvatarMenu />
					</Box>

					<Box
						sx={{
							display: auth ? 'none' : 'flex',
							justifyContent: 'end',
							gap: 3,
							'& .MuiButton-root': { color: 'inherit' },
						}}>
						<Button onClick={() => navigate('/register')}>Register</Button>
						<Button onClick={() => navigate('/login')}>Login</Button>
					</Box>
				</Toolbar>
				{/* <Toolbar disableGutters sx={{ display: isMobile ? 'block' : 'none' }}>
					<GlobalSearch />
				</Toolbar> */}
			</AppBar>
			<Drawer variant={'permanent'} open={isMobile ? false : open} onClose={closeDrawerOnMobile}>
				{drawerContent(isMobile ? false : open)}
			</Drawer>

			{isMobile && (
				<Drawer
					variant={'temporary'}
					open={open}
					onClose={closeDrawerOnMobile}
					{...(isMobile && { disableScrollLock: true })}>
					{drawerContent(open)}
				</Drawer>
			)}
		</>
	);
}
