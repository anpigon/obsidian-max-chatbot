import {twMerge} from 'tailwind-merge';
import {getIcon} from 'obsidian';
import {SVGProps} from 'react';

export interface IconProps extends SVGProps<SVGSVGElement> {
	name: string; // https://lucide.dev/
}

export const Icon: React.FC<IconProps> = ({name, className, ...rest}) => {
	const icon = getIcon(name);
	if (!icon) {
		console.error('Icon not found:', name);
		return null;
	}

	// Serialize the SVG element to a string
	const svgString = new XMLSerializer().serializeToString(icon);

	// @ts-ignore
	return <span key={name} dangerouslySetInnerHTML={{__html: svgString}} className={twMerge('flex', className)} {...rest} />;
};
