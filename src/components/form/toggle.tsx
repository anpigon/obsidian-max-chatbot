import clsx from 'clsx';
import {InputHTMLAttributes, PropsWithChildren} from 'react';
import {twMerge} from 'tailwind-merge';

export type ToggleProps = InputHTMLAttributes<HTMLInputElement>;

export const Toggle: React.FC<ToggleProps> = ({checked, className, ...props}) => {
	return (
		<label className={twMerge(clsx('checkbox-container', {'is-enabled': checked}), className)}>
			<input type="checkbox" checked={checked} {...props} />
		</label>
	);
};
