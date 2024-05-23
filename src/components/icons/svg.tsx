import {twMerge} from 'tailwind-merge';

export const Svg: React.FC<React.SVGProps<SVGSVGElement>> = ({children, className, ...props}) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={twMerge('h-[var(--icon-size)] w-[var(--icon-size)] stroke-width-[var(--icon-stroke)]', className)}
			{...props}
		>
			{children}
		</svg>
	);
};
