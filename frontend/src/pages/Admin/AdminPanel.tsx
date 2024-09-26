import React from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText } from '@mui/material';
import { useFetchUsers } from '../../hooks/apiHooks/Admin/useFetchUsers';
import { useUpdateUserRole } from '../../hooks/apiHooks/Admin/useUpdateUserRole';
import { UserInfoDTO } from '../../types/user.type';

const AdminPanel: React.FC = () => {
  const { data: users, isLoading, isError } = useFetchUsers(); 
  const { mutate: updateUserRole } = useUpdateUserRole(); 

  const handlePromote = (uid: string) => {
    updateUserRole({ uid, role: 'Admin' });
  };

  const handleSuspend = (uid: string) => {
    updateUserRole({ uid, role: 'Suspended' });
  };

  const handleDemote = (uid: string) => {
    updateUserRole({ uid, role: 'User' });
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
              secondary={`Role: ${user.role || 'User'}`}
            />
            {user.role !== 'Admin' && (
              <Button variant="outlined" onClick={() => handlePromote(user.id)} style={{ marginRight: '10px' }}>
                Promote to Admin
              </Button>
            )}
            {user.role !== 'Suspended' && (
              <Button variant="outlined" color="error" onClick={() => handleSuspend(user.id)} style={{ marginRight: '10px' }}>
                Suspend User
              </Button>
            )}
            {user.role === 'Admin' && (
              <Button variant="outlined" color="primary" onClick={() => handleDemote(user.id)} style={{ marginRight: '10px' }}>
                Demote to User
              </Button>
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default AdminPanel;
