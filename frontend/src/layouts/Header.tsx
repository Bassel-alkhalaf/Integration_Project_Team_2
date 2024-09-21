// Header.tsx
import { Menu as MenuIcon } from '@mui/icons-material';
import { AppBar, Box, Button, IconButton, Toolbar, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { GlobalSearch, UserAvatarMenu } from '../components';
import { useAuth } from '../contexts';

interface PropsI {
  handleDrawerToggle: () => void;
}

export function Header({ handleDrawerToggle }: PropsI) {
  const { user, logout } = useAuth(); // Updated
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
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

        {user ? (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <UserAvatarMenu />
            <Button onClick={handleLogout} color='inherit'>
              Logout
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'end',
              gap: 2,
              '& .MuiButton-root': { color: 'inherit' },
            }}
          >
            <Button onClick={() => navigate('/register')}>Register</Button>
            <Button onClick={() => navigate('/login')}>Login</Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
