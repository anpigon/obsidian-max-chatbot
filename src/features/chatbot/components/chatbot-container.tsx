import {PropsWithChildren} from 'react';

export const ChatbotContainer: React.FC<PropsWithChildren> = ({children}) => {
	return (
		<div className="h-screen max-h-[97%] relative rounded-md border border-solid border-[var(--hr-color)] break-words flex flex-col max-w-[800px] mx-auto">
			{children}
		</div>
	);
};
