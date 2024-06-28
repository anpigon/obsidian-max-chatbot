import {FC, PropsWithChildren} from 'react';

export interface DrawerProps extends PropsWithChildren {
	isOpen: boolean;
	onClose: () => void;
	side: 'left' | 'right';
}

export const Drawer: FC<DrawerProps> = ({isOpen, onClose, side, children}) => {
	return (
		<>
			<div className={`fixed inset-0 bg-gray-900 bg-opacity-50 z-50 ${isOpen ? 'block' : 'hidden'}`} onClick={onClose} />
			<div
				className={`fixed inset-y-0 ${side === 'left' ? 'left-0' : 'right-0'} w-64 bg-primary z-50 shadow-lg transform transition-transform duration-300 ease-in-out ${
					isOpen ? 'translate-x-0' : side === 'left' ? '-translate-x-full' : 'translate-x-full'
				}`}
			>
				{children}
			</div>
		</>
	);
};
