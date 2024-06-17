// import crypto from 'crypto';

export async function hashString(inputString: string): Promise<string> {
	// return crypto.createHash('sha1').update(inputString, 'utf-8').digest('hex');
	const encoder = new TextEncoder();
	const data = encoder.encode(inputString);
	const hashBuffer = await window.crypto.subtle.digest('SHA-256', data); // hash the message
	const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
	const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
	return hashHex;
}
