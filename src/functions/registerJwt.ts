import * as jwt from 'jose';
import * as uuid from 'uuid';
import * as strings from '../strings';
import moment from 'moment';
import { KeyPair, VulcanApiResponse, JwtOutputEnvelope } from '../types';
import buildHeaders from '../utilities/buildHeaders';
import handleErrors from '../utilities/handleErrors';

export default async (apToken:string[], baseUrls: string[], keyPair:KeyPair) => {	
	const date = new Date();
	const dateFormatted = moment(date).format('YYYY-MM-DD HH:mm:ss');
	const unixTimestamp = Math.floor(date.getTime() / 1000);
	const properUrls = baseUrls.map(x => `${x}/api/mobile/register/jwt`)
	const body = {
		"AppName": "DzienniczekPlus 3.0",
		"AppVersion": `${strings.APP_VERSION}`,
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
	const jwtOutputs:JwtOutputEnvelope[] = [];
	for (const url of properUrls) {
		const headers = buildHeaders(keyPair, body, date, url);

		const options = {
			method: 'POST',
			headers: headers,
			body: JSON.stringify(body),
		};
	
		const response = await fetch(url, options);
		// @ts-ignore
		const data:VulcanApiResponse<JwtOutputEnvelope> = await response.json();
		handleErrors(data);
		jwtOutputs.push(data.Envelope);
	}
	return jwtOutputs;
};