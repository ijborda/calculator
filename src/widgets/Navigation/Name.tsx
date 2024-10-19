import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Avatar, Divider, ListItemIcon, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Logout } from '@mui/icons-material';
import { GlobalStates, StringLib, auth } from '@/libs';
import { useRouter } from 'next/navigation';
import { useAtomValue } from 'jotai';

interface Props {
	settingsLink: string;
}

export default function Widget(props: Props) {
	/**
	 * Declarations
	 */
	const theme = useTheme();
	const router = useRouter();

	/**
	 * States
	 */
	const globalUser = useAtomValue(GlobalStates.user);
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	/**
	 * Handlers
	 */
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<div>
			<Button
				id='basic-button'
				aria-controls={open ? 'basic-menu' : undefined}
				aria-haspopup='true'
				aria-expanded={open ? 'true' : undefined}
				onClick={handleClick}
				color='inherit'
				sx={{
					display: 'flex',
					gap: '10px',
				}}
			>
				<Avatar />
				<Typography
					sx={{
						textTransform: 'none',
						[theme.breakpoints.down('sm')]: {
							display: 'none',
						},
					}}
				>
					{StringLib.toTitleCase(
						`${globalUser?.given_name || ''} ${globalUser?.family_name || ''}`
					)}
				</Typography>
			</Button>
			<Menu
				id='basic-menu'
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					'aria-labelledby': 'basic-button',
				}}
				PaperProps={{
					style: {
						minWidth: '200px',
					},
				}}
			>
				<MenuItem
					onClick={handleClose}
					disabled={true}
					sx={{
						'&.Mui-disabled': {
							opacity: 1,
						},
					}}
				>
					User ID: {globalUser?.username}
				</MenuItem>
				<MenuItem
					onClick={handleClose}
					disabled={true}
					sx={{
						'&.Mui-disabled': {
							opacity: 1,
						},
					}}
				>
					Position: {StringLib.toTitleCase(globalUser?.position)}
				</MenuItem>
				<MenuItem component='a' onClick={handleClose} href={props.settingsLink}>
					Settings
				</MenuItem>
				<Divider />
				<MenuItem
					onClick={async () => {
						await auth.logout();
						handleClose();
						router.push('/login');
						return;
					}}
				>
					<ListItemIcon>
						<Logout fontSize='small' />
					</ListItemIcon>
					Logout
				</MenuItem>
			</Menu>
		</div>
	);
}
