import * as signer from './signer';
import * as moment from 'moment';
import * as strings from '../strings';
import { KeyPair } from '../types';
import { Pupil } from '../types';
import { ChangedLesson } from '.';

export default async (keyPair:KeyPair, restUrl: string, pupil:Pupil, dateFrom: Date, dateTo: Date) => {
	if (!restUrl) throw new Error('No REST URL provided!');
	if (!keyPair) throw new Error('No KEYPAIR provided!');
	if (!pupil) throw new Error('No PUPIL provided!');
	const tenant = restUrl.replace(`${strings.BASE_URL}/`, '');
	const currentPeriod = pupil.Envelope[0].Periods.find(p => p.Current === true);
	const url = `${strings.BASE_URL}/${tenant}/${pupil.Envelope[0].Unit.Symbol}/api/mobile/schedule/changes/byPupil?unitId=${pupil.Envelope[0].Unit.Id}&pupilId=${pupil.Envelope[0].Pupil.Id}&periodId=${currentPeriod.Id}&dateFrom=${moment(dateFrom).format('YYYY-MM-DD')}&dateTo=${moment(dateTo).format('YYYY-MM-DD')}&pageSize=100`;
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
	})
	// @ts-ignore
	const data:ChangedLesson = await aab.json();
	return data as ChangedLesson
}