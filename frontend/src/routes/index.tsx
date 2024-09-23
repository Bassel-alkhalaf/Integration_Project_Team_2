import { Navigate, Route, Routes } from 'react-router-dom';
import { GenericInfo } from '../components';
import { MainLayout } from '../layouts';
import { Home, Login, Register, Search } from '../pages';
import { Role } from '../types';
import { RoleBasedRoute } from './RoleBasedRoute';
import Home from '../pages/Home/Home';

function AppRoutes() {
	return (
		<Routes>
			<Route path='/' element={<MainLayout />}>
				<Route index element={<Home />} />

				<Route path='/search' element={<Search />} />

				<Route
					path='access-denied'
					element={
						<GenericInfo
							msgType='warning'
							title='Access denied'
							msg='You do not have permission to view this page.'
							autoRedirect={true}
						/>
					}
				/>

				<Route
					path='server-error'
					element={
						<GenericInfo
							msgType='error'
							title='An error occurred'
							msg='The server encountered an error while processing your request. Please try again later.'
						/>
					}
				/>

				<Route
					path='not-found'
					element={
						<GenericInfo
							msgType='info'
							title='Not found'
							msg='The resource you are looking for is not found.'
							autoRedirect={true}
						/>
					}
				/>
			</Route>

			<Route element={<RoleBasedRoute allowedRoles={[Role.Guest]} />}>
				<Route path='login' element={<Login />} />
				<Route path='register' element={<Register />} />
			</Route>

			<Route path='*' element={<Navigate to='/not-found' replace />} />
		</Routes>
	);
}

export default AppRoutes;
