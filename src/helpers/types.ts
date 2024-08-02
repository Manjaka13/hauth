/**
 * Here lies typescript types and interfaces
 */

export interface ServerAnswer {
	status: 0 | 1;
	caption: string;
	payload: any | undefined;
}

export interface Account {
	id: number;
	email: string;
	firstname?: string;
	lastname?: string;
	password: string;
	level: number;
	avatar?: string;
	banned: boolean;
	app: string;
	confirmed: boolean;
	created_at?: string;
}

export interface AccountPartial {
	id?: number;
	email?: string;
	firstname?: string;
	lastname?: string;
	password?: string;
	level?: number;
	avatar?: string;
	banned?: boolean;
	app?: string;
	confirmed?: boolean;
	created_at?: string;
}

export interface NewAccount {
	email: string;
	firstname?: string;
	lastname?: string;
	password: string;
	level: number;
	avatar?: string;
	app: string;
}

export interface LoggedAccount {
	id: number;
	email: string;
	firstname?: string;
	lastname?: string;
	level: number;
	avatar?: string;
	banned: boolean;
	app: string;
	confirmed: boolean;
	created_at?: string;
	token: string;
}
