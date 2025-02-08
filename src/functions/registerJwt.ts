import * as jwt from 'jose';
import * as uuid from 'uuid';
import * as strings from '../strings';
import moment from 'moment';
import { KeyPair, JwtOutput } from '../types';
import buildHeaders from '../utilities/buildHeaders';
import handleErrors from '../utilities/handleErrors';

export default async (apToken:string[], keyPair:KeyPair) => {
	const decodedJwts = apToken.map(token => jwt.decodeJwt(token));	
	const urls = decodedJwts.map(token => `https://lekcjaplus.vulcan.net.pl/${token.tenant}/api/mobile/register/jwt`)
	const date = new Date();
	const dateFormatted = moment(date).format('YYYY-MM-DD HH:mm:ss');
	const unixTimestamp = Math.floor(date.getTime() / 1000);
	const body = {
		"AppName": "DzienniczekPlus 3.0",
		"AppVersion": "24.09.04 (G)",
		"Envelope": {
			"OS": strings.OPERATING_SYSTEM,
			"DeviceModel": strings.DEVICE_MODEL,
			"Certificate": keyPair.certificate,
			"CertificateType": "X509",
			"CertificateThumbprint": keyPair.fingerprint,
			"Tokens": apToken,
			"selfIdentifier": uuid.v4(),
		},
		"NotificationToken": "",
		"API": parseInt(strings.VAPI),
		"RequestId": uuid.v4(),
		"Timestamp": unixTimestamp,
		"TimestampFormatted": dateFormatted,
	};
	const jwtOutputs = [];
	urls.forEach(async url => {
		const headers = buildHeaders(keyPair, body, date, url);

		const options = {
			method: 'POST',
			headers: headers,
			body: JSON.stringify(body),
		};
	
		const response = await fetch(url, options);
		// @ts-ignore
		const data:JwtOutput = await response.json();
		handleErrors(data);
		jwtOutputs.push(data);
	})

	return jwtOutputs;
};