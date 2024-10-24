class VulcanHebeError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'VulcanHebeError';
	}
};

export default VulcanHebeError;