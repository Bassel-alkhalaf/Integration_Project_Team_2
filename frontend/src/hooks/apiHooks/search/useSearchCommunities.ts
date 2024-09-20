import { useQuery } from '@tanstack/react-query';
import { searchCommunities } from '../../../api';
import { searchQueryKeys } from '../../../consts';

export const useSearchCommunities = (query: string) => {
	return useQuery({
		queryKey: searchQueryKeys.communities(),
		queryFn: () => searchCommunities(query),
	});
};
