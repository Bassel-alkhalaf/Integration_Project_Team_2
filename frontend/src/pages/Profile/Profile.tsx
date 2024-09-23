import { useState, useEffect } from 'react';
import { Container, Typography, Box, Avatar, Paper, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { getUserInfo } from '../../api/apis/user.api'; 
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';
import { UserInfoDTO } from '../../types'; 

// Helper function to get the default profile image based on gender
const getDefaultProfileImage = (gender: string) => {
  switch (gender.toLowerCase()) {
    case 'male':
      return '/images/profiles/male.webp';
    case 'female':
      return '/images/profiles/female.webp';
    case 'non-binary':
      return '/images/profiles/nonbinary.webp';
    default:
      return '/images/profiles/unknown.webp'; // For 'prefer not to say' or other cases
  }
};

export function Profile() {
  const [user, setUser] = useState<UserInfoDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const auth = getAuth();
    const userId = auth.currentUser?.uid || '';  // Get the current user's ID

    if (userId) {
      getUserInfo(userId)
        .then((userData: UserInfoDTO) => {
          setUser(userData);
          setLoading(false);
        })
        .catch((error: any) => {
          console.error('Error fetching user info:', error);
          setLoading(false);
        });
    } else {
      console.error('No user is logged in.');
      setLoading(false);
    }
  }, []);

  const handleChangePassword = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user || !currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Reauthenticate the user with the current password
    const credential = EmailAuthProvider.credential(user.email!, currentPassword);
    reauthenticateWithCredential(user, credential)
      .then(() => {
        // Update password
        return updatePassword(user, newPassword);
      })
      .then(() => {
        setError('');
        alert('Password changed successfully!');
        setOpenDialog(false);
      })
      .catch((error) => {
        setError('Failed to change password. Please check your credentials.');
        console.error(error);
      });
  };

  if (loading) {
    return <Typography sx={{ textAlign: 'center', mt: 4 }}>Loading...</Typography>;
  }

  // Check if user.dob is a string or Date, then parse accordingly
  const dob = user?.dob instanceof Date ? user.dob : new Date(user?.dob ?? '');

  // Determine the profile image, either the user-provided one or the default based on gender
  const profileImageUrl = user?.profileImageUrl || getDefaultProfileImage(user?.gender || '');

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={3}
        sx={{
          mt: 8,
          p: 4,
          borderRadius: 3,
          backgroundColor: '#f0f4f8',
          textAlign: 'center',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: '#333', fontWeight: 'bold', mb: 4 }}
        >
          My Profile
        </Typography>

        {user && (
          <Box>
            <Avatar
              src={profileImageUrl}
              alt="Profile Picture"
              sx={{
                width: 150,
                height: 150,
                margin: '0 auto',
                mb: 2,
                boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Typography
              variant="h6"
              sx={{ color: '#1976d2', fontWeight: 'medium', mt: 2 }}
            >
              Name: {`${user.firstName} ${user.lastName}`}
            </Typography>
            <Typography
              variant="body1"
              sx={{ mt: 2, color: '#555' }}
            >
              Date of Birth: {dob ? dob.toDateString() : 'N/A'}
            </Typography>
            <Typography
              variant="body1"
              sx={{ mt: 2, color: '#555' }}
            >
              Bio: {user.bio || 'No bio provided'}
            </Typography>
            <Typography
              variant="body1"
              sx={{ mt: 2, color: '#555' }}
            >
              Gender: {user.gender}
            </Typography>
            <Typography
              variant="body1"
              sx={{ mt: 2, color: '#555' }}
            >
              Role: {user.role}
            </Typography>

            <Button
              variant="contained"
              sx={{ mt: 4 }}
              onClick={() => setOpenDialog(true)}
            >
              Change Password
            </Button>
          </Box>
        )}

        {/* Change Password Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To change your password, please enter your current password and a new password.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Current Password"
              type="password"
              fullWidth
              variant="outlined"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <TextField
              margin="dense"
              label="New Password"
              type="password"
              fullWidth
              variant="outlined"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Confirm New Password"
              type="password"
              fullWidth
              variant="outlined"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleChangePassword} variant="contained" color="primary">
              Change Password
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
}

export default Profile;
