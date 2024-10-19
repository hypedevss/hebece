import { createSign, createHash } from 'crypto';

function getDigest(body: any) {
	if (body == null) return "";

	return createHash('SHA256')
		.update(body)
		.digest("base64");
}

function getSignatureValue(values:any, pkey:any) {
	return createSign('RSA-SHA256')
		.update(values)
		.sign("-----BEGIN PRIVATE KEY-----\n" + pkey + "\n-----END PRIVATE KEY-----", "base64");
}

function getEncodedPath(path:any) {
	const url = path.match("(api/mobile/.+)");
	if (url == null) throw new Error('The URL does not seem correct (does not match `(api/mobile/.+)` regex)');

	return encodeURIComponent(url[0]).toLowerCase();
}

function getHeadersList(body:any, digest:any, canonicalUrl:any, timestamp:any) {
	const signData = [
		['vCanonicalUrl', canonicalUrl],
		body == null ? null : ['Digest', digest],
		['vDate', typeof timestamp === 'string' ? timestamp : new Date(timestamp + 1000).toUTCString()],
	].filter(item => !!item);

	return {
		"headers": signData.map(item => item[0]).join(" "),
		"values": signData.map(item => item[1]).join(""),
	};
}

function sign(fingerprint:string, privateKey:string, body:string, requestPath:string, timestamp:number | string) {
	const canonicalUrl = getEncodedPath(requestPath);
	const digest = getDigest(body);
	const { headers, values } = getHeadersList(body, digest, canonicalUrl, timestamp);
	const signatureValue = getSignatureValue(values, privateKey);

	return {
		"digest": `SHA-256=${digest}`,
		"canonicalUrl": canonicalUrl,
		"signature": `keyId="${fingerprint}",headers="${headers}",algorithm="sha256withrsa",signature=Base64(sha256withrsa(${signatureValue}))`,
	};
}

export { sign };