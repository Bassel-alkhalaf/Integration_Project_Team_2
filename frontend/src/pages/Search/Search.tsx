import { Box, Tab, Tabs } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchQueryKeys } from '../../consts';
import { CommunitySearchResultList } from './CommunitySearchResultList';
import { UserSearchResultList } from './UserSearchResultList';

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function CustomTabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role='tabpanel'
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}>
			{value === index && <Box sx={{ px: 1, py: 3 }}>{children}</Box>}
		</div>
	);
}

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

const tabOptions = {
	posts: 0,
	communities: 1,
	users: 2,
};

const reverseTabOptions = Object.fromEntries(Object.entries(tabOptions).map(([key, value]) => [value, key]));

export function Search() {
	const queryClient = useQueryClient();
	const [searchParams, setSearchParams] = useSearchParams();
	const query = useMemo(() => searchParams.get('q') || '', [searchParams]);
	const currentTab = useMemo(() => searchParams.get('tab'), [searchParams]);
	const currentTabIndex = useMemo(
		() => (currentTab ? tabOptions[currentTab as keyof typeof tabOptions] : tabOptions.posts),
		[currentTab]
	);

	useEffect(() => () => queryClient.removeQueries({ queryKey: searchQueryKeys.all }), []);

	const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
		const newTab = reverseTabOptions[newValue];
		setSearchParams({ q: query, tab: newTab });
	};

	return (
		<Box sx={{ width: '100%' }}>
			<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
				<Tabs value={currentTabIndex} onChange={handleChange} aria-label='basic tabs example'>
					<Tab label='Posts' {...a11yProps(0)} />
					<Tab label='Communities' {...a11yProps(1)} />
					<Tab label='Users' {...a11yProps(2)} />
				</Tabs>
			</Box>
			<CustomTabPanel value={currentTabIndex} index={0}>
				search results of posts
			</CustomTabPanel>
			<CustomTabPanel value={currentTabIndex} index={1}>
				<CommunitySearchResultList query={query} />
			</CustomTabPanel>
			<CustomTabPanel value={currentTabIndex} index={2}>
				<UserSearchResultList query={query} />
			</CustomTabPanel>
		</Box>
	);
}
