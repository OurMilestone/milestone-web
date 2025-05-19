import { type Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import type { VariantProps } from "class-variance-authority";
import { Loader } from "lucide-react";
import type * as React from "react";

interface LoadingButtonProps extends React.ComponentProps<typeof Button> {
	isLoading?: boolean;
	loadingText?: string;
	spinnerClassName?: string;
}

function LoadingButton({
	children,
	className,
	variant,
	size,
	isLoading = false,
	loadingText,
	spinnerClassName,
	asChild = false,
	...props
}: LoadingButtonProps &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	}) {
	const Comp = asChild ? Slot : "button";

	return (
		<Comp
			data-slot="button"
			className={cn(buttonVariants({ variant, size, className }))}
			disabled={isLoading || props.disabled}
			{...props}
		>
			{isLoading ? (
				<>
					<Loader
						className={cn("animate-spin", spinnerClassName || "size-4")}
					/>
					{loadingText}
				</>
			) : (
				children
			)}
		</Comp>
	);
}

export { LoadingButton };
