import { VulcanHebeDate } from "./functions";
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

export interface JwtOutput {
	EnvelopeType: string,
	Envelope: JwtOutputEnvelope
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

export interface Pupil {
	EnvelopeType: string,
	Envelope: Array<PupilEnvelope>,
	Status: RequestStatus
	RequestId: string,
	Timestamp: number,
	TimestampFormatted: string,

}