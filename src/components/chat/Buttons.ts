/* eslint-disable @typescript-eslint/no-explicit-any */
import {ANTHROPIC_MODELS, OPEN_AI_MODELS} from '@/constants';
// Start of Selection
import MAXPlugin, {currentActiveFile} from '@/main';
import {MAXSettings} from '@/types';
import {filenameMessageHistoryJSON} from '@/views/chatbot-view';
import {MarkdownRenderer, Modal, Notice, setIcon} from 'obsidian';
import {
	fetchAnthropicResponse,
	fetchGoogleGeminiResponse,
	fetchMistralResponse,
	fetchMistralResponseStream,
	fetchOllamaResponse,
	fetchOllamaResponseStream,
	fetchOpenAIAPIResponse,
	fetchOpenAIAPIResponseStream,
	fetchOpenRouterResponse,
	fetchOpenRouterResponseStream,
	fetchRESTAPIURLResponse,
	fetchRESTAPIURLResponseStream,
} from '../FetchModelResponse';
import {getActiveFileContent} from '../editor/ReferenceCurrentNote';

export function regenerateUserButton(plugin: MAXPlugin, settings: MAXSettings) {
	const regenerateButton = document.createElement('button');
	regenerateButton.textContent = 'regenerate';
	setIcon(regenerateButton, 'refresh-ccw');
	regenerateButton.classList.add('regenerate-button');
	regenerateButton.title = 'regenerate';

	let lastClickedElement: HTMLElement | null = null;

	regenerateButton.addEventListener('click', async function (event) {
		event.stopPropagation();
		lastClickedElement = event.target as HTMLElement;

		while (lastClickedElement && !lastClickedElement.classList.contains('userMessage')) {
			lastClickedElement = lastClickedElement.parentElement;
		}

		let index = -1;

		if (lastClickedElement) {
			const userMessages = Array.from(document.querySelectorAll('#messageContainer .userMessage'));
			index = userMessages.indexOf(lastClickedElement) * 2;
		}

		if (index !== -1) {
			deleteMessage(plugin, index + 1);
			if (OPEN_AI_MODELS.includes(settings.general.model) || settings.providers.OPEN_AI.models.includes(settings.general.model)) {
				try {
					if (settings.providers.OPEN_AI.allowStream) {
						await fetchOpenAIAPIResponseStream(plugin, settings, index);
					} else {
						await fetchOpenAIAPIResponse(plugin, settings, index);
					}
				} catch (error: any) {
					new Notice(`Error occurred while fetching completion: ${error.message}`);
					console.log(error.message);
				}
			} else if (settings.providers.OLLAMA.baseUrl && settings.providers.OLLAMA.models.includes(settings.general.model)) {
				if (settings.providers.OLLAMA.allowStream) {
					await fetchOllamaResponseStream(plugin, settings, index);
				} else {
					await fetchOllamaResponse(plugin, settings, index);
				}
			} else if (settings.providers.REST_API.models.includes(settings.general.model)) {
				if (settings.providers.REST_API.allowStream) {
					await fetchRESTAPIURLResponseStream(plugin, settings, index);
				} else {
					await fetchRESTAPIURLResponse(plugin, settings, index);
				}
			} else if (settings.providers.OPEN_ROUTER.models.includes(settings.general.model)) {
				if (settings.providers.OPEN_ROUTER.allowStream) {
					await fetchOpenRouterResponseStream(plugin, settings, index);
				} else {
					await fetchOpenRouterResponse(plugin, settings, index);
				}
			} else if (settings.providers.MISTRAL.models.includes(settings.general.model)) {
				try {
					if (settings.providers.MISTRAL.allowStream) {
						await fetchMistralResponseStream(plugin, settings, index);
					} else {
						await fetchMistralResponse(plugin, settings, index);
					}
				} catch (error) {
					console.error('Mistral Error:', error);
				}
			} else if (settings.providers.GOOGLE_GEMINI.models.includes(settings.general.model)) {
				try {
					await fetchGoogleGeminiResponse(plugin, settings, index);
				} catch (error) {
					console.error('Google Gemini Error:', error);
				}
			} else if (ANTHROPIC_MODELS.includes(settings.general.model)) {
				try {
					await fetchAnthropicResponse(plugin, settings, index);
				} catch (error) {
					console.error('Anthropic Error:', error);
				}
			}
		} else {
			new Notice('No models detected.');
		}
	});
	return regenerateButton;
}

export function displayUserEditButton(plugin: MAXPlugin, settings: MAXSettings, userPre: HTMLPreElement) {
	const editButton = document.createElement('button');
	editButton.textContent = 'edit';
	setIcon(editButton, 'edit'); // Assuming setIcon is defined elsewhere
	editButton.classList.add('edit-button');
	editButton.title = 'edit';

	let lastClickedElement: HTMLElement | null = null;

	editButton.addEventListener('click', function (event) {
		const editContainer = document.createElement('div');
		editContainer.classList.add('edit-container');
		const textArea = document.createElement('textarea');
		textArea.classList.add('edit-textarea');
		textArea.value = userPre.textContent ?? ''; // Check if userP.textContent is null and provide a default value

		editContainer.appendChild(textArea);

		const textareaEditButton = document.createElement('button');
		textareaEditButton.textContent = 'Edit';
		textareaEditButton.classList.add('textarea-edit-button');
		textareaEditButton.title = 'edit';

		const cancelButton = document.createElement('button');
		cancelButton.textContent = 'Cancel';
		cancelButton.classList.add('textarea-cancel-button');
		cancelButton.title = 'cancel';

		event.stopPropagation();
		lastClickedElement = event.target as HTMLElement;

		while (lastClickedElement && !lastClickedElement.classList.contains('userMessage')) {
			lastClickedElement = lastClickedElement.parentElement;
		}

		textareaEditButton.addEventListener('click', async function () {
			userPre.textContent = textArea.value.trim();
			editContainer.replaceWith(userPre);

			if (lastClickedElement) {
				const userMessages = Array.from(document.querySelectorAll('#messageContainer .userMessage'));

				const index = userMessages.indexOf(lastClickedElement) * 2;

				if (index !== -1) {
					messageHistory[index].content = textArea.value.trim();
					deleteMessage(plugin, index + 1);

					if (settings.providers.OLLAMA.baseUrl && settings.providers.OLLAMA.models.includes(settings.general.model)) {
						if (settings.providers.OLLAMA.allowStream) {
							await fetchOllamaResponseStream(plugin, settings, index);
						} else {
							await fetchOllamaResponse(plugin, settings, index);
						}
					} else if (settings.providers.REST_API.models.includes(settings.general.model)) {
						if (settings.providers.REST_API.allowStream) {
							await fetchRESTAPIURLResponseStream(plugin, settings, index);
						} else {
							await fetchRESTAPIURLResponse(plugin, settings, index);
						}
					} else if (ANTHROPIC_MODELS.includes(settings.general.model)) {
						try {
							await fetchAnthropicResponse(plugin, settings, index);
						} catch (error) {
							console.error('Anthropic Error:', error);
						}
					} else if (settings.providers.GOOGLE_GEMINI.models.includes(settings.general.model)) {
						try {
							await fetchGoogleGeminiResponse(plugin, settings, index);
						} catch (error) {
							console.error('Google GeminiError:', error);
						}
					} else if (settings.providers.MISTRAL.models.includes(settings.general.model)) {
						try {
							if (settings.providers.MISTRAL.allowStream) {
								await fetchMistralResponseStream(plugin, settings, index);
							} else {
								await fetchMistralResponse(plugin, settings, index);
							}
						} catch (error) {
							console.error('Mistral Error:', error);
						}
					} else if (OPEN_AI_MODELS.includes(settings.general.model) || settings.providers.OPEN_AI.models.includes(settings.general.model)) {
						try {
							if (settings.providers.OPEN_AI.allowStream) {
								await fetchOpenAIAPIResponseStream(plugin, settings, index);
							} else {
								await fetchOpenAIAPIResponse(plugin, settings, index);
							}
						} catch (error: any) {
							new Notice(`Error occurred while fetching completion: ${error.message}`);
							console.log(error.message);
						}
					} else if (settings.providers.OPEN_ROUTER.models.includes(settings.general.model)) {
						if (settings.providers.OPEN_ROUTER.allowStream) {
							await fetchOpenRouterResponseStream(plugin, settings, index);
						} else {
							await fetchOpenRouterResponse(plugin, settings, index);
						}
					}
				} else {
					new Notice('No models detected.');
				}
			}
		});

		cancelButton.addEventListener('click', function () {
			editContainer.replaceWith(userPre);
		});

		editContainer.appendChild(textareaEditButton);
		editContainer.appendChild(cancelButton);

		if (userPre.parentNode !== null) {
			userPre.parentNode.replaceChild(editContainer, userPre);
		}
	});

	return editButton;
}

export function displayBotEditButton(plugin: MAXPlugin, message: string) {
	const editButton = document.createElement('button');
	editButton.textContent = 'edit';
	setIcon(editButton, 'edit');
	editButton.classList.add('edit-button');
	editButton.title = 'edit';

	let lastClickedElement: HTMLElement | null = null;

	editButton.addEventListener('click', function (event) {
		const editContainer = document.createElement('div');
		editContainer.classList.add('edit-container');
		const textArea = document.createElement('textarea');
		textArea.classList.add('edit-textarea');

		// Insert current bot message into the textarea.
		textArea.value = message;

		const textareaEditButton = document.createElement('button');
		textareaEditButton.textContent = 'Edit';
		textareaEditButton.classList.add('textarea-edit-button');
		textareaEditButton.title = 'edit';

		const cancelButton = document.createElement('button');
		cancelButton.textContent = 'Cancel';
		cancelButton.classList.add('textarea-cancel-button');
		cancelButton.title = 'cancel';

		editContainer.appendChild(textArea);

		event.stopPropagation();
		lastClickedElement = event.target as HTMLElement;

		while (lastClickedElement && !lastClickedElement.classList.contains('botMessage')) {
			lastClickedElement = lastClickedElement.parentElement;
		}

		let messageBlock = lastClickedElement?.querySelector('.messageBlock');
		if (messageBlock) {
			messageBlock.innerHTML = '';
			messageBlock.appendChild(editContainer);
		} else {
			console.log('messageBlock not found.');
		}

		textareaEditButton.addEventListener('click', async function () {
			message = textArea.value;
			editContainer.remove();
			messageBlock?.remove();
			messageBlock = document.createElement('div');
			messageBlock.className = 'messageBlock';
			lastClickedElement?.appendChild(messageBlock);

			await MarkdownRenderer.render(plugin.app, message, messageBlock as HTMLElement, '/', plugin);

			const copyCodeBlocks = messageBlock.querySelectorAll('.copy-code-button');
			copyCodeBlocks.forEach(copyCodeBlock => {
				copyCodeBlock.textContent = 'Copy';
				setIcon(copyCodeBlock, 'copy');
			});

			if (lastClickedElement) {
				const allMessages = Array.from(document.querySelectorAll('#messageContainer div.userMessage, #messageContainer div.botMessage'));
				const index = allMessages.indexOf(lastClickedElement);

				if (index !== -1) {
					messageHistory[index].content = textArea.value;

					const jsonString = JSON.stringify(messageHistory, null, 4);

					try {
						await plugin.app.vault.adapter.write(filenameMessageHistoryJSON(plugin), jsonString);
					} catch (error) {
						console.error('Error writing to message history file:', error);
					}
				} else {
					new Notice('No models detected.');
				}
			}
		});

		cancelButton.addEventListener('click', async function () {
			editContainer.remove();
			messageBlock?.remove();
			messageBlock = document.createElement('div');
			messageBlock.className = 'messageBlock';
			lastClickedElement?.appendChild(messageBlock);

			await MarkdownRenderer.render(plugin.app, message, messageBlock as HTMLElement, '/', plugin);

			const copyCodeBlocks = messageBlock.querySelectorAll('.copy-code-button');
			copyCodeBlocks.forEach(copyCodeBlock => {
				copyCodeBlock.textContent = 'Copy';
				setIcon(copyCodeBlock, 'copy');
			});
		});

		editContainer.appendChild(textareaEditButton);
		editContainer.appendChild(cancelButton);

		// if (messageBlock !== null) {
		//     messageBlock?.replaceChild(editContainer, messageBlock);
		// }
	});

	return editButton;
}

export function displayUserCopyButton(userPre: HTMLPreElement) {
	const copyButton = document.createElement('button');
	copyButton.textContent = 'copy';
	setIcon(copyButton, 'copy');
	copyButton.classList.add('copy-button');
	copyButton.title = 'copy';

	copyButton.addEventListener('click', function () {
		const messageText = userPre.textContent;

		if (messageText !== null) {
			copyMessageToClipboard(messageText);
			new Notice('Copied user message.');
		} else {
			console.error('Message content is null. Cannot copy.');
		}
	});
	return copyButton;
}

export function displayBotCopyButton(settings: MAXSettings, message: string) {
	const copyButton = document.createElement('button');
	copyButton.textContent = 'copy';
	setIcon(copyButton, 'copy');
	copyButton.classList.add('copy-button');
	copyButton.title = 'copy';

	copyButton.addEventListener('click', function () {
		if (message !== null) {
			copyMessageToClipboard(message);
			new Notice('Copied bot message.');
		} else {
			console.error('Message content is null. Cannot copy.');
		}
	});
	return copyButton;
}

export function copyMessageToClipboard(message: string) {
	navigator.clipboard
		.writeText(message)
		.then(function () {})
		.catch(function (err) {
			console.error('Unable to copy message: ', err);
		});
}

// Append button to editor
export function displayAppendButton(plugin: MAXPlugin, settings: MAXSettings, message: string) {
	const appendButton = document.createElement('button');
	appendButton.textContent = 'append';
	setIcon(appendButton, 'plus-square');
	appendButton.classList.add('append-button');
	appendButton.title = 'append';

	const messageText = message;

	appendButton.addEventListener('click', async function (event) {
		if (currentActiveFile?.extension === 'md') {
			// Check if the active file is different from the file of the last cursor position
			if (currentActiveFile !== lastCursorPositionFile) {
				// Append to the bottom of the file
				getActiveFileContent(plugin, settings);
				const existingContent = await plugin.app.vault.read(currentActiveFile);
				const updatedContent = `${existingContent}\n${messageText}`;
				plugin.app.vault.modify(currentActiveFile, updatedContent);
			} else {
				// Append at the last cursor position
				activeEditor?.replaceRange(messageText, lastCursorPosition);
			}

			event.stopPropagation();
			new Notice('Appended response.');
		} else {
			new Notice('No active Markdown file detected.');
		}
	});

	return appendButton;
}

export function displayTrashButton(plugin: MAXPlugin) {
	const trashButton = document.createElement('button');
	trashButton.textContent = 'trash';
	setIcon(trashButton, 'trash');
	trashButton.classList.add('trash-button');
	trashButton.title = 'trash';

	let lastClickedElement: HTMLElement | null = null;

	trashButton.addEventListener('click', function (event) {
		event.stopPropagation();
		lastClickedElement = event.target as HTMLElement;

		while (lastClickedElement && !lastClickedElement.classList.contains('userMessage')) {
			lastClickedElement = lastClickedElement.parentElement;
		}

		if (lastClickedElement) {
			const userMessages = Array.from(document.querySelectorAll('#messageContainer .userMessage'));

			const index = userMessages.indexOf(lastClickedElement) * 2;

			if (index !== -1) {
				const modal = new Modal(plugin.app);

				modal.contentEl.innerHTML = `
                <div class="modal-content">
                    <h2>Delete Message Block.</h2>
                    <p>Are you sure you want to delete this message block?</p>
                    <button id="confirmDelete">Confirm Delete</button>
                </div>
                `;

				const confirmDeleteButton = modal.contentEl.querySelector('#confirmDelete');
				confirmDeleteButton?.addEventListener('click', () => {
					deleteMessage(plugin, index);
					new Notice('Message deleted.');
					// hideAllDropdowns();
					modal.close();
				});

				modal.open();
			}
		}
	});
	return trashButton;
}

export async function deleteMessage(plugin: MAXPlugin, index: number) {
	const messageContainer = document.querySelector('#messageContainer');

	const divElements = messageContainer?.querySelectorAll('div.botMessage, div.userMessage');

	if (divElements && divElements.length > 0 && index >= 0 && index < divElements.length) {
		// Remove the specified message and the next one if it exists
		messageContainer?.removeChild(divElements[index]);
		// Check if the next message is from the assistant and remove it if it is
		if (index + 1 < divElements.length) {
			const nextMessage = divElements[index + 1];
			if (nextMessage.classList.contains('botMessage')) {
				messageContainer?.removeChild(nextMessage);
			}
		}
	}

	// Update the messageHistory by removing the specified index and potentially the next one
	if (messageHistory[index + 1] && messageHistory[index + 1].role === 'assistant') {
		messageHistory.splice(index, 2);
	} else {
		messageHistory.splice(index, 1);
	}

	const jsonString = JSON.stringify(messageHistory, null, 4);

	try {
		await plugin.app.vault.adapter.write(filenameMessageHistoryJSON(plugin), jsonString);
	} catch (error) {
		console.error('Error writing messageHistory.json', error);
	}
}
