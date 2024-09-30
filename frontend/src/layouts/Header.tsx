// // Header.tsx
// import { Menu as MenuIcon } from '@mui/icons-material';
// import { AppBar, Box, Button, IconButton, Toolbar, Typography, useMediaQuery, useTheme } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import { GlobalSearch, UserAvatarMenu } from '../components';
// import { useAuth } from '../contexts';

// interface PropsI {
//   handleDrawerToggle: () => void;
// }

// export function Header({ handleDrawerToggle }: PropsI) {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'));

//   return (
//     <AppBar position='fixed' sx={{ zIndex: theme.zIndex.drawer + 1 }}>
//       <Toolbar>
//         <IconButton
//           color='inherit'
//           aria-label='open drawer'
//           edge='start'
//           onClick={handleDrawerToggle}
//           sx={{ mr: 2, display: { sm: 'none' } }}
//         >
//           <MenuIcon />
//         </IconButton>

//         <Typography
//           variant='h6'
//           noWrap
//           component='div'
//           onClick={() => navigate('/')}
//           sx={{ cursor: 'pointer' }}
//         >
//           OurForum&#8482;
//         </Typography>

//         <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
//           <Box sx={{ display: isMobile ? 'none' : 'flex', width: '80%' }}>
//             <GlobalSearch />
//           </Box>
//         </Box>

//         {user ? (
//           <UserAvatarMenu />
//         ) : (
//           <Box
//             sx={{
//               display: 'flex',
//               justifyContent: 'end',
//               gap: 2,
//               '& .MuiButton-root': { color: 'inherit' },
//             }}
//           >
//             <Button onClick={() => navigate('/register')}>Register</Button>
//             <Button onClick={() => navigate('/login')}>Login</Button>
//           </Box>
//         )}
//       </Toolbar>
//     </AppBar>
//   );
// }



import { Menu as MenuIcon } from '@mui/icons-material';
import { AppBar, Box, Button, IconButton, Toolbar, Typography, useMediaQuery, useTheme, Switch } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { GlobalSearch, UserAvatarMenu } from '../components';
import { useAuth } from '../contexts';
import { useThemeContext } from '../components/Theme/ThemeContext'; // Import Theme Context

interface PropsI {
  handleDrawerToggle: () => void;
}

export function Header({ handleDrawerToggle }: PropsI) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Access the theme context
  const { darkMode, toggleTheme } = useThemeContext();

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

        {/* Theme Toggle */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body1" sx={{ mr: 1 }}>
            {darkMode ? 'Dark Mode' : 'Light Mode'}
          </Typography>
          <Switch checked={darkMode} onChange={toggleTheme} />
        </Box>

        {user ? (
          <UserAvatarMenu />
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
