import { z } from "zod";
import { isValidCardNumber } from "../utils";

export const CURRENCIES = ["USD", "EUR", "GBP", "NGN"] as const;
export type Currency = (typeof CURRENCIES)[number];

export const withdrawFundsSchema = z
	.object({
		currency: z.enum(CURRENCIES, {
			required_error: "Please select a currency.",
		}),
		amount: z
			.string()
			.min(1, "Amount is required.")
			.refine(
				(val) =>
					/^\d*(\.\d{0,2})?$/.test(val) &&
					!Number.isNaN(Number.parseFloat(val)),
				{
					message: "Please enter a valid amount.",
				},
			)
			.transform((val) => Number.parseFloat(val))
			.pipe(
				z
					.number({ invalid_type_error: "Amount must be a number." })
					.positive({ message: "Amount must be greater than zero." })
					.max(1000000, { message: "Withdrawal amount exceeds limit." }),
			),
		destinationId: z.string().min(1, "Please select a withdrawal destination."),
		password: z
			.string()
			.min(8, { message: "Password must be at least 8 characters." }),
	})
	.refine(
		(data) => {
			if (data.currency === "NGN" && data.amount > 5000000) {
				return false;
			}
			return true;
		},
		{
			message: "Amount exceeds limit for selected currency (NGN).",
			path: ["amount"],
		},
	);

export type WithdrawFundsFormInput = {
	currency: Currency;
	amount: string;
	destinationId: string;
	password: string;
};

export type WithdrawFundsValidatedData = z.infer<typeof withdrawFundsSchema>;

export const addCardSchema = z.object({
	nameOnCard: z.string().min(2, "Name on card is required."),
	cardNumber: z
		.string()
		.transform((value) => value.replace(/\s/g, ""))
		.pipe(
			z
				.string()
				.min(13, "Card number must be between 13 and 19 digits.")
				.max(19, "Card number must be between 13 and 19 digits.")
				.regex(/^\d+$/, "Card number must only contain digits.")
				.refine(isValidCardNumber, "Invalid card number."),
		),
	expiryDate: z
		.string()
		.min(7, "Expiry date must be in MM/YYYY format.")
		.regex(/^(0[1-9]|1[0-2])\/\d{4}$/, "Invalid expiry date format (MM/YYYY).")
		.refine(
			(val) => {
				const [month, year] = val.split("/").map(Number);
				const currentYear = new Date().getFullYear();
				const currentMonth = new Date().getMonth() + 1;
				if (
					year < currentYear ||
					(year === currentYear && month < currentMonth)
				) {
					return false;
				}
				return true;
			},
			{ message: "Card has expired." },
		),
	cvv: z
		.string()
		.min(3, "CVV must be 3 or 4 digits.")
		.max(4, "CVV must be 3 or 4 digits.")
		.regex(/^\d+$/, "CVV must only contain digits."),
	cardPin: z
		.string()
		.length(4, "Card PIN must be 4 digits.")
		.regex(/^\d{4}$/, "Card PIN must be 4 digits."),
});

export type AddCardFormData = z.infer<typeof addCardSchema>;

export const addFundsFormSchema = z.object({
	amount: z
		.string()
		.min(1, "Amount is required.")
		.refine(
			(val) =>
				!Number.isNaN(Number.parseFloat(val)) && Number.parseFloat(val) > 0,
			{
				message: "Please enter a valid positive amount.",
			},
		)
		.transform((val) => Number.parseFloat(val))
		.pipe(
			z
				.number()
				.positive("Amount must be greater than 0.")
				.min(1, "Minimum deposit is 1.")
				.max(50000, "Maximum deposit is 50,000."),
		),
	sourceOfFundsId: z.string().min(1, "Please select a source of funds."),
	transactionPin: z
		.string()
		.min(4, "Transaction PIN must be at least 4 digits.")
		.max(6, "Transaction PIN must be at most 6 digits.")
		.regex(/^\d+$/, "PIN must only contain digits."),
});

export type AddFundsFormInputData = {
	amount: string;
	sourceOfFundsId: string;
	transactionPin: string;
};

export type AddFundsFormValidatedData = z.infer<typeof addFundsFormSchema>;

export const withdrawFundsSchema2 = z.object({
	bankId: z.string().min(1, "Please select a bank"),
	accountNumber: z
		.string()
		.min(10, "Account number must be 10 digits")
		.max(10, "Account number must be 10 digits")
		.regex(/^\d{10}$/, "Account number must contain only digits"),
	accountName: z.string().min(1, "Account name is required"),
	amount: z
		.string()
		.min(1, "Amount is required")
		.refine(
			(val) => !Number.isNaN(Number(val)) && Number(val) > 0,
			"Please enter a valid amount",
		)
		.transform((val) => Number(val))
		.pipe(
			z
				.number()
				.positive("Amount must be greater than 0")
				.max(10000000, "Maximum withdrawal amount is ₦10,000,000"),
		),
});

export type WithdrawFundsInput = z.input<typeof withdrawFundsSchema2>;
export type WithdrawFundsOutput = z.output<typeof withdrawFundsSchema2>;

export const addBankSchema = z.object({
	bank_code: z.string().min(1),
	account_number: z
		.string()
		.length(10, "Account number must be 10 digits")
		.regex(/^\d+$/, "Account number must contain only digits"),
});

export type AddBankInput = z.infer<typeof addBankSchema>;
