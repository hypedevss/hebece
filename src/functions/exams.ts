import moment from 'moment';
import * as strings from '../strings';
import { KeyPair } from '../types';
import { Pupil } from '../types';
import { Exam } from '.';
import buildHeaders from '../utilities/buildHeaders';
import handleErrors from '../utilities/handleErrors';
export default async (keyPair:KeyPair, restUrl: string, pupil:Pupil, dateFrom: Date, dateTo: Date) => {
	if (!restUrl) throw new Error('No REST URL provided!');
	if (!keyPair) throw new Error('No KEYPAIR provided!');
	if (!pupil) throw new Error('No PUPIL provided!');
	const tenant = restUrl.replace(`${strings.BASE_URL}/`, '');
	const url = `${strings.BASE_URL}/${tenant}/${pupil.Envelope[0].Unit.Symbol}/api/mobile/exam/byPupil?unitId=${pupil.Envelope[0].Unit.Id}&pupilId=${pupil.Envelope[0].Pupil.Id}&dateFrom=${moment(dateFrom).format('YYYY-MM-DD')}&dateTo=${moment(dateTo).format('YYYY-MM-DD')}&pageSize=100`;
	const date = new Date();
	const headers = buildHeaders(keyPair, null, date, url);
	const aab = await fetch(url, {
		method: 'GET',
		headers: headers,
	})
	// @ts-ignore
	const data:Exam = await aab.json();
	handleErrors(data);
	return data as Exam
}