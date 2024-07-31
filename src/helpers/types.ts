/**
 * Here lies typescript types and interfaces
 */

export interface ServerAnswer {
	status: 0 | 1;
	caption: string;
	payload: any | undefined;
}

export interface Account {
	email: string;
	firstname?: string;
	lastname?: string;
	password: string;
	level: number;
	avatar?: string;
	banned: boolean;
	app: string;
	confirmationId: string;
}
