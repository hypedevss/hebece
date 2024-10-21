import generateKeyPair from './lib/generateKeyPair';
import registerJwt from './functions/registerJwt';
import registerHebe from './functions/registerHebe';
import luckyNumber from './functions/luckyNumber';
import parseApiAp from './utilities/parseApiAp';
import ggrades from './functions/grades';
import getHw from './functions/homeWork';
import Keystore from './utilities/temporaryDb';
import fLessons from './functions/lessons';
import changedLessons from './functions/changedLessons';
import { JwtOutput, KeyPair, Pupil } from './types';
import { Grade, Homework, Lesson, LuckyNumber } from './functions';
class Keypair {
	/**
	 * Creates a new Keypair manager for authentication with VULCAN HebeCE API.
	 * 
	 * @async
	 * @returns 
	 */
	constructor() {}
	/**
	 * Generates a new keypair and returns it.
	 * 
	 * @returns 
	 */
	async init() {
		// @ts-ignore
		const keypair:KeyPair = await new generateKeyPair();
		
		return {
			fingerprint: keypair.fingerprint,
			privateKey: keypair.privateKey,
			certificate: keypair.certificate
		}
	}
};

class VulcanJwtRegister {
	keypair: KeyPair;
	apiap: string;
	tokenIndex: number;
	/**
	 * Creates a manager for authentication with VULCAN HebeCE API.
	 * 
	 * @param keypair The Keypair to authenticate
	 * @param apiap The /api/ap content
	 * @param tokenIndex What token should be authenticated? (Multistudent)
	 * @returns {JwtOutput}
	 */

	constructor(keypair: KeyPair, apiap: string, tokenIndex: number) {
		this.keypair = keypair;
		this.apiap = apiap;
		this.tokenIndex = tokenIndex;
	};
	/**
	 * Registers your Keypair with a JWT to send requests to VULCAN HebeCE API.
	 * 
	 * @async 
	 */
	async init() {
		const keypair = this.keypair;
		const apiap = this.apiap;
		const tokenIndex = this.tokenIndex;
		
		const parsedAp = await parseApiAp(apiap);
		const token = parsedAp.Tokens[tokenIndex];
		const jwt:JwtOutput = await registerJwt(token, keypair);
		return jwt;
	}
}
class VulcanHebeCe {
	keypair: KeyPair;
	restUrl: string;
	symbolNumber: string;
	pupilId: number;
	pupilJson: Pupil;
	constituentId: number;
	/**
	 * Creates the main manager for VULCAN HebeCE API functionality.
	 * @param keypair The Keypair to authenticate
	 * @param restUrl The REST URL that the API should use
	 * @returns 
	 */
	constructor(keypair, restUrl) {
		this.keypair = keypair;
		this.restUrl = restUrl;
	}

	/**
	 * Connects to the VULCAN HebeCE API.
	 */
	async connect() {
		const pupilData:Pupil = await registerHebe(this.keypair, this.restUrl);
		const symbolNumber = pupilData.Envelope[0].Links.Symbol;
		const pupilId = pupilData.Envelope[0].Pupil.Id;
		const constituentId = pupilData.Envelope[0].ConstituentUnit.Id;
		this.symbolNumber = symbolNumber;
		this.pupilId = pupilId;
		this.pupilJson = pupilData;
		this.constituentId = constituentId;
		return true;
	}
	/**
	 * Gets lucky number from the API.
	 * @async
	 * @returns {LuckyNumber}
	 */
	async getLuckyNumber() {
		if (!this.symbolNumber || !this.pupilId || !this.constituentId) throw new Error(`You are not connected! Maybe .connect()?`)
		const lucky = await luckyNumber(this.keypair, this.restUrl, this.pupilJson);
		return lucky;
	}

	/**
	 * Gets your homework from the API.
	 * @param dateFrom The start of the date range
	 * @param dateTo  The end of the date range
	 * @async
	 * @returns {Homework}
	 */
	async getHomework(dateFrom: Date, dateTo: Date) {
		if (!this.symbolNumber || !this.pupilId || !this.constituentId) throw new Error(`You are not connected! Maybe .connect()?`)
		const homework = await getHw(this.keypair, this.restUrl, this.pupilJson, dateFrom, dateTo);
		return homework;
	}
	/**
	 * Gets your grades for the current period from the API.
	 * @async
	 * @returns {Grade}
	 */
	async getGrades() {
		if (!this.symbolNumber || !this.pupilId || !this.constituentId) throw new Error(`You are not connected! Maybe .connect()?`)
		const grades = await ggrades(this.keypair, this.restUrl, this.pupilJson);
		return grades;
	}
	/**
	 * Gets your timetable from the API.
	 * @param dateFrom The start of the date range
	 * @param dateTo The end of the date range
	 * @async
	 * @returns {Lesson}
	 */
	async getLessons(dateFrom: Date, dateTo: Date) {
		if (!this.symbolNumber || !this.pupilId || !this.constituentId) throw new Error(`You are not connected! Maybe .connect()?`)
		const lessons = await fLessons(this.keypair, this.restUrl, this.pupilJson, dateFrom, dateTo);
		return lessons;
	}

	/**
	 * Gets your substitutions from the API.
	 * @param dateFrom The start of the date range
	 * @param dateTo The end of the date range
	 * @async
	 * @returns 
	 */
	async getChangedLessons(dateFrom: Date, dateTo: Date) {
		if (!this.symbolNumber || !this.pupilId || !this.constituentId) throw new Error(`You are not connected! Maybe .connect()?`)
		const lessons = await changedLessons(this.keypair, this.restUrl, this.pupilJson, dateFrom, dateTo);
		return lessons;
	}
}

export {
	Keypair,
	Keystore,
	VulcanJwtRegister,
	VulcanHebeCe
};