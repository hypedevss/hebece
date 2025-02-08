import moment from 'moment';
import * as strings from '../strings';
import { KeyPair, PupilEnvelope } from '../types';
import buildHeaders from '../utilities/buildHeaders';
import handleErrors from '../utilities/handleErrors';
import { AddressBook } from '.';

export default async (keyPair:KeyPair, restUrl: string, pupil: PupilEnvelope) => {
	if (!restUrl) throw new Error('No REST URL provided!');
	if (!keyPair) throw new Error('No KEYPAIR provided!');
	if (!pupil) throw new Error('No PUPIL provided!');
	const tenant = restUrl.replace(`${strings.BASE_URL}/`, '');
	const url = `${strings.BASE_URL}/${tenant}/${pupil.Unit.Symbol}/api/mobile/addressbook?box=${pupil.MessageBox.GlobalKey}`;
	const date = new Date();
	const headers = buildHeaders(keyPair, null, date, url);
	const aab = await fetch(url, {
		method: 'GET',
		headers: headers,
	})
	console.log(url)
	// @ts-ignore
	let data:AddressBook = await aab.json();
	handleErrors(data);
	return data as AddressBook;
}