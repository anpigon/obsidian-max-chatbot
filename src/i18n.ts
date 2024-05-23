import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

import en from './locales/en.json';
import ko from './locales/ko.json';

const resources = {
	en,
	ko,
};

i18n.use(initReactI18next).init({
	resources,
	lng: window.moment().locale(),
	supportedLngs: Object.keys(resources),
	fallbackLng: 'en',
	interpolation: {
		escapeValue: false, // react already safes from xss
	},
	react: {
		transEmptyNodeValue: '',
		transSupportBasicHtmlNodes: true,
		transKeepBasicHtmlNodesFor: ['br', 'strong', 'b', 'i', 'u', 'span', 'div', 'a', 'code'],
	},
});

export default i18n;
