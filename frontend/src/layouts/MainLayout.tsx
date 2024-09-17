import { Outlet } from 'react-router-dom';
import { Footer } from './Footer';
import { Nav } from './Nav';

export function MainLayout() {
	return (
		<div className='d-flex flex-column vh-100'>
			<Nav />

			<div className='d-flex flex-column flex-grow-1 overflow-auto'>
				<div className='flex-grow-1 py-3'>
					<Outlet />
				</div>

				<Footer />
			</div>
		</div>
	);
}
