import * as strings from '../strings';
import { KeyPair } from '../types';
import { Pupil } from '../types';
import buildHeaders from '../utilities/buildHeaders';
import handleErrors from '../utilities/handleErrors';
import { Message } from '.';

export default async (keyPair:KeyPair, restUrl: string, pupil:Pupil, type: number, amount: number) => {
	if (!restUrl) throw new Error('No REST URL provided!');
	if (!keyPair) throw new Error('No KEYPAIR provided!');
	if (!pupil) throw new Error('No PUPIL provided!');
	const tenant = restUrl.replace(`${strings.BASE_URL}/`, '');
	const messageType = (type: Exclude<number, 0 | 1 |2>) => ['received', 'sent', 'deleted'][type];
	const url = `${strings.BASE_URL}/${tenant}/${pupil.Envelope[0].Unit.Symbol}/api/mobile/messages/${messageType(type)}/byBox?box=${pupil.Envelope[0].MessageBox.GlobalKey}&lastId=-2147483648&pupilId=${pupil.Envelope[0].Pupil.Id}&pageSize=500`;
	const date = new Date();
	const headers = buildHeaders(keyPair, null, date, url);
	const aab = await fetch(url, {
		method: 'GET',
		headers: headers,
	})
	console.log(url)
	// @ts-ignore
	let data:Message = await aab.json();
	handleErrors(data);
	data.Envelope.sort((a, b) => b.DateSent.Timestamp - a.DateSent.Timestamp);
	data.Envelope = data.Envelope.slice(0, amount);
	return data as Message;
}