import {InputHTMLAttributes, forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';
import {twMerge} from 'tailwind-merge';

import type {ChangeEvent, FormEvent} from 'react';

export interface SearchProps extends InputHTMLAttributes<HTMLInputElement> {
	// eslint-disable-next-line no-unused-vars
	onSearch?: (element: HTMLInputElement) => void;
}

export const Search = forwardRef<HTMLInputElement, SearchProps>(({className, value, onInput, onChange, onSearch, ...props}, ref) => {
	const internalRef = useRef<HTMLInputElement>(null);
	const [internalValue, setInternalValue] = useState(value);

	useEffect(() => {
		setInternalValue(value);
	}, [value]);

	useImperativeHandle(ref, () => internalRef.current!);

	useEffect(() => {
		if (onSearch && internalRef.current) {
			onSearch(internalRef.current);
		}
	}, [onSearch, internalRef.current]);

	const handleClear = () => {
		setInternalValue('');
		if (internalRef.current) {
			internalRef.current.value = '';
			internalRef.current.focus();
		}
	};

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setInternalValue(event.target.value);
		if (onChange) {
			onChange(event);
		}
	};

	const handleInput = (event: FormEvent<HTMLInputElement>) => {
		setInternalValue(event.currentTarget.value);
		if (onInput) {
			onInput(event);
		}
	};

	return (
		<div className={twMerge('search-input-container', className)}>
			<input
				type="search"
				spellCheck={false}
				enterKeyHint="search"
				value={internalValue}
				onChange={handleChange}
				onInput={handleInput}
				{...props}
				ref={internalRef}
			/>
			<div role="button" aria-label="reset" className="search-input-clear-button" onClick={handleClear} />
		</div>
	);
});

Search.displayName = 'Search';
