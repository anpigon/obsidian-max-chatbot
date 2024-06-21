import React, {SelectHTMLAttributes, forwardRef} from 'react';
import clsx from 'clsx';

type DropdownProps = SelectHTMLAttributes<HTMLSelectElement>;

export const Dropdown = forwardRef<HTMLSelectElement, DropdownProps>(({children, className, ...props}, ref) => {
	return (
		<select {...props} ref={ref} className={clsx('dropdown', className)}>
			{children}
		</select>
	);
});

Dropdown.displayName = 'Dropdown';

export const Option: React.FC<React.DetailedHTMLProps<React.OptionHTMLAttributes<HTMLOptionElement>, HTMLOptionElement>> = ({children, ...props}) => {
	return <option {...props}>{children}</option>;
};
