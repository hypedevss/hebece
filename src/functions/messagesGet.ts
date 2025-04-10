import * as strings from '../strings';
import { KeyPair, PupilEnvelope, VulcanApiResponse, MessageEnvelope } from '../types';
import buildHeaders from '../utilities/buildHeaders';
import handleErrors from '../utilities/handleErrors';

export default async (keyPair:KeyPair, restUrl: string, pupil: PupilEnvelope, type: number, amount: number) => {
	if (!restUrl) throw new Error('No REST URL provided!');
	if (!keyPair) throw new Error('No KEYPAIR provided!');
	if (!pupil) throw new Error('No PUPIL provided!');
	const messageType = (type: Exclude<number, 0 | 1 |2>) => ['received', 'sent', 'deleted'][type];
	const url = `${restUrl}/${pupil.Unit.Symbol}/api/mobile/messages/${messageType(type)}/byBox?box=${pupil.MessageBox.GlobalKey}&lastId=-2147483648&pupilId=${pupil.Pupil.Id}&pageSize=500`;
	const date = new Date();
	const headers = buildHeaders(keyPair, null, date, url);
	const aab = await fetch(url, {
		method: 'GET',
		headers: headers,
	})
	console.log(url)
	// @ts-ignore
	let data:VulcanApiResponse<Array<MessageEnvelope>> = await aab.json();
	handleErrors(data);
	data.Envelope.sort((a, b) => b.DateSent.Timestamp - a.DateSent.Timestamp);
	data.Envelope = data.Envelope.slice(0, amount);
	return data as VulcanApiResponse<Array<MessageEnvelope>>;
}