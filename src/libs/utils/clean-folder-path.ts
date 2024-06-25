export const cleanFolderPath = (path: string) => {
	return path.replace(/\/+$/, ''); // 끝에 '/'가 있으면 제거
};
