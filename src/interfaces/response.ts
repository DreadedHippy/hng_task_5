export interface httpResponse {
	status: boolean;
	message?: string;
	data?: Object
	error?: Error
}