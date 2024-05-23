import clsx from 'clsx';
import {DetailedHTMLProps, InputHTMLAttributes} from 'react';

export const Toggle: React.FC<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>> = ({checked, ...props}) => {
	return (
		<label className={clsx('checkbox-container', {'is-enabled': checked})}>
			<input type="checkbox" checked={checked} {...props} />
		</label>
	);
};
