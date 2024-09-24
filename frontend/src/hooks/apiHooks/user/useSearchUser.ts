import { useQuery } from '@tanstack/react-query';
import { UserInfoDTO } from '../../../types/user.type';
import { sendRequest } from '../../../api/apis/request';
import { USER_ENDPOINT } from '../../../api/endpoints';


export const useSearchUser = (searchTerm: string) => {
  

	return useQuery<UserInfoDTO[]>({
		queryKey: ['searchUser', searchTerm],
		queryFn: async () => {
			
			const url = `${USER_ENDPOINT}?q=${searchTerm}`;

			
			const res = await sendRequest({
				method: 'GET',
				endpoint: url,
			});

			
			return res.data as UserInfoDTO[];
		},
		
		enabled: !!searchTerm,
		staleTime: 5 * 60 * 1000, 
	});
};
