import {FC, InputHTMLAttributes} from 'react';
import {twMerge} from 'tailwind-merge';

export type SearchProps = InputHTMLAttributes<HTMLInputElement>;

export const Search: FC<SearchProps> = ({className, ...props}) => {
	return (
		<div className={twMerge('search-input-container', className)}>
			<input type="search" spellCheck={false} enterKeyHint="search" {...props} />
			<div className="search-input-clear-button" />
		</div>
	);
};
