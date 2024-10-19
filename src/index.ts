import generateKeyPair from './lib/generateKeyPair';
import registerJwt from './functions/registerJwt';
import parseApiAp, { ApiApContent } from './utilities/parseApiAp';
import Keystore from './utilities/temporaryDb';
import { JwtOutput, KeyPair } from './types';
class Keypair {
	fingerprint: string;
	privateKey: string;
	certificate: string;

	/**
	 * Generates a new Keypair for authentication with VULCAN HebeCE API.
	 * 
	 * @async
	 * @returns 
	 */
	constructor() {
		// @ts-ignore
		return (async () => {
			// @ts-ignore
			const keypair:KeyPair = await new generateKeyPair();
			this.fingerprint = keypair.fingerprint;
			this.privateKey = keypair.privateKey;
			this.certificate = keypair.certificate;
			const json = {
				fingerprint: keypair.fingerprint,
				privateKey: keypair.privateKey,
				certificate: keypair.certificate,
			}
			return json;
		})()
	}
};

class VulcanJwtRegister {
	Status: {
		Code: number,
		Message: string
	}
	Envelope: {
		RestURL: string,
		LoginId: null,
		UserLogin: null,
		Username: null
	}
	/**
	 * Registers your Keypair with a JWT to send requests to VULCAN HebeCE API.
	 * 
	 * @param keypair The Keypair to authenticate
	 * @param apiap The /api/ap content
	 * @param tokenIndex What token should be authenticated? (Multistudent)
	 * @returns {JwtOutput}
	 */

	constructor(keypair: KeyPair, apiap: string, tokenIndex: number) {
		// @ts-ignore
		return (async () => {
			const parsedAp = parseApiAp(apiap);
			const token = (await parsedAp).Tokens[tokenIndex];

			const jwt:JwtOutput = await registerJwt(token, keypair);
			return jwt
		})();
	}
	};

class VulcanHebeCe {
	constructor(keypair, restUrl) {
		return (async () => {
			
		})()
	}
}

export {
	Keypair,
	Keystore,
	VulcanJwtRegister,
};