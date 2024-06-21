import type {ButtonHTMLAttributes, FC, PropsWithChildren} from 'react';

type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

export const Button: FC<ButtonProps> = ({children, ...props}) => {
	return (
		<button type="button" {...props}>
			{children}
		</button>
	);
};
