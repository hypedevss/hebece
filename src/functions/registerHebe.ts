import * as signer from './signer';
import * as crypto from 'crypto';
import * as moment from 'moment';
import * as strings from '../strings';
import { KeyPair } from '../types';
import { Pupil } from '../types';
export default  async (keyPair:KeyPair, restUrl: string) => {
	if (!restUrl) throw new Error('No REST URL provided!');
	if (!keyPair) throw new Error('No KEYPAIR provided!');
	const tenant = restUrl.replace(`${strings.BASE_URL}/`, '');
	const url = `${strings.BASE_URL}/${tenant}/api/mobile/register/hebe?mode=2`;
	const date = new Date();
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
	const signature = signer.sign(keyPair.fingerprint, keyPair.privateKey, null, url, dateUTC);
	headers['signature'] = signature.signature;
	headers['vcanonicalurl'] = signature.canonicalUrl;
	const aab = await fetch(url, {
		method: 'GET',
		headers: headers,
	});

	const data = await aab.json();
	
	return data as Pupil;
};