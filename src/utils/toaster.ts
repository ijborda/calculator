import { Bounce, toast } from 'react-toastify';

class Toaster {
	constructor() {}

	info(message: string) {
		toast.info(message, {
			position: 'top-right',
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: 'colored',
			transition: Bounce,
			style: { background: '#1c1ca5' },
		});
	}

	success(message: string) {
		toast.success(message, {
			position: 'top-right',
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: 'colored',
			transition: Bounce,
			style: { background: '#125812' },
		});
	}

	warn(message: string) {
		toast.warn(message, {
			position: 'top-right',
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: 'colored',
			transition: Bounce,
			style: { background: '#7b7b1b' },
		});
	}

	error(message: string) {
		toast.error(message, {
			position: 'top-right',
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: 'colored',
			transition: Bounce,
			style: { background: '#7a1d1d' },
		});
	}

	default(message: string) {
		toast(message, {
			position: 'top-right',
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: 'colored',
			transition: Bounce,
		});
	}
}

export const toaster = new Toaster();
