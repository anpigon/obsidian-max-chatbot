export function stripIllegalFileNameCharactersInString(text: string) {
	return text
		.trim()
		.replace(/[\\,#%&{}/*<>$":@.?|]/g, '') // 특수 문자 제거
		.replace(/\s+/g, ' ') // 공백 여러개 제거
		.replace(/^["'](.*)["']$/, '$1') // 양쪽 따옴표 제거
		.replace(/\[([^\]]+)\]\([^\\)]+\)/g, '$1'); // 마크다운 링크 제거
}
