import clsx from 'clsx';
import {FC, InputHTMLAttributes} from 'react';
import {twMerge} from 'tailwind-merge';

export type ToggleProps = InputHTMLAttributes<HTMLInputElement>;

export const Toggle: FC<ToggleProps> = ({checked, className, ...props}) => {
	return (
		<label className={twMerge(clsx('checkbox-container', {'is-enabled': checked}), className)}>
			<input type="checkbox" checked={checked} {...props} />
		</label>
	);
};
