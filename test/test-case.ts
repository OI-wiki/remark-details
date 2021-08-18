import test from 'ava';
import FileSystem from 'fs';
import { VFile } from 'vfile';

interface TestCaseConfig {
	name?: string;
	input: string | VFile;
	expected: string | VFile;
	message?: string;
}

interface TestCase {
	(config: TestCaseConfig, processor?: (input: string) => string): string;
	count: number;
	processor: (input: string) => string
}

const testCase = <TestCase>function (config: TestCaseConfig, processor?: (input: string) => string) {
	const input = typeof (config.input) == "string" ? config.input : FileSystem.readFileSync(config.input.path).toString();
	const expected = typeof (config.expected) == "string" ? config.expected : FileSystem.readFileSync(config.expected.path).toString();
	const process = processor ?? testCase.processor;
	const name = `Test Case ${++testCase.count}` + (config.name ? `: ${config.name}` : "");
	test(name, ava => {
		const actual = process(input);
		ava.is(actual, expected, config.message);
	});
}
testCase.count = 0;
testCase.processor = input => input;
export default testCase;

export function fromPath(path: string): VFile {
	const result = new VFile();
	result.path = path;
	return result;
}