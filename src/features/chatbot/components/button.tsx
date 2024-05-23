import {twMerge} from 'tailwind-merge';

export const Button: React.FC<React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>> = ({
	children,
	className,
	...props
}) => {
	return (
		<button className={twMerge('px-1 !bg-transparent !shadow-none border-none text-[var(--interactive-accent)] w-5 cursor-pointer', className)} {...props}>
			{children}
		</button>
	);
};
