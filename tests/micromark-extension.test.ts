import testCase from "./test-case.js";
import { micromark } from 'micromark';
import { syntax, detailsHtml as html, } from '../micromark-extension-details/index.js';

testCase.processor = (input: string) => {
	return micromark(input, {
		extensions: [syntax],
		htmlExtensions: [html as any]
	});
}
testCase({
	input: 'hello world',
	expected: '<p>hello world</p>',
	message: 'basic test',
});
testCase({
	input: '???+总结如下\n',
	expected: '<details open><summary>总结如下</summary>\n</details>',
	message: 'no content details',
});
testCase({
	input: '???+ note 总结\n',
	expected: '<details open class="note"><summary>总结</summary>\n</details>',
	message: 'no content details with note',
});
testCase({
	input: '???+ warning 总结\n',
	expected: '<details open class="warning"><summary>总结</summary>\n</details>',
	message: 'no content details with warning',
});
