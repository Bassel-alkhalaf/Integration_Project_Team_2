import React, { useState } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText, Snackbar, Alert } from '@mui/material';
import { useFetchUsers } from '../../hooks/apiHooks/Admin/useFetchUsers';
import { useUpdateUserRole } from '../../hooks/apiHooks/Admin/useUpdateUserRole';
import { UserInfoDTO } from '../../types/user.type';
import { getAuth } from 'firebase/auth'; // Import Firebase auth to get current user

const AdminPanel: React.FC = () => {
  const { data: users, isLoading, isError } = useFetchUsers();
  const { mutate: updateUserRole } = useUpdateUserRole();
  
  const [flashMessage, setFlashMessage] = useState<string | null>(null); // State for flash messages
  const [flashSeverity, setFlashSeverity] = useState<'success' | 'error'>('success'); // State for flash message severity
  
  const auth = getAuth();
  const currentUserUid = auth.currentUser?.uid; // Get the current logged-in user ID

  const handlePromote = (uid: string) => {
    updateUserRole({ uid, role: 'Admin' }, {
      onSuccess: () => {
        setFlashMessage('User has been successfully promoted to Admin.');
        setFlashSeverity('success');
      },
      onError: () => {
        setFlashMessage('Failed to promote user to Admin.');
        setFlashSeverity('error');
      }
    });
  };

  const handleSuspend = (uid: string) => {
    updateUserRole({ uid, role: 'Suspended' }, {
      onSuccess: () => {
        setFlashMessage('User has been successfully suspended.');
        setFlashSeverity('success');
      },
      onError: () => {
        setFlashMessage('Failed to suspend user.');
        setFlashSeverity('error');
      }
    });
  };

  const handleDemote = (uid: string) => {
    updateUserRole({ uid, role: 'User' }, {
      onSuccess: () => {
        setFlashMessage('Admin has been successfully demoted to regular user.');
        setFlashSeverity('success');
      },
      onError: () => {
        setFlashMessage('Failed to demote Admin.');
        setFlashSeverity('error');
      }
    });
  };

  if (isLoading) {
    return <Typography variant="h6">Loading users...</Typography>;
  }

  if (isError || !users) {
    return <Typography variant="h6" color="error">Failed to load users</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Panel
      </Typography>

      {/* Display number of users */}
      <Typography variant="h6" gutterBottom>
        Total Users: {users.length}
      </Typography>

      <List>
        {users.map((user: UserInfoDTO) => (
          <ListItem key={user.id} style={{ backgroundColor: user.role === 'Admin' ? '#f0f0f0' : '#fff' }}>
            <ListItemText
              primary={`${user.firstName || 'First Name'} ${user.lastName || 'Last Name'}`}
              secondary={currentUserUid === user.id ? "This is you!" : `Role: ${user.role || 'User'}`}
            />
            
            {currentUserUid !== user.id && user.role !== 'Admin' && (
              <Button variant="outlined" onClick={() => handlePromote(user.id)} style={{ marginRight: '10px' }}>
                Promote to Admin
              </Button>
            )}
            {currentUserUid !== user.id && user.role !== 'Suspended' && (
              <Button variant="outlined" color="error" onClick={() => handleSuspend(user.id)} style={{ marginRight: '10px' }}>
                Suspend User
              </Button>
            )}
            {user.role === 'Admin' && currentUserUid !== user.id && (
              <Button variant="outlined" color="primary" onClick={() => handleDemote(user.id)} style={{ marginRight: '10px' }}>
                Demote to User
              </Button>
            )}
          </ListItem>
        ))}
      </List>

      {/* Flash messages */}
      <Snackbar open={!!flashMessage} autoHideDuration={6000} onClose={() => setFlashMessage(null)}>
        <Alert onClose={() => setFlashMessage(null)} severity={flashSeverity} sx={{ width: '100%' }}>
          {flashMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminPanel;
