import * as signer from './signer';
import * as crypto from 'crypto';
import * as moment from 'moment';
import * as strings from '../strings';
import { KeyPair } from '../types';
import { Pupil } from '../types';
import buildHeaders from '../utilities/buildHeaders';
import handleErrors from '../utilities/handleErrors';

export default  async (keyPair:KeyPair, restUrl: string) => {
	if (!restUrl) throw new Error('No REST URL provided!');
	if (!keyPair) throw new Error('No KEYPAIR provided!');
	const tenant = restUrl.replace(`${strings.BASE_URL}/`, '');
	const url = `${strings.BASE_URL}/${tenant}/api/mobile/register/hebe?mode=2`;
	const date = new Date();
	const headers = buildHeaders(keyPair, null, date, url);
	const aab = await fetch(url, {
		method: 'GET',
		headers: headers,
	});
	// @ts-expect-error
	const data:Pupil = await aab.json();
	handleErrors(data);
	return data as Pupil;
};