import { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, MenuItem, Box } from '@mui/material';
import { getProfileInfo, updateProfileInfo } from '../../api/apis/profile.api';
import { UserUpdateDTO } from '../../types/user.type';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

export default function EditProfile() {
  const [userData, setUserData] = useState<UserUpdateDTO>({
    firstName: '',
    lastName: '',
    gender: '',
    dob: '',
    bio: '',
    profileImageUrl: '',
  });

  const auth = getAuth();
  const navigate = useNavigate();

  // Fetch profile information when the component is loaded
  useEffect(() => {
    getProfileInfo()
      .then((data) => {
        console.log('Fetched Profile Data:', data);  // Debug: Check what data is returned

        let dob = '';
        if (data.dob) {
          // Handle dob as a Date object or date string
          const dobDate = new Date(data.dob);
          // Format to 'yyyy-MM-dd' for the date input
          dob = dobDate.toISOString().split('T')[0];
        }

        setUserData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          gender: data.gender || '',
          dob: dob,
          bio: data.bio || '',
          profileImageUrl: data.profileImageUrl || '',
        });
      })
      .catch((error) => {
        console.error('Error fetching profile info:', error);
      });
  }, []);

  const handleSaveProfile = async () => {
    try {
      // Reformat dob to 'dd/MM/yyyy' before sending to backend
      let formattedDob = userData.dob;
      if (userData.dob) {
        const dobDate = new Date(userData.dob);
        const day = String(dobDate.getDate()).padStart(2, '0');
        const month = String(dobDate.getMonth() + 1).padStart(2, '0');
        const year = dobDate.getFullYear();
        formattedDob = `${day}/${month}/${year}`;
      }

      const updatedData = {
        ...userData,
        dob: formattedDob,
      };

      console.log('Updating Profile Data:', updatedData);  // Debug: Log data being saved
      await updateProfileInfo(updatedData);  // Call the API method to update profile
      alert('Profile updated successfully!');
      navigate('/profile');  // Redirect to profile page on success
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Edit Profile</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="First Name"
          value={userData.firstName || ''}
          onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
        />
        <TextField
          label="Last Name"
          value={userData.lastName || ''}
          onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
        />
        <TextField
          label="Date of Birth"
          type="date"
          value={userData.dob || ''}
          onChange={(e) => setUserData({ ...userData, dob: e.target.value })}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Bio"
          multiline
          rows={3}
          value={userData.bio || ''}
          onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
        />
        <TextField
          label="Gender"
          select
          value={userData.gender || ''}
          onChange={(e) => setUserData({ ...userData, gender: e.target.value })}
        >
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
          <MenuItem value="non-binary">Non-Binary</MenuItem>
          <MenuItem value="prefer-not-to-say">Prefer not to say</MenuItem>
        </TextField>
        <Button variant="contained" color="primary" onClick={handleSaveProfile}>
          Save
        </Button>
      </Box>
    </Container>
  );
}
