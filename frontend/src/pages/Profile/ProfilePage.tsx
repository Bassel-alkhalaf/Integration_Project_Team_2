import { Grid2 as Grid } from '@mui/material';
import { Navigate, useParams } from 'react-router-dom';
import { Loading } from '../../components';
import { useGetUserInfo } from '../../hooks';
import { UserInfoDTO } from '../../types';
import Profile from './Profile';

export function ProfilePage() {
	const { id } = useParams<{ id: string }>();

	const { data: user, isLoading, isError } = useGetUserInfo(id);

	if (isLoading) return <Loading />;

	if (isError) return <Navigate to='/server-error' />;

	return (
		<Grid container spacing={2}>
			<Grid size={{ xs: 12, lg: 4, xl: 3 }} order={{ xs: 1, lg: 2 }}>
				<Profile user={user as UserInfoDTO} />
			</Grid>
			<Grid size={{ xs: 12, lg: 8, xl: 9 }} order={{ xs: 2, lg: 1 }}>
				user's posts
			</Grid>
		</Grid>
	);
}
