import {twMerge} from 'tailwind-merge';

import {ButtonHTMLAttributes, DetailedHTMLProps} from 'react';

import {Button} from '@/components';

type SmallButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

export const SmallButton = ({children, className, ...props}: SmallButtonProps) => {
	return (
		<Button className={twMerge('px-1 !bg-transparent !shadow-none border-none text-[var(--interactive-accent)] w-5 cursor-pointer', className)} {...props}>
			{children}
		</Button>
	);
};
