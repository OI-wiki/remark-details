export function detailsHtml(): Record<"enter" | "exit", {
	detailsContainer(): void,
	detailsContainerClassName(): void,
	detailsContainerSummary(): void,
	detailsContainerContent(): void
}>