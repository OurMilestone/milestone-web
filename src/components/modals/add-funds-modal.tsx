"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
import type {
	AddCardFormData,
	AddFundsFormValidatedData,
} from "@/lib/schemas/payments-schema";
import type {
	AddFundsStep,
	SavedPaymentMethod,
} from "@/types/dashboard/payments-types";
import { Loader2 } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useMediaQuery } from "usehooks-ts";
import AddCardDetailsStep from "../dashboard/payments-page/add-funds-flow/add-card-detail-step";
import ConfirmAddFundsStep from "../dashboard/payments-page/add-funds-flow/confirm-add-funds-step";
import NoCardPromptStep from "../dashboard/payments-page/add-funds-flow/no-card-prompt-step";

interface AddFundsFlowModalProps {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	initialHasSavedCards: boolean;
	initialSavedPaymentMethods?: SavedPaymentMethod[];
}

// Mock API calls
async function simulateSaveCardAPI(
	cardDetails: AddCardFormData,
): Promise<SavedPaymentMethod> {
	console.log("API: Saving card", cardDetails);

	await new Promise((resolve) => setTimeout(resolve, 1500));
	if (cardDetails.cardNumber.endsWith("1111")) {
		throw new Error("Card validation failed by bank.");
	}

	return {
		id: `card-${Date.now()}`,
		type: "Card",
		displayName: `${cardDetails.cardNumber.startsWith("4") ? "Visa" : "Mastercard"} .... ${cardDetails.cardNumber.slice(-4)}`,
		isDefault: true,
		cardBrand: cardDetails.cardNumber.startsWith("4") ? "Visa" : "Mastercard",
		last4: cardDetails.cardNumber.slice(-4),
		expiryMonth: cardDetails.expiryDate.split("/")[0],
		expiryYear: cardDetails.expiryDate.split("/")[1],
	};
}

async function simulateAddFundsAPI(
	data: AddFundsFormValidatedData,
): Promise<{ success: boolean; message: string }> {
	console.log("API: Adding funds", data);

	await new Promise((resolve) => setTimeout(resolve, 2000));
	if (data.transactionPin === "0000") {
		throw new Error("Incorrect transaction PIN.");
	}
	return {
		success: true,
		message: `Successfully added ${data.amount} to your wallet.`,
	};
}

export default function AddFundsFlowModal({
	isOpen,
	onOpenChange,
	initialHasSavedCards,
	initialSavedPaymentMethods = [],
}: AddFundsFlowModalProps) {
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const router = useRouter();

	const [currentStep, setCurrentStep] =
		useState<AddFundsStep>("CONFIRM_ADD_FUNDS");
	const [savedPaymentMethods, setSavedPaymentMethods] = useState<
		SavedPaymentMethod[]
	>(initialSavedPaymentMethods);
	const [isSubmittingStep, setIsSubmittingStep] = useState(false);

	useEffect(() => {
		if (isOpen) {
			if (!initialHasSavedCards && savedPaymentMethods.length === 0) {
				setCurrentStep("NO_CARD_PROMPT");
			} else {
				setCurrentStep("CONFIRM_ADD_FUNDS");
			}
			setIsSubmittingStep(false);
		}
	}, [isOpen, initialHasSavedCards, savedPaymentMethods.length]);

	const handleAddNewCardFromPrompt = () => {
		setCurrentStep("ADD_CARD_DETAILS");
	};

	const handleCardAdded = async (cardDetails: AddCardFormData) => {
		setIsSubmittingStep(true);

		toast.promise(simulateSaveCardAPI(cardDetails), {
			loading: "Saving card details...",
			success: (newCard) => {
				setSavedPaymentMethods((prev) => [...prev, newCard]);
				setCurrentStep("CONFIRM_ADD_FUNDS");
				return "Card added successfully!";
			},
			error: (err) => (err as Error).message || "Failed to save card.",
			finally: () => setIsSubmittingStep(false),
		});
	};

	const handleConfirmAddFunds = async (data: AddFundsFormValidatedData) => {
		setIsSubmittingStep(true);

		toast.promise(simulateAddFundsAPI(data), {
			loading: "Processing funds addition...",
			success: (response) => {
				onOpenChange(false);
				router.refresh();
				return response.message;
			},
			error: (err) => (err as Error).message || "Failed to add funds.",
			finally: () => setIsSubmittingStep(false),
		});
	};

	let modalTitle = "Add Funds";
	let StepComponent: React.ElementType | null = null;
	let actionButtonLabel = "Continue";
	let formIdToSubmit: string | undefined;

	switch (currentStep) {
		case "NO_CARD_PROMPT":
			modalTitle = "";
			StepComponent = () => (
				<NoCardPromptStep onAddNewCard={handleAddNewCardFromPrompt} />
			);
			actionButtonLabel = "";
			break;
		case "ADD_CARD_DETAILS":
			modalTitle = "Add Card Details";
			StepComponent = () => (
				<AddCardDetailsStep
					onCardAdded={handleCardAdded}
					isSubmitting={isSubmittingStep}
					setIsSubmitting={setIsSubmittingStep}
				/>
			);
			actionButtonLabel = "Add Card";
			formIdToSubmit = "add-card-details-form";
			break;
		case "CONFIRM_ADD_FUNDS":
			modalTitle = "Add Funds";
			StepComponent = () => (
				<ConfirmAddFundsStep
					savedPaymentMethods={savedPaymentMethods}
					onConfirmAddFunds={handleConfirmAddFunds}
					isSubmitting={isSubmittingStep}
					setIsSubmitting={setIsSubmittingStep}
				/>
			);
			actionButtonLabel = "Add Funds";
			formIdToSubmit = "confirm-add-funds-form";
			break;
	}

	const commonHeader = (
		<DrawerTitle className="text-2xl">{modalTitle}</DrawerTitle>
	);

	const commonFooter = actionButtonLabel ? (
		<Button
			type="submit"
			form={formIdToSubmit}
			disabled={
				isSubmittingStep ||
				(currentStep === "CONFIRM_ADD_FUNDS" &&
					savedPaymentMethods.length === 0)
			}
			className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90"
		>
			{isSubmittingStep && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
			{actionButtonLabel}
		</Button>
	) : null;

	if (isDesktop) {
		return (
			<Dialog
				open={isOpen}
				onOpenChange={(open) => {
					if (!isSubmittingStep) onOpenChange(open);
				}}
			>
				<DialogContent className="sm:max-w-md">
					<DialogHeader className="text-left pb-2">{commonHeader}</DialogHeader>
					<div className="py-2 px-1 max-h-[70vh] overflow-y-auto custom-scrollbar">
						{StepComponent && <StepComponent />}
					</div>
					{commonFooter && (
						<DialogFooter className="pt-4">{commonFooter}</DialogFooter>
					)}
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Drawer
			open={isOpen}
			onOpenChange={(open) => {
				if (!isSubmittingStep) onOpenChange(open);
			}}
		>
			<DrawerContent className="outline-none">
				<DrawerHeader className="text-left pb-2">{commonHeader}</DrawerHeader>
				<div className="p-4 pt-0 pb-2 max-h-[70vh] overflow-y-auto custom-scrollbar">
					{StepComponent && <StepComponent />}
				</div>
				{commonFooter && (
					<DrawerFooter className="pt-2">{commonFooter}</DrawerFooter>
				)}
			</DrawerContent>
		</Drawer>
	);
}
