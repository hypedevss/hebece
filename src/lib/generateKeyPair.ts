import { Buffer } from 'buffer';
import * as forge from 'node-forge';

const generateKeyPair = async () => {
	const addYears = (dt: Date, n: number) =>
	  new Date(dt.setFullYear(dt.getFullYear() + n));
  
	const pki = forge.pki;
  
	const keys: any = await new Promise((resolve, reject) => {
	  forge.pki.rsa.generateKeyPair(
		{ bits: 2048, workers: 2 },
		(err:any, keypair:any) => {
		  if (err) {
			reject(err);
		  } else {
			resolve(keypair);
		  }
		}
	  );
	});
	const cert = pki.createCertificate();
	cert.publicKey = keys.publicKey;
	cert.privateKey = keys.privateKey;
	cert.serialNumber = "1";
	cert.validity.notBefore = new Date();
	cert.validity.notAfter = addYears(new Date(), 20);
	const attrs = [
	  {
		shortName: "CN",
		value: "APP_CERTIFICATE CA Certificate",
	  },
	];
	cert.setSubject(attrs);
	cert.setIssuer(attrs);
	cert.sign(cert.privateKey, forge.md.sha256.create());
  
	const fHash = forge.md.sha1.create();
	fHash.update(forge.asn1.toDer(pki.certificateToAsn1(cert)).getBytes());
	const fingerprint = fHash.digest().toHex();
  
	const privateKey = pki.privateKeyToAsn1(keys.privateKey);
	const privateKeyInfo = pki.wrapRsaPrivateKey(privateKey);
	const privateKeyPem = pki.privateKeyInfoToPem(privateKeyInfo);
	const certificate = pki
	  .certificateToPem(cert)
	  .replace("-----BEGIN CERTIFICATE-----", "")
	  .replace("-----END CERTIFICATE-----", "")
	  .replace(/\r?\n|\r/g, "")
	  .trim();
	const privateKeyToReturn = privateKeyPem
	  .replace("-----BEGIN PRIVATE KEY-----", "")
	  .replace("-----END PRIVATE KEY-----", "")
	  .replace(/\r?\n|\r/g, "")
	  .trim();
	return { certificate, fingerprint, privateKey: privateKeyToReturn };
  };

class KeyPair {
	/**
	 * Generates a new KeyPair for HebeCE API.
	 * 
	 * @async
	 * @returns {Promise<{fingerprint: string, privateKey: string, certificate: string}>}
	 */
	constructor() {
		return (async () => {
			const keypair = await generateKeyPair();
			// @ts-ignore
			return {
				fingerprint: keypair.fingerprint,
				privateKey: keypair.privateKey,
				certificate: keypair.certificate,
			};
		})();
	}
}

export default KeyPair;