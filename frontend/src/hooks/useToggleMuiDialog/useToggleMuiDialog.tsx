import { useMediaQuery, useTheme } from '@mui/material';
import { useState } from 'react';

export const useToggleMuiDialog = (defaultOpen: boolean = false) => {
	const [isOpen, setIsOpen] = useState(defaultOpen);

	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

	const openDialog = () => {
		setIsOpen(true);
	};

	const closeDialog = () => {
		setIsOpen(false);
	};

	return { isOpen, openDialog, closeDialog, fullScreen };
};
