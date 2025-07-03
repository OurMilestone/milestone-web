export interface WalletDTO {
	id: number;
	user: string;
	balance: string;
	created_at: string;
	updated_at: string;
	is_active: boolean;
	is_locked: boolean;
	account_number: string;
	account_name: string;
}

export interface CreateWalletDto {
	user: string;
	balance: string;
	account_number: string;
	account_name: string;
}

export interface AddBankAccountDto {
	account_number: string;
	bank_code: string;
}

export interface BankDTO {
	id: string;
	name: string;
	code: string;
}

export interface TransactionDTO {
	id: number;
	wallet: number;
	amount: string;
	recipient: string;
	sender: string;
	transaction_type: string;
	transaction_status: string;
	transaction_date: string;
	transaction_reference: string;
	transaction_description: string;
}

export interface InitiateTransferDto {
	amount: number;
	recipient: string;
}

export interface PaystackBankDTO {
	id: number;
	name: string;
	code: string;
	slug: string;
	currency: string;
	active: boolean;
}

export interface PaystackResolveDTO {
	account_number: string;
	account_name: string;
	bank_id: number;
}
