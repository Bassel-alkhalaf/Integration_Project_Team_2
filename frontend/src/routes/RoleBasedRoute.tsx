import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts';
import { Role } from '../types';

interface PropsI {
	allowedRoles: Role[];
}

export function RoleBasedRoute({ allowedRoles }: PropsI) {
	const { user } = useAuth();

	if (user && allowedRoles.includes(Role.Guest) && allowedRoles.length === 1) {
		return <Navigate to='/' replace />;
	}

	if (user && !allowedRoles.includes(user.role as Role)) {
		return <Navigate to='/unauthorized' replace />;
	}

	if (!user && !allowedRoles.includes(Role.Guest)) {
		return <Navigate to='/login' replace />;
	}

	return <Outlet />;
}
