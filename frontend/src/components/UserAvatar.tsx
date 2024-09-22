import { Avatar, SxProps, Theme } from '@mui/material';
import { UserInfoT } from '../types';

interface Props {
	user: UserInfoT;
	sx?: SxProps<Theme>;
}

export function UserAvatar({ user, sx }: Props) {
	function stringToColor(string: string) {
		let hash = 0;
		let i;

		/* eslint-disable no-bitwise */
		for (i = 0; i < string.length; i += 1) {
			hash = string.charCodeAt(i) + ((hash << 5) - hash);
		}

		let color = '#';

		for (i = 0; i < 3; i += 1) {
			const value = (hash >> (i * 8)) & 0xff;
			color += `00${value.toString(16)}`.slice(-2);
		}
		/* eslint-enable no-bitwise */

		return color;
	}

	function stringAvatar(name: string) {
		return {
			sx: {
				bgcolor: stringToColor(name),
				fontSize: '1rem',
				...sx,
			},
			children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
		};
	}

	const { email, firstName, lastName, profileImageUrl } = user;
	const fullName = `${firstName} ${lastName}`;

	return (
		<>
			{profileImageUrl ? (
				<Avatar alt={email} src={profileImageUrl} sx={{ ...sx }} />
			) : (
				<Avatar {...stringAvatar(fullName)} />
			)}
		</>
	);
}
