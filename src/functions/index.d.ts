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