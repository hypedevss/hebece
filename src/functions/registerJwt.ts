import * as jwt from 'jose';
import * as signer from './signer';
import * as uuid from 'uuid';
import * as strings from '../strings';
import * as moment from 'moment';
import { JwtOutput, KeyPair } from '.';
export default async (apToken:string, keyPair:KeyPair) => {
	const decodedJwt = jwt.decodeJwt(apToken);
	const url = `https://lekcjaplus.vulcan.net.pl/${decodedJwt.tenant}/api/mobile/register/jwt`;
	const date = new Date();
	const dateUTC = date.toUTCString();
	const dateFormatted = moment(date).format('YYYY-MM-DD HH:mm:ss');
	const unixTimestamp = Math.floor(date.getTime() / 1000);
	if (decodedJwt.exp < unixTimestamp) throw new Error('JWT Expired. Automatic renewal by fetching /api/ap is not yet supported.');
	const body = {
		"AppName": "DzienniczekPlus 3.0",
		"AppVersion": "24.09.04 (G)",
		"Envelope": {
			"OS": strings.OPERATING_SYSTEM,
			"DeviceModel": strings.DEVICE_MODEL,
			"Certificate": keyPair.certificate,
			"CertificateType": "X509",
			"CertificateThumbprint": keyPair.fingerprint,
			"Tokens": [ apToken ],
			"selfIdentifier": uuid.v4(),
		},
		"NotificationToken": "",
		"API": parseInt(strings.VAPI),
		"RequestId": uuid.v4(),
		"Timestamp": unixTimestamp,
		"TimestampFormatted": dateFormatted,
	};

	const signature = signer.sign(
		keyPair.fingerprint,
		keyPair.privateKey,
		JSON.stringify(body),
		url,
		dateUTC,
	);

	const headers = {
		'accept': '*/*',
		'accept-charset': 'UTF-8',
		'accept-encoding': 'gzip',
		'connection': 'Keep-Alive',
		'content-type': 'application/json',
		'digest': signature.digest,
		'host': 'lekcjaplus.vulcan.net.pl',
		'signature': signature.signature,
		'user-agent': strings.USER_AGENT,
		'vapi': strings.VAPI,
		'vcanonicalurl': signature.canonicalUrl,
		'vdate': dateUTC,
		'vdevicemodel': strings.DEVICE_MODEL,
		'vos': strings.OPERATING_SYSTEM,
		'vversioncode': strings.VERSION_CODE,
	};

	const options = {
		method: 'POST',
		headers: headers,
		body: JSON.stringify(body),
	};

	const response = await fetch(url, options);
	// @ts-ignore
	const data:JwtOutput = await response.json();
	const obj = {
		restUrl: data.Envelope.RestURL,
		status: data.Status.Code,
		message: data.Status.Message,
	}

	return obj;
};