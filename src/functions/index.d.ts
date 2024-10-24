import { RequestStatus } from "../types"

// Lucky Number
interface LuckyNumberEnvelope {
	Day: string,
	Number: number,
}

export interface LuckyNumber {
	EnvelopeType: string,
	Envelope: LuckyNumberEnvelope
	Status: RequestStatus
	RequestId: string,
	Timestamp: number,
	TimestampFormatted: string,
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

export interface Homework {
	EnvelopeType: string,
	Envelope: Array<HomeworkEnvelope>
	Status: RequestStatus
	RequestId: string,
	Timestamp: number,
	TimestampFormatted: string,
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
export interface Grade {
	EnvelopeType: string,
	Envelope: Array<GradeEnvelope>
	Status: RequestStatus
	RequestId: string,
	Timestamp: number,
	TimestampFormatted: string,
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

export interface Lesson {
	EnvelopeType: string,
	Envelope: Array<LessonEnvelope>
	Status: RequestStatus
	RequestId: string,
	Timestamp: number,
	TimestampFormatted: string,
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

export interface ChangedLesson {
	EnvelopeType: string,
	Envelope: Array<LessonChangeEnvelope>
	Status: RequestStatus
	RequestId: string,
	Timestamp: number,
	TimestampFormatted: string,
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

export interface Attendance {
	EnvelopeType: string,
	Envelope: Array<AttendanceEnvelope>
	Status: RequestStatus
	RequestId: string,
	Timestamp: number,
	TimestampFormatted: string,
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

export interface Exam {
	EnvelopeType: string,
	Envelope: Array<ExamEnvelope>
	Status: RequestStatus
	RequestId: string,
	Timestamp: number,
	TimestampFormatted: string,
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

export interface Message {
	EnvelopeType: string,
	Envelope: Array<MessageEnvelope>
	Status: RequestStatus
	RequestId: string,
	Timestamp: number,
	TimestampFormatted: string,
}

// Address book

interface AddressBookEnvelope {
	GlobalKey: string
	Name: string
	Group: string 
}

export interface AddressBook {
	EnvelopeType: string,
	Envelope: Array<AddressBookEnvelope>
	Status: RequestStatus
	RequestId: string,
	Timestamp: number,
	TimestampFormatted: string,
}