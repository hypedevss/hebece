import * as jwt from 'jose';
import * as strings from '../strings';

export interface ApiApContent {
	Success: boolean,
	Tokens: Array<string>,
	Alias: string,
	Email: string,
	EmailCandidate: null,
	GivenName: string,
	Surname: string,
	IsConsentAccepted: boolean,
	CanAcceptConsent: boolean,
	AccessToken: string,
	ErrorMessage: null,
	Capabilities: Array<string>,
}

export default async (apContent:string) =>  {
	// parse /api/ap output
	let apJson:ApiApContent= JSON.parse(apContent.split('value=\'')[1].split('\' />')[0]);
	const validationArray = [];
	// check for expired tokens
	apJson.Tokens.forEach(token => {
		const decodedJwt = jwt.decodeJwt(token);
		if (decodedJwt.exp < Math.floor(Date.now() / 1000)) {
			validationArray.push(false)
		} else {
			validationArray.push(true)
		}
	})
	if (validationArray.includes(false)) {
		const headers = {
			"Content-Type": "application/json",
			"Accept": "application/json",
			"User-Agent": strings.USER_AGENT,
			"Authorization": `Bearer ${apJson.AccessToken}`,
			"vapi": strings.VAPI,
			"vcanonicalurl": "api%2fap",
			"vdate": new Date().toUTCString(),
			"vos": strings.OPERATING_SYSTEM,
			"vversioncode": strings.VERSION_CODE,
		}

		const req = await fetch(`https://eduvulcan.pl/api/ap`, {
			method: "GET",
			headers: headers
		})
		const text = await req.text();
		apJson = JSON.parse(text.split('value=\'')[1].split('\' />')[0]);
	}
	return apJson
}