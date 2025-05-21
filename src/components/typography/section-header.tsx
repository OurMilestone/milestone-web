import type { ReactNode } from "react";

interface SectionHeaderProps {
	title: ReactNode;
	caption: ReactNode;
	className?: string;
}

const SectionHeader = (props: SectionHeaderProps) => {
	return (
		<header className={props.className}>
			<h3 className="text-2xl text-primary font-medium"> {props.title} </h3>
			<p className="text-sm text-primary mt-1.5"> {props.caption} </p>
		</header>
	);
};

export default SectionHeader;
