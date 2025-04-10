import * as strings from '../strings';
import { KeyPair } from '../types';
import { VulcanApiResponse, PupilEnvelope } from '../types';
import buildHeaders from '../utilities/buildHeaders';
import handleErrors from '../utilities/handleErrors';

export default  async (keyPair:KeyPair, restUrl: string) => {
	if (!restUrl) throw new Error('No REST URL provided!');
	if (!keyPair) throw new Error('No KEYPAIR provided!');
	const url = `${restUrl}/api/mobile/register/hebe?mode=2`;
	const date = new Date();
	const headers = buildHeaders(keyPair, null, date, url);
	const aab = await fetch(url, {
		method: 'GET',
		headers: headers,
	});
	const data:VulcanApiResponse<Array<PupilEnvelope>> = await aab.json();
	handleErrors(data);
	return data as VulcanApiResponse<Array<PupilEnvelope>>;
};