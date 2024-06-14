import {Button} from '@/components';
import {twMerge} from 'tailwind-merge';

export const SmallButton: React.FC<React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>> = ({
	children,
	className,
	...props
}) => {
	return (
		<Button className={twMerge('px-1 !bg-transparent !shadow-none border-none text-[var(--interactive-accent)] w-5 cursor-pointer', className)} {...props}>
			{children}
		</Button>
	);
};
