import { zodResolver } from '@hookform/resolvers/zod';
import { Add as AddIcon } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
	Alert,
	Avatar,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Stack,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { enqueueSnackbar } from 'notistack';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { INITIAL_COMMUNITY_CREATE_REQ_OBJ, userCommunityQueryKeys } from '../consts';
import { useCreateCommunity, useToggleOpenEl } from '../hooks';
import { CommunityCreateSchema } from '../schemas';
import { CommunityCreateDTO } from '../types';
import { RHFTextField } from './common';

export function CreateCommunityDialog() {
	const { isOpen, isMobile, openEl, closeEl } = useToggleOpenEl();

	const queryClient = useQueryClient();
	const { mutate: createCommunity, isPending } = useCreateCommunity('pdVWPPaFz6M2EFhoyzg5');

	const methods = useForm<CommunityCreateDTO>({
		resolver: zodResolver(CommunityCreateSchema),
		defaultValues: INITIAL_COMMUNITY_CREATE_REQ_OBJ,
	});
	const {
		handleSubmit,
		reset,
		setError,
		formState: { errors },
	} = methods;

	const handleDialogClose = () => {
		closeEl();
		reset();
	};

	const onSubmit: SubmitHandler<CommunityCreateDTO> = data => {
		createCommunity(data, {
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: userCommunityQueryKeys.all });
				enqueueSnackbar('Community created successfully created!', { variant: 'success' });
				handleDialogClose();
			},
			onError: err => {
				const { status } = err as AxiosError;
				if (status === 409) {
					setError('name', { message: 'This community name has already been taken' });
					return;
				}

				setError('root', { message: 'An error occurred.' });
			},
		});
	};

	return (
		<>
			<ListItem disablePadding>
				<ListItemButton onClick={openEl}>
					<ListItemIcon>
						<Avatar>
							<AddIcon />
						</Avatar>
					</ListItemIcon>
					<ListItemText primary='Create a community' />
				</ListItemButton>
			</ListItem>

			<FormProvider {...methods}>
				<Dialog
					open={isOpen}
					fullScreen={isMobile}
					onClose={handleDialogClose}
					PaperProps={{
						component: 'form',
						noValidate: true,
						onSubmit: handleSubmit(onSubmit),
					}}>
					<DialogTitle>Tell us about your community</DialogTitle>
					<DialogContent>
						<Stack gap={3}>
							{errors.root && <Alert severity='error'>{errors.root.message}</Alert>}

							<DialogContentText>
								A name and description help people understand what your community is about
							</DialogContentText>

							<RHFTextField<CommunityCreateDTO> name='name' label='Community name' required />

							<RHFTextField<CommunityCreateDTO>
								name='description'
								label='Description'
								required
								multiline
								rows={7}
							/>
						</Stack>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleDialogClose}>Cancel</Button>
						<LoadingButton type='submit' loading={isPending}>
							Create
						</LoadingButton>
					</DialogActions>
				</Dialog>
			</FormProvider>
		</>
	);
}
