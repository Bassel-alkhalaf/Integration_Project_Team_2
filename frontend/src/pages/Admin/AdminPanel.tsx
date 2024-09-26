import React from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText } from '@mui/material';
import { useFetchUsers } from '../../hooks/apiHooks/Admin/useFetchUsers';
import { useUpdateUserRole } from '../../hooks/apiHooks/Admin/useUpdateUserRole';
import { UserInfoDTO, Role } from '../../types/user.type'; // Import the UserInfoDTO and Role enum

const AdminPanel: React.FC = () => {
  const { data: users, isLoading, isError } = useFetchUsers(); // Fetch users and add loading and error handling
  const { mutate: updateUserRole } = useUpdateUserRole(); // Hook to update user role

  const handlePromote = (uid: string) => {
    updateUserRole({ uid, role: 'Admin' }); // Use the correct casing
  };

  const handleSuspend = (uid: string) => {
    updateUserRole({ uid, role: 'Suspended' }); // Use the correct casing
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
      <List>
        {users.map((user: UserInfoDTO) => (
          <ListItem key={user.id}>
            <ListItemText
              primary={`${user.firstName || 'First Name'} ${user.lastName || 'Last Name'}`}
              secondary={`Role: ${user.role || 'User'}`} // Correct casing for roles
            />
            {user.role !== 'Admin' && (
              <Button variant="outlined" onClick={() => handlePromote(user.id)}>
                Promote to Admin
              </Button>
            )}
            {user.role !== 'Suspended' && (
              <Button variant="outlined" color="error" onClick={() => handleSuspend(user.id)}>
                Suspend User
              </Button>
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default AdminPanel;
