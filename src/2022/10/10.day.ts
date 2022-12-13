import { parseListString } from "../../utils/parse-input";

export default class Day10 {
	SPRITE_SIZE = 3;
	CRT_WIDTH = 40;
	CRT_HEIGHT = 6;

	constructor() {
		this.find_signal_strengths_part_1();
		this.draw_image_part_2();
	}

	/**
	 * Start by figuring out the signal being sent by the CPU. The CPU has a single register, X, which starts with the value 1. It supports only two instructions:
	 *
	 * addx V takes two cycles to complete. After two cycles, the X register is increased by the value V. (V can be negative.)
	 * noop takes one cycle to complete. It has no other effect.
	 *
	 * The interesting signal strengths can be determined as follows:
	 *
	 * During the 20th cycle, register X has the value 21, so the signal strength is 20 * 21 = 420. (The 20th cycle occurs in the middle of the second addx -1, so the value of register X is the starting value, 1, plus all of the other addx values up to that point: 1 + 15 - 11 + 6 - 3 + 5 - 1 - 8 + 13 + 4 = 21.)
	 * During the 60th cycle, register X has the value 19, so the signal strength is 60 * 19 = 1140.
	 * etc...
	 */
	find_signal_strengths_part_1() {
		const data = parseListString(`${__dirname}/DAY_10_INPUTS`);
		//const data = parseListString(`${__dirname}/UNIT_TEST_DATA`);
		const results = this.getInterestingSignalsStrengths(
			data,
			[20, 60, 100, 140, 180, 220],
		);
		console.log(
			"Day 10 => PART 1",
			results.reduce((total, item) => total + item, 0),
		);
	}

	draw_image_part_2() {
		const data = parseListString(`${__dirname}/DAY_10_INPUTS`);
		//const data = parseListString(`${__dirname}/UNIT_TEST_DATA`);

		const CRT = new Array<string>();

		let cyclesCount = 0;
		let spritePosition = 1;
		let offset = 0;

		data.forEach((item) => {
			const itemSplit = item.split(" ");
			itemSplit.forEach((instruction) => {
				let valueToAdd;
				const spriteTruePosition = spritePosition + offset;

				if (
					cyclesCount <= spriteTruePosition + 1 &&
					cyclesCount >= spriteTruePosition - 1
				) {
					CRT[cyclesCount] = "#";
				} else {
					CRT[cyclesCount] = ".";
				}
				switch (instruction) {
					case "addx":
					case "noop":
						cyclesCount++;
						break;
					default:
						cyclesCount++;
						valueToAdd = parseInt(instruction);
						break;
				}

				if (valueToAdd) {
					spritePosition += valueToAdd;
				}

				if (cyclesCount % 40 === 0) {
					offset = (cyclesCount / 40) * 40;
				}
			});
		});

		console.log("Day 10 => word to find");

		for (let index = 0; index < CRT.length / 40; index++) {
			console.log(CRT.slice(index * 40, index * 40 + 39).join(""));
		}
	}

	getInterestingSignalsStrengths(
		data: Array<string>,
		interestingCycles: Array<number>,
	): Array<number> {
		const interestingSignals = new Array<number>();
		let cyclesCount = 0;
		let signalX = 1;

		data.forEach((item) => {
			const itemSplit = item.split(" ");
			itemSplit.forEach((instruction) => {
				let valueToAdd;
				switch (instruction) {
					case "addx":
					case "noop":
						cyclesCount++;
						break;
					default:
						cyclesCount++;
						valueToAdd = parseInt(instruction);
						break;
				}

				if (interestingCycles.includes(cyclesCount)) {
					interestingSignals.push(cyclesCount * signalX);
					console.log("@@@@");
					console.log("Signal X value", signalX);
					console.log("Cycle count value", cyclesCount);
				}

				if (valueToAdd) {
					signalX += valueToAdd;
				}
			});
		});

		return interestingSignals;
	}
}
