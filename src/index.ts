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
import { JwtOutput, KeyPair, Pupil, PupilEnvelope, Student } from './types';
import messagesGet from './functions/messagesGet';
import addressbook from './functions/addressbook';
import { Grade, Homework, Lesson, LuckyNumber, ChangedLesson, Attendance, Exam, Message, AddressBook } from './functions';
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
	/**
	 * Creates a manager for authentication with VULCAN HebeCE API.
	 * 
	 * @param keypair The Keypair to authenticate
	 * @param apiap The /api/ap content
	 * @param tokenIndex What token should be authenticated? (Multistudent)
	 * @returns {JwtOutput}
	 */

	constructor(keypair: KeyPair, apiap: string) {
		this.keypair = keypair;
		this.apiap = apiap;
	};
	/**
	 * Registers your Keypair with a JWT to send requests to VULCAN HebeCE API.
	 * 
	 * @async 
	 */
	async init() {
		const keypair = this.keypair;
		const apiap = this.apiap;
		const parsedAp = await parseApiAp(apiap);
		const token = parsedAp.Tokens
		const jwt:JwtOutput[] = await registerJwt(token, keypair);
		jwt.forEach(j => {
			restUrls.push(j.Envelope.RestURL);
		})
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
	 * @param restUrl The REST URL that the API should use
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
			const pupilData:Pupil = await registerHebe(this.keypair, url);
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
		return this.selectedStudent;
	}

	/**
	 * Gets lucky number from the API.
	 * @async
	 * @returns {LuckyNumber}
	 */
	async getLuckyNumber() {
		this.checkConnection();
		const lucky:LuckyNumber = await luckyNumber(this.keypair, this.selectedStudent.RestURL, this.pupilJson);
		return lucky as LuckyNumber;
	}

	/**
	 * Gets your homework from the API.
	 * @param dateFrom The start of the date range
	 * @param dateTo  The end of the date range
	 * @async
	 * @returns {Homework}
	 */
	async getHomework(dateFrom: Date, dateTo: Date) {
		this.checkConnection();
		const homework:Homework = await getHw(this.keypair, this.selectedStudent.RestURL, this.pupilJson, dateFrom, dateTo);
		return homework as Homework;
	}
	/**
	 * Gets your grades for the current period from the API.
	 * @async
	 * @returns {Grade}
	 */
	async getGrades() {
		this.checkConnection();
		const grades:Grade = await ggrades(this.keypair, this.selectedStudent.RestURL, this.pupilJson);
		return grades as Grade;
	}
	/**
	 * Gets your timetable from the API.
	 * @param dateFrom The start of the date range
	 * @param dateTo The end of the date range
	 * @async
	 * @returns {Lesson}
	 */
	async getLessons(dateFrom: Date, dateTo: Date) {
		this.checkConnection();
		const lessons:Lesson = await fLessons(this.keypair, this.selectedStudent.RestURL, this.pupilJson, dateFrom, dateTo);
		return lessons as Lesson;
	}

	/**
	 * Gets your substitutions from the API.
	 * @param dateFrom The start of the date range
	 * @param dateTo The end of the date range
	 * @async
	 * @returns {ChangedLesson}
	 */
	async getChangedLessons(dateFrom: Date, dateTo: Date) {
		this.checkConnection();
		const lessons:ChangedLesson = await changedLessons(this.keypair, this.selectedStudent.RestURL, this.pupilJson, dateFrom, dateTo);
		return lessons as ChangedLesson;
	}
	/**
	 * Gets your attendance from the API.
	 * @param dateFrom The start of the date range
	 * @param dateTo The end of the date range
	 * @returns {Attendance}
	 */
	async getAttendance(dateFrom: Date, dateTo: Date) {
		this.checkConnection();
		const attendanceobj:Attendance = await attendance(this.keypair, this.selectedStudent.RestURL, this.pupilJson, dateFrom, dateTo);
		return attendanceobj as Attendance;
	}

	/**
	 * Gets your exams from the API.
	 * @param dateFrom The start of the date range
	 * @param dateTo The end of the date range
	 * @returns {Exam}
	 */
	async getExams(dateFrom: Date, dateTo: Date) {
		this.checkConnection();
		const examsobj:Exam = await getexams(this.keypair, this.selectedStudent.RestURL, this.pupilJson, dateFrom, dateTo);
		return examsobj as Exam;
	}

	messages = {
		/**
		 * Gets your messages from the API.
		 * 
		 * Messages are automatically sorted from newest to oldest.
		 * @param type The type of the message (0 = received, 1 = sent, 2 = deleted)
		 * @param amount How many messages do you want to fetch
		 * @returns {Message}
		 */
		get: async (type:Exclude<number, 0 | 1 |2>, amount:number) => {
			this.checkConnection();
			const messages:Message = await messagesGet(this.keypair, this.selectedStudent.RestURL, this.pupilJson, type, amount);
			return messages as Message;
		},
		/**
		 * Gets the address book from the API.
		 * 
		 * Useful to send a message. Contains MessageBoxes IDs that you can send a message to.
		 * @returns {AddressBook}
		 */
		getAddressBook: async () => {
			this.checkConnection();
			const addrbook:AddressBook = await addressbook(this.keypair, this.selectedStudent.RestURL, this.pupilJson);
			return addrbook as AddressBook;
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