import {twMerge} from 'tailwind-merge';
import {Icon} from '../icons/icon';
import {ReactNode} from 'react';
import {Button} from './button';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	label: string;
	icon: ReactNode;
	onClick: () => void;
	className?: string;
	iconClassName?: string;
	disabled?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({label, icon, onClick, className, iconClassName, disabled = false, ...props}) => {
	return (
		<Button
			className={twMerge('clickable-icon setting-editor-extra-setting-button', className)}
			aria-label={label}
			aria-disabled={disabled ? 'true' : 'false'}
			disabled={disabled}
			onClick={onClick}
			{...props}
		>
			{typeof icon === 'string' ? <Icon name={icon} className={iconClassName} /> : icon}
		</Button>
	);
};
