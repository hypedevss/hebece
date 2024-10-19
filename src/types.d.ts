export interface KeyPair {
	fingerprint: string;
	privateKey: string;
	certificate: string;
}

export interface JwtOutput {
	EnvelopeType: string,
	Envelope: {
		RestURL: string,
		LoginId: null,
		UserLogin: null,
		Username: null,
	},
	Status: {
		Code: number,
		Message: string,
	},
	RequestId: string,
	Timestamp: number,
	TimestampFormatted: string,
}

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

interface PupilEnvelope {
	TopLevelPartition: string,
	Partition: string,
	Links: {
		Root: string,
		Group: string,
		Symbol: string,
		Alias: string,
		QuestionnaireRoot: string,
		ExResourcesUrl: string,
	},
	ClassDisplay: string,
	InfoDisplay: string
	FullSync: boolean
	SenderEntry: any
	Login: null
	Unit: {
		Id: number
		Symbol: string
		Short: string
		RestURL: string
		Name: string
		Address: string
		Patron: string
		DisplayName: string
		SchoolTopic: string
	},
	ConstituentUnit: {
		Id: number
		Short: string
		Name: string
		Address: string
		Patron: string
		SchoolTopic: string
	}
	Capabilities: Array<string>,
	Educators: Array<Educator>,
	EducatorsList: Array<EducatorFromList>
	Pupil: {
		Id: number
		LoginId: number
		LoginValue: string
		FirstName: string
		SecondName: string
		Surname: string
		Sex: boolean
	},
	CaretakerId: null
	Periods: Array<Period>
	Journal: {
		Id: number
		YearStart: {
			Timestamp: number
			Date: string
			DateDisplay: string
			Time: string
		},
		YearEnd: {
			Timestamp: number
			Date: string
			DateDisplay: string
			Time: string
		},
		PupilNumber: number
	},
	Constraints: {
		AbsenceDaysBefore: number,
		AbsenceHoursBefore: string
		PresenceBlockade: any
	},
	State: 0,
	Policies: {
		Privacy: any
		Cookies: any
		InfoEnclosure: any
		AccessDeclaration: any
	},
	Context: any,
	MessageBox: {
		Id: number
		GlobalKey: string
		Name: string
	},
	ProfileId: string

}


interface Period {
	Capabilities: Array<string>,
	Id: number
	Level: number
	Number: number
	Start: {
		Timestamp: number
		Date: string
		DateDisplay: string
		Time: string
	},
	End: {
		Timestamp: number
		Date: string
		DateDisplay: string
		Time: string
	},
	Current: boolean
	Last: boolean
}

export interface Pupil {
	EnvelopeType: string,
	Envelope: Array<PupilEnvelope>,
	Status: {
		Code: number,
		Message: string,
	},
	RequestId: string,
	Timestamp: number,
	TimestampFormatted: string,

}