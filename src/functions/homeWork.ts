import moment from 'moment';
import * as strings from '../strings';
import { Homework } from '.'
import { KeyPair } from '../types';
import { Pupil } from '../types';
import buildHeaders from '../utilities/buildHeaders';
import handleErrors from '../utilities/handleErrors';
export default async (keyPair:KeyPair, restUrl: string, pupil:Pupil, dateFrom: Date, dateTo: Date) => {
	if (!restUrl) throw new Error('No REST URL provided!');
	if (!keyPair) throw new Error('No KEYPAIR provided!');
	if (!pupil) throw new Error('No PUPIL provided!');
	const tenant = restUrl.replace(`${strings.BASE_URL}/`, '');
	const url = `${strings.BASE_URL}/${tenant}/${pupil.Envelope[0].Unit.Symbol}/api/mobile/homework/byPupil?unitId=${pupil.Envelope[0].Unit.Id}&pupilId=${pupil.Envelope[0].Pupil.Id}&dateFrom=${moment(dateFrom).format('YYYY-MM-DD')}&dateTo=${moment(dateTo).format('YYYY-MM-DD')}&pageSize=100`;
	const date = new Date();
	const headers = buildHeaders(keyPair, null, date, url);
	// @ts-ignore
	const data:Homework = await aab.json();
	handleErrors(data);
	return data as Homework;
}