import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

export const useGenericErrHandler = () => {
	const navigate = useNavigate();

	return (err: AxiosError) => {
		switch (err.code) {
			case '401':
				return () => navigate('/sign-in');
			case '403':
				return () => navigate('/access-denied');
			case '404':
				return () => navigate('/not-found');
			// default:
			// 	alert(`An error occurred.\n${err.message}`);
			// 	return;
		}
	};
};