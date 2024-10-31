import { useTranslation } from "react-i18next";
import { memo } from "react";

import {Toggle} from '@/components/form/toggle';

// eslint-disable-next-line no-unused-vars
type ReferenceToggleProps = {checked: boolean; onChange: (checked: boolean) => void}

const ReferenceToggle = memo(({checked, onChange}: ReferenceToggleProps) => {
	const {t} = useTranslation('chatbot');

	return (
		<label className="flex items-center font-ui-smaller text-[var(--text-faint)]">
			<Toggle checked={checked} onChange={e => onChange(e.target.checked)} className="scale-50 mx-[-5px]" />
			{t('Refer to the current note')}
		</label>
	);
});

ReferenceToggle.displayName = 'ReferenceToggle';

export default ReferenceToggle;
