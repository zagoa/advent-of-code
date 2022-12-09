import { DAY2_INPUTS } from "./day2_inputs";

export function day2Part1(): number {
	return DAY2_INPUTS.reduce((count: number, input: string) => {
		const items = input.split(/:|-|\s/).filter((item) => !!item);
		let min: string;
		let max: string;
		let letter: string;
		let expression: string;
		let occurrences: number;
		[min, max, letter, expression] = [...items];
		occurrences = [...expression].reduce(
			(countLetter: number, letterFound: string) => {
				if (letterFound === letter) {
					countLetter++;
				}
				return countLetter;
			},
			0,
		);
		if (occurrences >= +min && occurrences <= +max) {
			count++;
		}
		return count;
	}, 0);
}

export function day2Part2(): number {
	return DAY2_INPUTS.reduce((count: number, input: string) => {
		const items = input.split(/:|-|\s/).filter((item) => !!item);
		let min: string;
		let max: string;
		let letter: string;
		let expression: string;
		let occurrences: number;
		[min, max, letter, expression] = [...items];
		const expressionTrim = expression.trim();
		const char1 = expressionTrim[+min - 1];
		const char2 = expressionTrim[+max - 1];

		if (char1 !== char2 && (char1 === letter || char2 === letter)) {
			count++;
		}
		return count;
	}, 0);
}
