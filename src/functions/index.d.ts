
export interface KeyPair {
	fingerprint: string,
	privateKey: string,
	certificate: string,
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