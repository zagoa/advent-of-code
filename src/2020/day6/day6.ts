export function day6part1(inputs: Array<string>): number {
	return inputs.reduce((count, input) => {
		const mapOfResponses: Map<string, number> = new Map<string, number>();

		Array.from(input).forEach((letter) => {
			if (letter !== "\n") {
				if (mapOfResponses.has(letter)) {
					mapOfResponses.set(letter, mapOfResponses.get(letter) + 1);
				} else {
					mapOfResponses.set(letter, 1);
				}
			}
		});

		return count + mapOfResponses.size;
	}, 0);
}

export function day6part2(inputs: Array<string>): number {
	return inputs.reduce((count, input) => {
		const mapOfResponses: Map<string, number> = new Map<string, number>();
		const peopleResponses: Array<string> = input.split("\n");
		peopleResponses.forEach((peopleResponse) => {
			Array.from(peopleResponse).forEach((letter) => {
				if (mapOfResponses.has(letter)) {
					mapOfResponses.set(letter, mapOfResponses.get(letter) + 1);
				} else {
					mapOfResponses.set(letter, 1);
				}
			});
		});

		return (
			count +
			Array.from(mapOfResponses.values()).filter(
				(numberResponse) => numberResponse === peopleResponses.length,
			).length
		);
	}, 0);
}
