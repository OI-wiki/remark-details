export default function syntax(): {
	flow: Record<number, {
		tokenize(effects: any, ok: any, nok: any): (code: any) => any,
		concrete: boolean,
	}>
};