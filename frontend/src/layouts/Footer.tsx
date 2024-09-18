import { Toolbar, useTheme } from '@mui/material';
import dayjs from 'dayjs';

export function Footer() {
	const theme = useTheme();

	return (
		<Toolbar
			sx={{
				bgcolor: 'lightgray',
				color: 'text.secondary',
				justifyContent: 'center',
				zIndex: theme.zIndex.drawer + 1,
			}}>
			&copy; Copyright {dayjs().year()} OurForum
		</Toolbar>
	);
}
