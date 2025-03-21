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
import attendance from './functions/attendance';
import getexams from './functions/exams';
import { JwtOutputEnvelope, KeyPair, LuckyNumberEnvelope, PupilEnvelope, Student, VulcanApiResponse, HomeworkEnvelope, GradeEnvelope, ExamEnvelope, LessonEnvelope, LessonChangeEnvelope, AttendanceEnvelope, MessageEnvelope, AddressBookEnvelope } from './types';
import messagesGet from './functions/messagesGet';
import * as strings from './strings';
import addressbook from './functions/addressbook';
import { decodeJwt } from 'jose';
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

let restUrls = [];
class VulcanJwtRegister {
	keypair: KeyPair;
	apiap: string;
	autoRefreshAp: boolean;
	/**
	 * Creates a manager for authentication with VULCAN HebeCE API.
	 * 
	 * @param keypair The Keypair to authenticate
	 * @param apiap The /api/ap content
	 * @param autoRefreshAp Should new JWT tokens be fetched automatically?
	 * @returns {JwtOutput}
	 */

	constructor(keypair: KeyPair, apiap: string, autoRefreshAp: boolean = true) {
		this.keypair = keypair;
		this.apiap = apiap;
		this.autoRefreshAp = autoRefreshAp
	};
	/**
	 * Registers your Keypair with a JWT to send requests to VULCAN HebeCE API.
	 * 
	 * @async
	 */
	async init() {
		const keypair = this.keypair;
		const apiap = this.apiap;
		const parsedAp = await parseApiAp(apiap, this.autoRefreshAp);
		const token = parsedAp.Tokens
		const _restUrls = token.map(token => `${strings.BASE_URL}${decodeJwt(token).tenant}`)
		const jwt = await registerJwt(parsedAp.Tokens, _restUrls, keypair);
		restUrls = _restUrls;
		return jwt;
	}
}
class VulcanHebeCe {
	keypair: KeyPair;
	symbolNumber: string;
	pupilId: number;
	pupilJson: PupilEnvelope;
	constituentId: number;
	/**
	 * Creates the main manager for VULCAN HebeCE API functionality.
	 * @param keypair The Keypair to authenticate
	 * @returns 
	 */
	constructor(keypair) {
		this.keypair = keypair;
	}
	readonly students:Student[] = [];
	selectedStudent:Student = null;

	/**
	 * Connects to the VULCAN HebeCE API.
	 */
	async connect() {
		const deDuped:string[] = [...new Set(restUrls)];
		for (const url of deDuped) {
			const pupilData = await registerHebe(this.keypair, url);
			for (const pupil of pupilData.Envelope) {
				const studentObject: Student = {
					PupilId: pupil.Pupil.Id,
					SymbolId: pupil.Unit.Symbol,
					FirstName: pupil.Pupil.FirstName,
					LastName: pupil.Pupil.Surname,
					RestURL: url,
					Pupil: pupil
				}
				this.students.push(studentObject);
			}
		}
		return true;
	}
	/**
	 * Lists students assigned to current account
	 * @async
	 * @returns {Student[]}
	 */
	async listStudents() {
		this.checkConnection(false);
		return this.students;
	}
	/**
	 * Selects a student
	 * @async
	 * @param pupilId The ID of the student to select. Not providing one will select first student.
	 */
	async selectStudent(pupilId: number = 0) {
		this.checkConnection(false);
		this.selectedStudent = this.students.find(s => s.PupilId === pupilId) || this.students[0];
		this.pupilId = this.selectedStudent.PupilId;
		this.pupilJson = this.selectedStudent.Pupil;
		this.constituentId = this.selectedStudent.Pupil.ConstituentUnit.Id;
	}

	/**
	 * Gets lucky number from the API.
	 * @async
	 * @returns {VulcanApiResponse<LuckyNumberEnvelope>}
	 */
	async getLuckyNumber() {
		this.checkConnection();
		const lucky:VulcanApiResponse<LuckyNumberEnvelope> = await luckyNumber(this.keypair, this.selectedStudent.RestURL, this.pupilJson);
		return lucky;
	}

	/**
	 * Gets your homework from the API.
	 * @param dateFrom The start of the date range
	 * @param dateTo  The end of the date range
	 * @async
	 * @returns {VulcanApiResponse<Array<HomeworkEnvelope>>}
	 */
	async getHomework(dateFrom: Date, dateTo: Date) {
		this.checkConnection();
		const homework:VulcanApiResponse<Array<HomeworkEnvelope>> = await getHw(this.keypair, this.selectedStudent.RestURL, this.pupilJson, dateFrom, dateTo);
		return homework;
	}
	/**
	 * Gets your grades for the current period from the API.
	 * @async
	 * @returns {VulcanApiResponse<Array<GradeEnvelope>>}
	 */
	async getGrades() {
		this.checkConnection();
		const grades:VulcanApiResponse<Array<GradeEnvelope>> = await ggrades(this.keypair, this.selectedStudent.RestURL, this.pupilJson);
		return grades;
	}
	/**
	 * Gets your timetable from the API.
	 * @param dateFrom The start of the date range
	 * @param dateTo The end of the date range
	 * @async
	 * @returns {VulcanApiResponse<Array<LessonEnvelope>>}
	 */
	async getLessons(dateFrom: Date, dateTo: Date) {
		this.checkConnection();
		const lessons:VulcanApiResponse<Array<LessonEnvelope>> = await fLessons(this.keypair, this.selectedStudent.RestURL, this.pupilJson, dateFrom, dateTo);
		return lessons;
	}

	/**
	 * Gets your substitutions from the API.
	 * @param dateFrom The start of the date range
	 * @param dateTo The end of the date range
	 * @async
	 * @returns {LessonChangeEnvelope}
	 */
	async getChangedLessons(dateFrom: Date, dateTo: Date) {
		this.checkConnection();
		const lessons:VulcanApiResponse<Array<LessonChangeEnvelope>> = await changedLessons(this.keypair, this.selectedStudent.RestURL, this.pupilJson, dateFrom, dateTo);
		return lessons;
	}
	/**
	 * Gets your attendance from the API.
	 * @param dateFrom The start of the date range
	 * @param dateTo The end of the date range
	 * @returns {VulcanApiResponse<Array<AttendanceEnvelope>>}
	 */
	async getAttendance(dateFrom: Date, dateTo: Date) {
		this.checkConnection();
		const attendanceobj:VulcanApiResponse<Array<AttendanceEnvelope>> = await attendance(this.keypair, this.selectedStudent.RestURL, this.pupilJson, dateFrom, dateTo);
		return attendanceobj;
	}

	/**
	 * Gets your exams from the API.
	 * @param dateFrom The start of the date range
	 * @param dateTo The end of the date range
	 * @returns {VulcanApiResponse<Array<ExamEnvelope>>}
	 */
	async getExams(dateFrom: Date, dateTo: Date) {
		this.checkConnection();
		const examsobj:VulcanApiResponse<Array<ExamEnvelope>> = await getexams(this.keypair, this.selectedStudent.RestURL, this.pupilJson, dateFrom, dateTo);
		return examsobj;
	}

	messages = {
		/**
		 * Gets your messages from the API.
		 * 
		 * Messages are automatically sorted from newest to oldest.
		 * @param type The type of the message (0 = received, 1 = sent, 2 = deleted)
		 * @param amount How many messages do you want to fetch
		 * @returns {VulcanApiResponse<Array<MessageEnvelope>>}
		 */
		get: async (type:Exclude<number, 0 | 1 |2>, amount:number) => {
			this.checkConnection();
			const messages:VulcanApiResponse<Array<MessageEnvelope>> = await messagesGet(this.keypair, this.selectedStudent.RestURL, this.pupilJson, type, amount);
			return messages;
		},
		/**
		 * Gets the address book from the API.
		 * 
		 * Useful to send a message. Contains MessageBoxes IDs that you can send a message to.
		 * @returns {VulcanApiResponse<AddressBookEnvelope>}
		 */
		getAddressBook: async () => {
			this.checkConnection();
			const addrbook:VulcanApiResponse<Array<AddressBookEnvelope>> = await addressbook(this.keypair, this.selectedStudent.RestURL, this.pupilJson);
			return addrbook;
		}
	}
	private checkConnection(checkStudents: boolean = true) {
		if (this.students.length === 0) throw new Error(`You are not connected! Maybe .connect()?`)
		if (this.selectedStudent === null && checkStudents) throw new Error(`You have not selected a student! Maybe .selectStudent()?`)
	}
}

class RestUrlManager {
	async setRestUrls(rests: string[]) {
		restUrls = rests;
	}
}

export {
	Keypair,
	Keystore,
	VulcanJwtRegister,
	VulcanHebeCe,
	RestUrlManager
};