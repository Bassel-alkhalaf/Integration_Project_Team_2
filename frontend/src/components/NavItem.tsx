import { ListItem, ListItemButton, ListItemIcon, ListItemText, SxProps, Theme } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavItemProps {
	open: boolean;
	path: string;
	label: string;
	icon: React.ReactNode;
	selectedIcon?: React.ReactNode;
	onClickFn?: () => void;
	sx?: SxProps<Theme>;
}

export function NavItem({ open, path, label, icon, selectedIcon = icon, onClickFn, sx }: NavItemProps) {
	const { pathname: currentPath } = useLocation();
	const navigate = useNavigate();

	const isSelected = currentPath === path;

	return (
		<ListItem disablePadding sx={{ ...sx }}>
			<ListItemButton
				sx={{
					minHeight: 50,
					justifyContent: open ? 'initial' : 'center',
					px: 2.5,
				}}
				onClick={() => {
					onClickFn && onClickFn();
					navigate(path);
				}}
				selected={isSelected}>
				<ListItemIcon
					sx={{
						minWidth: 0,
						mr: open ? 3 : 'auto',
						justifyContent: 'center',
						color: isSelected ? 'primary.main' : undefined,
					}}>
					{isSelected ? selectedIcon : icon}
				</ListItemIcon>
				<ListItemText
					primary={label}
					sx={{ opacity: open ? 1 : 0, color: isSelected ? 'primary.main' : 'grey.800' }}
				/>
			</ListItemButton>
		</ListItem>
	);
}
