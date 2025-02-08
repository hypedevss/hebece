import * as strings from '../strings';
import { Grade } from '.'
import { KeyPair, PupilEnvelope } from '../types';
import buildHeaders from '../utilities/buildHeaders';
import handleErrors from '../utilities/handleErrors';
export default async (keyPair:KeyPair, restUrl: string, pupil: PupilEnvelope) => {
	if (!restUrl) throw new Error('No REST URL provided!');
	if (!keyPair) throw new Error('No KEYPAIR provided!');
	if (!pupil) throw new Error('No PUPIL provided!');
	const tenant = restUrl.replace(`${strings.BASE_URL}/`, '');
	const currentPeriod = pupil.Periods.find(p => p.Current === true);
	const url = `${strings.BASE_URL}/${tenant}/${pupil.Unit.Symbol}/api/mobile/grade/byPupil?unitId=${pupil.Unit.Id}&pupilId=${pupil.Pupil.Id}&periodId=${currentPeriod.Id}&pageSize=100`;
	const date = new Date();
	const headers = buildHeaders(keyPair, null, date, url);
	const aab = await fetch(url, {
		method: 'GET',
		headers: headers,
	})
	// @ts-ignore
	const data:Grade = await aab.json();
	handleErrors(data);
	return data as Grade;
}