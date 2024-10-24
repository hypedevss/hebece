import VulcanHebeError from "../lib/hebeError";

class HebeErrorHandlerError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'HebeErrorHandlerError';
	}
}

export default (body: object) => {
	if (!body) throw new HebeErrorHandlerError('No BODY provided!');
	const status = body['Status'];
	if (!status) throw new HebeErrorHandlerError('Malformed body. STATUS not found!');
	if (status.Code !== 0 || status.Message !== 'OK') throw new VulcanHebeError(`${status.Code} - ${status.Message}`);
}