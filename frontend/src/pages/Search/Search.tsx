import { Alert, Grid2 as Grid, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CommunityCard, Loading } from '../../components';
import { searchQueryKeys } from '../../consts';
import { useSearchCommunities } from '../../hooks';

export function Search() {
	const queryClient = useQueryClient();
	const [searchParams, _setSearchParams] = useSearchParams();
	const query = useMemo(() => searchParams.get('q') || '', [searchParams]);
	const { data: results, refetch, isLoading, isError } = useSearchCommunities(query);

	useEffect(() => () => queryClient.removeQueries({ queryKey: searchQueryKeys.all }), []);

	useEffect(() => {
		refetch();
	}, [query]);

	if (isLoading) return <Loading />;

	if (isError) return <Alert severity='error'>An error occurred.</Alert>;

	if (!results?.length) return <Alert severity='info'>No results found.</Alert>;

	return (
		<>
			<Typography gutterBottom>
				{results?.length || 0} {results?.length > 1 ? 'results' : 'result'} for "{query}":
			</Typography>

			<Grid container spacing={3}>
				{results?.map((community, index) => {
					return (
						<Grid size={{ xs: 12, md: 6, lg: 4, xl: 3 }} key={index}>
							<CommunityCard community={community} />
						</Grid>
					);
				})}
			</Grid>
		</>
	);
}
