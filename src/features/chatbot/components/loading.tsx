import {twMerge} from 'tailwind-merge';

import type {HTMLAttributes} from 'react';

export const Loading = ({className, ...props}: HTMLAttributes<HTMLDivElement>) => {
	return (
		<div
			className={twMerge(
				'inline-block text-white bg-gray-300  dark:bg-gray-500 rounded-md overflow-hidden text-2xl leading-6 font-bold mt-1 pt-0 pb-1 px-3 w-fit',
				className
			)}
			{...props}
		>
			<span className="animate-blink">.</span>
			<span className="animate-blink" style={{animationDelay: '0.2s'}}>
				.
			</span>
			<span className="animate-blink" style={{animationDelay: '0.2s'}}>
				.
			</span>
		</div>
	);
};
