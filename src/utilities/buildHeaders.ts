import { KeyPair } from '../types';
import * as strings from "../strings";
import * as signer from "../functions/signer";
export default (keypair: KeyPair, body_raw: any | null, date: Date, url: string) => {
	if (!keypair) throw new Error('No KEYPAIR provided!');
	if (!date) throw new Error('No DATE provided!');
	if (!url) throw new Error('No URL provided!');
	const dateUTC = date.toUTCString();
	const headers = {
		'accept': '*/*',
		'accept-charset': 'UTF-8',
		'accept-encoding': 'gzip',
		'connection': 'Keep-Alive',
		'content-type': 'application/json',
		'host': 'lekcjaplus.vulcan.net.pl',
		'user-agent': strings.USER_AGENT,
		'vapi': strings.VAPI,
		'vdate': dateUTC,
		'vdevicemodel': strings.DEVICE_MODEL,
		'vos': strings.OPERATING_SYSTEM,
		'vversioncode': strings.VERSION_CODE,
	};
	let body = null
	if (body_raw !== null) {
		body = JSON.stringify(body_raw);
	}
	const signature = signer.sign(keypair.fingerprint, keypair.privateKey, body, url, dateUTC);
	headers['signature'] = signature.signature;
	headers['vcanonicalurl'] = signature.canonicalUrl;
	if (signature.digest !== "SHA256=") {
		headers['digest'] = signature.digest;
	}

	return headers
};