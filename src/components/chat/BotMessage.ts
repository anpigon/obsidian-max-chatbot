import MAXPlugin from '@/main';
import {colorToHex} from '@/utils/ColorConverter';
import {displayAppendButton, displayBotCopyButton, displayBotEditButton} from './Buttons';
import {addMessage, addParagraphBreaks} from './Message';
import {MarkdownRenderer, setIcon} from 'obsidian';
import {MAXSettings} from '@/types';
import {DEFAULT_SETTINGS} from '@/constants';

export function displayBotMessage(plugin: MAXPlugin, settings: MAXSettings, messageHistory: {role: string; content: string}[], message: string) {
	const botMessageDiv = document.createElement('div');
	botMessageDiv.className = 'botMessage';

	botMessageDiv.style.backgroundColor = colorToHex(
		settings.appearance.botMessageBackgroundColor ||
			getComputedStyle(document.body).getPropertyValue(DEFAULT_SETTINGS.appearance.botMessageBackgroundColor).trim()
	);

	botMessageDiv.style.color = settings.appearance.botMessageFontColor || DEFAULT_SETTINGS.appearance.botMessageFontColor;

	const botMessageToolBarDiv = document.createElement('div');
	botMessageToolBarDiv.className = 'botMessageToolBar';

	const buttonContainerDiv = document.createElement('div');
	buttonContainerDiv.className = 'button-container';

	const botNameSpan = document.createElement('span');
	botNameSpan.textContent = settings.appearance.chatbotName || DEFAULT_SETTINGS.appearance.chatbotName;
	botNameSpan.className = 'chatbotName';

	botMessageToolBarDiv.appendChild(botNameSpan);
	botMessageToolBarDiv.appendChild(buttonContainerDiv);
	const messageBlockDiv = document.createElement('div');
	messageBlockDiv.className = 'messageBlock';

	MarkdownRenderer.render(plugin.app, message, messageBlockDiv, '', plugin);

	// Add buttons to the bot message
	if (!message.includes('commandBotMessage') && !message.includes('errorBotMessage')) {
		const editButton = displayBotEditButton(plugin, message);
		const copyBotButton = displayBotCopyButton(settings, message);
		const appendButton = displayAppendButton(plugin, settings, message);
		buttonContainerDiv.appendChild(editButton);
		buttonContainerDiv.appendChild(copyBotButton);
		buttonContainerDiv.appendChild(appendButton);

		addParagraphBreaks(messageBlockDiv);
	}

	const copyCodeBlocks = messageBlockDiv.querySelectorAll('.copy-code-button') as NodeListOf<HTMLElement>;
	copyCodeBlocks.forEach(copyCodeBlock => {
		copyCodeBlock.textContent = 'Copy';
		setIcon(copyCodeBlock, 'copy');
	});

	botMessageDiv.appendChild(botMessageToolBarDiv);
	botMessageDiv.appendChild(messageBlockDiv);

	return botMessageDiv;
}

export function displayLoadingBotMessage(settings: MAXSettings) {
	const botMessageDiv = document.createElement('div');
	botMessageDiv.className = 'botMessage';
	botMessageDiv.style.backgroundColor = colorToHex(
		settings.appearance.botMessageBackgroundColor ||
			getComputedStyle(document.body).getPropertyValue(DEFAULT_SETTINGS.appearance.botMessageBackgroundColor).trim()
	);

	botMessageDiv.style.color = settings.appearance.botMessageFontColor || DEFAULT_SETTINGS.appearance.botMessageFontColor;

	const botMessageToolBarDiv = document.createElement('div');
	botMessageToolBarDiv.className = 'botMessageToolBar';

	const botNameSpan = document.createElement('span');
	botNameSpan.textContent = settings.appearance.chatbotName || DEFAULT_SETTINGS.appearance.chatbotName;
	botNameSpan.className = 'chatbotName';

	const messageBlockDiv = document.createElement('div');
	messageBlockDiv.className = 'messageBlock';

	const loadingEl = document.createElement('span');
	loadingEl.setAttribute('id', 'loading');
	for (let i = 0; i < 3; i++) {
		const dotSpan = document.createElement('span');
		dotSpan.textContent = '.';
		loadingEl.appendChild(dotSpan);
	}

	botMessageToolBarDiv.appendChild(botNameSpan);
	botMessageDiv.appendChild(botMessageToolBarDiv);
	botMessageDiv.appendChild(messageBlockDiv);

	// Dispaly loading animation
	botMessageDiv.appendChild(loadingEl);

	return botMessageDiv;
}

export function displayCommandBotMessage(plugin: MAXPlugin, settings: MAXSettings, messageHistory: {role: string; content: string}[], message: string) {
	const botMessageDiv = document.createElement('div');
	botMessageDiv.className = 'botMessage';
	botMessageDiv.style.backgroundColor = colorToHex(
		settings.appearance.botMessageBackgroundColor ||
			getComputedStyle(document.body).getPropertyValue(DEFAULT_SETTINGS.appearance.botMessageBackgroundColor).trim()
	);

	const botMessageToolBarDiv = document.createElement('div');
	botMessageToolBarDiv.className = 'botMessageToolBar';

	const botNameSpan = document.createElement('span');
	botNameSpan.textContent = settings.appearance.chatbotName || DEFAULT_SETTINGS.appearance.chatbotName;
	botNameSpan.className = 'chatbotName';

	const messageBlockDiv = document.createElement('div');
	messageBlockDiv.className = 'messageBlock';

	const displayCommandBotMessageDiv = document.createElement('div');
	displayCommandBotMessageDiv.className = 'commandBotMessage';
	displayCommandBotMessageDiv.innerHTML = message;

	messageBlockDiv.appendChild(displayCommandBotMessageDiv);
	botMessageToolBarDiv.appendChild(botNameSpan);
	botMessageDiv.appendChild(botMessageToolBarDiv);
	botMessageDiv.appendChild(messageBlockDiv);

	const index = messageHistory.length - 1;

	addMessage(plugin, messageBlockDiv.innerHTML, 'botMessage', settings, index);

	return botMessageDiv;
}

export function displayErrorBotMessage(
	this: any,
	plugin: MAXPlugin,
	settings: MAXSettings,
	messageHistory: {role: string; content: string}[],
	message: string
) {
	const botMessageDiv = document.createElement('div');
	botMessageDiv.className = 'botMessage';
	botMessageDiv.style.backgroundColor = colorToHex(
		settings.appearance.botMessageBackgroundColor ||
			getComputedStyle(document.body).getPropertyValue(DEFAULT_SETTINGS.appearance.botMessageBackgroundColor).trim()
	);

	const botMessageToolBarDiv = document.createElement('div');
	botMessageToolBarDiv.className = 'botMessageToolBar';

	const botNameSpan = document.createElement('span');
	botNameSpan.textContent = settings.appearance.chatbotName || DEFAULT_SETTINGS.appearance.chatbotName;
	botNameSpan.className = 'chatbotName';

	const messageBlockDiv = document.createElement('div');
	messageBlockDiv.className = 'messageBlock';

	const displayErrorBotMessageDiv = document.createElement('div');
	displayErrorBotMessageDiv.className = 'errorBotMessage';

	const BotP = document.createElement('p');
	BotP.textContent = message;

	console.error(message);

	messageBlockDiv.appendChild(displayErrorBotMessageDiv);
	displayErrorBotMessageDiv.appendChild(BotP);
	botMessageToolBarDiv.appendChild(botNameSpan);
	botMessageDiv.appendChild(botMessageToolBarDiv);
	botMessageDiv.appendChild(messageBlockDiv);

	const index = messageHistory.length - 1;

	addMessage(plugin, messageBlockDiv.innerHTML, 'botMessage', this.settings!, index);

	return botMessageDiv;
}
