import { Navigate, Route, Routes } from 'react-router-dom';
import { GenericInfo } from '../components';
import { MainLayout } from '../layouts';
import { Community, Home, Login, Register, Search,Profile, PostDetail } from '../pages';
import { Role } from '../types';
import { RoleBasedRoute } from './RoleBasedRoute';

function AppRoutes() {
	return (
		<Routes>
			<Route path='/' element={<MainLayout />}>
				<Route index element={<Home />} />
				<Route path='/community/:communityId' element={<Community />} />

				<Route path='/search' element={<Search />} />
				{/* Protected Route for Profile */}
				{/* <Route element={<RoleBasedRoute allowedRoles={[Role.User, Role.Admin]} />}>
					<Route path="/profile" element={<Profile />} />
				</Route> */}

				<Route path='/profile' element={<Profile />} />
				<Route path="/posts/:postId" element={<PostDetail />} />
				{/* Guest Routes */}
			{/* <Route element={<RoleBasedRoute allowedRoles={[Role.Guest]} />}>
				<Route path="login" element={<Login />} />
				<Route path="register" element={<Register />} />
			</Route> */}

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
