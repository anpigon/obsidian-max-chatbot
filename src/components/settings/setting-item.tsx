import {FC, PropsWithChildren, ReactNode} from 'react';
import {twMerge} from 'tailwind-merge';

interface SettingItemProps extends PropsWithChildren {
	as?: ReactNode;
	className?: string;
	heading?: boolean;
	name: ReactNode;
	description?: ReactNode;
}

export const SettingItem: FC<SettingItemProps> = ({as = 'div', className, heading = false, name, description, children}) => {
	// eslint-disable-next-line no-undef
	const Container = as as keyof JSX.IntrinsicElements;

	return (
		<Container className={twMerge('setting-item', heading && 'setting-item-heading', className)}>
			<div className="setting-item-info">
				<div className="setting-item-name">{name}</div>
				{description && <div className="setting-item-description">{description}</div>}
			</div>
			<div className="setting-item-control">{children}</div>
		</Container>
	);
};
