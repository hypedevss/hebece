import moment from 'moment';
import * as strings from '../strings';
import { KeyPair, PupilEnvelope, LuckyNumberEnvelope, VulcanApiResponse } from '../types';
import buildHeaders from '../utilities/buildHeaders';
import handleErrors from '../utilities/handleErrors';

export default async (keyPair:KeyPair, restUrl: string, pupil: PupilEnvelope) => {
	if (!restUrl) throw new Error('No REST URL provided!');
	if (!keyPair) throw new Error('No KEYPAIR provided!');
	if (!pupil) throw new Error('No PUPIL provided!');
	const tenant = restUrl.replace(`${strings.BASE_URL}/`, '');
	const url = `${strings.BASE_URL}/${tenant}/${pupil.Unit.Symbol}/api/mobile/school/lucky?constituentId=${pupil.ConstituentUnit.Id}&day=${moment().format('YYYY-MM-DD')}`;
	const date = new Date();
	const headers = buildHeaders(keyPair, null, date, url);
	const aab = await fetch(url, {
		method: 'GET',
		headers: headers,
	})
	// @ts-ignore
	const data:VulcanApiResponse<LuckyNumberEnvelope> = await aab.json();
	handleErrors(data);
	return data as VulcanApiResponse<LuckyNumberEnvelope>;
}