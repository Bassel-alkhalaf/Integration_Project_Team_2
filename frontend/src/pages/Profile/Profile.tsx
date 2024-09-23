import { useState, useEffect } from 'react';
import { Container, Typography, Box, Avatar, Paper } from '@mui/material';
import { getUserInfo } from '../../api/apis/user.api'; 
import { getAuth } from 'firebase/auth';
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
            {/* Uncomment if email is required */}
            {/* <Typography variant="body1" sx={{ mt: 1, color: '#555' }}>
              Email: {user.email || ''}
            </Typography> */}
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
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default Profile;
