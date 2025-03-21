// authentication
export interface KeyPair {
	fingerprint: string;
	privateKey: string;
	certificate: string;
}

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

export interface RequestStatus {
	Code: number,
	Message: string
}

export interface JwtOutputEnvelope {
	RestURL: string,
	LoginId: null,
	UserLogin: null,
	Username: null,
}

export interface Student {
	PupilId: number,
	SymbolId: string
	FirstName: string,
	LastName: string,
	RestURL: string,
	Pupil: PupilEnvelope
}

export interface VulcanApiResponse<T> {
	EnvelopeType: string,
	Envelope: T
	Status: RequestStatus
	RequestId: string,
	Timestamp: number,
	TimestampFormatted: string,
}

// Pupil

interface EducatorFromList {
	GlobalKey: string
	Name: string
	Group: any
}

interface EducatorRole {
		RoleName: string
		RoleOrder: number
		Address: string
		AddressHash: string
		UnitSymbol: any
		ConstituentUnitSymbol: string
		ClassSymbol: any
		Name: string
		Surname: string
		Initials: string
}

interface Educator {
		Id: string
		LoginId: number
		Name: string
		Surname: string
		Initials: string,
		Roles: Array<EducatorRole>,
}

interface PupilLinks {
	Root: string,
	Group: string,
	Symbol: string,
	Alias: string,
	QuestionnaireRoot: string,
	ExResourcesUrl: string,
}

interface PupilConstituentUnit {
	Id: number
	Short: string
	Name: string
	Address: string
	Patron: string | null
	SchoolTopic: string
}

interface PupilUnit {
	Id: number
	Symbol: string
	Short: string
	RestURL: string
	Name: string
	Address: string
	Patron: string | null
	DisplayName: string
	SchoolTopic: string
}

interface PupilJournal {
	Id: number
	YearStart: VulcanHebeDate
	YearEnd: VulcanHebeDate
	PupilNumber: number
}

interface PupilData {
	Id: number
	LoginId: number
	LoginValue: string
	FirstName: string
	SecondName: string | null
	Surname: string
	Sex: boolean
}
interface PupilConstraints {
	AbsenceDaysBefore: number,
	AbsenceHoursBefore: string
	PresenceBlockade: any
}

interface PupilPolicies {
	Privacy: any
	Cookies: any
	InfoEnclosure: any
	AccessDeclaration: any
}

interface PupilMessageBox {
	Id: number
	GlobalKey: string
	Name: string
}
interface PupilEnvelope {
	TopLevelPartition: string,
	Partition: string,
	Links: PupilLinks
	ClassDisplay: string,
	InfoDisplay: string
	FullSync: boolean
	SenderEntry: any
	Login: null
	Unit: PupilUnit
	ConstituentUnit: PupilConstituentUnit
	Capabilities: Array<string>,
	Educators: Array<Educator>,
	EducatorsList: Array<EducatorFromList>
	Pupil: PupilData
	CaretakerId: null
	Periods: Array<Period>
	Journal: PupilJournal
	Constraints: PupilConstraints
	State: number,
	Policies: PupilPolicies
	Context: any,
	MessageBox: PupilMessageBox
	ProfileId: string

}


interface Period {
	Capabilities: Array<string>,
	Id: number
	Level: number
	Number: number
	Start: VulcanHebeDate
	End: VulcanHebeDate
	Current: boolean
	Last: boolean
}

// Lucky Number
interface LuckyNumberEnvelope {
	Day: string,
	Number: number,
}

// Homework

export interface VulcanHebeDate {
	Timestamp: number,
	Date: string,
	DateDisplay: string,
	Time: string,
}

interface Teacher {
	Id: number
	Surname: string
	Name: string
	DisplayName: string
}

interface Subject {
	Id: number
	Key: string
	Name: string
	Kod: string
	Position: number
}

interface HomeworkEnvelope {
	Id: number
	Key: string
	IdPupil: number
	IdHomework: number
	Content: string
	IsAnwserRequired: boolean
	DateCreated: VulcanHebeDate
	DateModified: VulcanHebeDate
	Date: VulcanHebeDate
	AnwserDate: VulcanHebeDate
	Deadline: VulcanHebeDate
	Creator: Teacher,
	Subject: Subject
	Attachments: Array<any>
	Didactics: any
	AnwserDidactics: any
}

// Grades

interface GradeCategory {
	Id: number
	Name: string
	Code: string
}

interface GradeColumn {
	Id: number
	Key: string
	PeriodId: number
	Name: string
	Code: string
	Group: string
	Number: number
	Color: number
	Weight: number
	Subject: Subject
	Category: GradeCategory
}


interface GradeEnvelope {
	Id: number
	Key: string
	Pupilid: number
	ContentRaw: string
	Content: string
	Comment: string
	Value: any
	Numerator: number
	Denominator: number
	DateCreated: VulcanHebeDate
	DateModify: VulcanHebeDate
	Creator: Teacher
	Modifier: Teacher
	Column: GradeColumn
	Category: GradeCategory
}

// Lessons

interface LessonRoom {
	Id: number
	Code: string
}

interface TimeSlot {
	Id: number
	Start: string
	End: string
	Display: string
	Position: number
}

interface LessonClass {
	Id: number
	Key: string
	DisplayName: string
	Symbol: string
}

interface LessonEnvelope {
	Id: number
	MergeChangeId: number | null
	Event: any // Unknown
	Date: VulcanHebeDate
	Room: LessonRoom | null
	TimeSlot: TimeSlot
	Subject: Subject
	TeacherPrimary: Teacher
	TeacherSecondary: Teacher | null
	TeacherSecondary2: Teacher | null
	Change: LessonChange | null
	Clazz: LessonClass
	Distribution: any // Unknown
	PupilAlias: any // Unknown
	Visible: boolean
	Parent: any // Unknown
}



// Changed lessons
interface LessonChange {
	Id: number
	Type: number
	IsMerge: boolean
	Separation: boolean
}

interface LessonChangeEnvelope {
	Id: number
	UnitId: number
	ScheduleId: number
	LessonDate: VulcanHebeDate
	ChangeDate: VulcanHebeDate | null
	Note: string
	Reason: string | null
	Event: any // Unknown
	Room: LessonRoom | null
	TimeSlot: TimeSlot | null
	Subject: Subject
	TeacherPrimary: Teacher
	TeacherAbsenceReasonId: number
	TeacherAbsenceEffectName: string
	TeacherSecondary: Teacher | null
	TeacherSecondaryAbsenceReasonId: number | null
	TeacherSecondaryAbsenceEffectName: string | null
	TeacherSecondary2: Teacher | null
	TeacherSecondary2AbsenceReasonId: number | null
	TeacherSecondary2AbsenceEffectName: string | null
	Change: LessonChange
	Clazz: LessonClass
	Distribution: any // Unknown
	ClassAbsence: boolean
	NoRoom: boolean
	DateModified: VulcanHebeDate
	Description: string | null
}

// Attendance

interface AttendancePresenceType {
	Id: number
	Symbol: string
	Name: string
	CategoryId: number
	CategoryName: string
	Position: number
	Presence: boolean
	Absence: boolean
	Late: boolean
	AbsenceJustified: boolean
	Removed: boolean
}

interface AttendanceEnvelope {
	LessonId: number
	PresenceType: AttendancePresenceType
	Collection: Array<any>
	JustificationStatus: any | null
	Id: number
	LessonClassId: number
	Day: VulcanHebeDate
	CalculatePresence: boolean
	GroupDefinition: boolean
	PublicResources: null | any // Unknown
	PrivateResources: null | any // Unknown
	Replacement: boolean
	DateModify: VulcanHebeDate
	GlobalKey: string
	Note: string | null
	Topic: string | null
	LessonNumber: number
	LessonClassGlobalKey: string
	TimeSlot: TimeSlot
	Subject: Subject
	TeacherPrimary: Teacher | null
	TeacherMod: Teacher | null
	Clazz: LessonClass
	Distribution: any // Unknown
	Visible: boolean
	Parent: any // Unknown
}

// Exams

interface ExamEnvelope {
	Id: number
	Key: string
	Type: string
	TypeId: number
	Content: string
	DateCreated: VulcanHebeDate
	DateModify: VulcanHebeDate
	Deadline: VulcanHebeDate
	Creator: Teacher
	Subject: Subject
	PupilId: number
	Didactics: null | any // Unknown
}

// Messages

interface MessageExtras {
	DisplayedClass: string
}

interface MessageUser {
	GlobalKey: string
	Name: string
	HasRead: null | number
	Extras: MessageExtras
}

interface MessageAttachment {
	Name: string
	Link: string
}

interface MessageEnvelope {
	Id: string
	GlobalKey: string
	ThreadKey: string
	Subject: string
	Content: string
	DateSent: VulcanHebeDate
	DateRead: VulcanHebeDate
	Status: number
	Sender: MessageUser
	Receiver: Array<MessageUser>
	Attachments: Array<MessageAttachment> | Array<any>
	Importance: number
	Withdrawn: boolean
}

// Address book

interface AddressBookEnvelope {
	GlobalKey: string
	Name: string
	Group: string 
}
