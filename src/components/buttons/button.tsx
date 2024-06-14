import type {PropsWithChildren, FC, ReactHTMLElement, ButtonHTMLAttributes} from 'react';

type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

export const Button: FC<ButtonProps> = ({children, ...props}) => {
	return (
		<button type="button" {...props}>
			{children}
		</button>
	);
};
