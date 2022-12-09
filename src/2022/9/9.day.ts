import { parseListString } from "../../utils/parse-input";
import * as fs from "fs";
import { Dir, readFileSync } from "fs";

class Position {
	row: number = 0;
	column: number = 0;

	constructor() {}
}

class Rope {
	knots: Array<Position> = new Array<Position>();
	tailPath: Map<string, string> = new Map<string, string>();

	constructor(numberOfKnots: number) {
		for (let index = 0; index < numberOfKnots; index++) {
			this.knots.push(new Position());
		}
	}
}

enum Direction {
	U = "UP",
	D = "DOWN",
	R = "RIGHT",
	L = "LEFT",
}

export default class Day9 {
	constructor() {
		this.find_number_of_visited_position_by_the_tail();
	}

	find_number_of_visited_position_by_the_tail() {
		const inputs = parseListString(`${__dirname}/DAY_9_INPUTS`);

		let rope = new Rope(2);
		let ropePart2 = new Rope(10);
		for (let command of inputs) {
			rope = this.interpretCommandString(command, rope);
			ropePart2 = this.interpretCommandString(command, ropePart2);
		}
		this.visualize(rope);
		this.visualize(rope, "visualize_10");
		console.log(
			"DAY 9 => number of visited position by the tail for a body of 2",
			rope.tailPath.size,
		);
		console.log(
			"DAY 9 => number of visited position by the tail for a body of 10",
			ropePart2.tailPath.size,
		);
	}

	interpretCommandString(commandStr: string, rope: Rope): Rope {
		const commandSplit = commandStr.split(" ");
		const direction = Direction[commandSplit[0]];
		const nbSteps = parseInt(commandSplit[1]);
		rope.tailPath.set(`${0};${0}`, "S");

		for (let index = 0; index < nbSteps; index++) {
			for (let knotIndex = 0; knotIndex < rope.knots.length; knotIndex++) {
				if (knotIndex === 0) {
					// move the head
					switch (direction) {
						case Direction.U:
							rope.knots[knotIndex].row++;
							break;
						case Direction.D:
							rope.knots[knotIndex].row--;
							break;
						case Direction.R:
							rope.knots[knotIndex].column++;
							break;
						case Direction.L:
							rope.knots[knotIndex].column--;
							break;
					}
				} else if (!this.isKnotCloseToPrevious(rope, knotIndex)) {
					// move part of the rope body if needed
					rope.knots[knotIndex] = this.moveTailPart(rope, knotIndex);
				}

				const id = `${rope.knots[rope.knots.length - 1].row};${
					rope.knots[rope.knots.length - 1].column
				}`;
				if (!rope.tailPath.has(id)) {
					rope.tailPath.set(`${id}`, "#");
				}
			}
		}
		return rope;
	}

	moveTailPart(rope: Rope, knotIndex: number): Position {
		const previousKnot = rope.knots[knotIndex - 1];
		const currentKnot = rope.knots[knotIndex];
		let row = 0;
		let col = 0;
		if (currentKnot.column !== previousKnot.column) {
			col += Math.sign(previousKnot.column - currentKnot.column);
		}
		if (currentKnot.row !== previousKnot.row) {
			row += Math.sign(previousKnot.row - currentKnot.row);
		}

		currentKnot.column += col;
		currentKnot.row += row;
		return currentKnot;
	}

	isKnotCloseToPrevious(rope: Rope, knotIndex: number): boolean {
		const previousKnot = rope.knots[knotIndex - 1];
		const currentKnot = rope.knots[knotIndex];
		return (
			Math.abs(currentKnot.row - previousKnot.row) <= 1 &&
			Math.abs(currentKnot.column - previousKnot.column) <= 1
		);
	}

	visualize(rope: Rope, name: string = "visualize") {
		let nbRow = 0;
		let nbCol = 0;
		let draw = "";

		rope.tailPath.forEach((value, key) => {
			const keySplit = key.split(";").map((item) => parseInt(item));
			nbRow = keySplit[0] > nbRow ? keySplit[0] : nbRow;
			nbCol = keySplit[1] > nbCol ? keySplit[1] : nbRow;
		});

		const grid = new Array<Array<string>>();
		for (let x = 0; x < nbRow; x++) {
			for (let y = 0; y < nbCol; y++) {
				const value = rope.tailPath.has(`${x};${y}`)
					? rope.tailPath.get(`${x};${y}`)
					: ".";
				if (grid[x]) {
					grid[x].push(value);
				} else {
					grid[x] = new Array(value);
				}
			}
			draw += [...grid[x]] + "\n";
		}
		fs.writeFileSync(`${__dirname}/${name}.txt`, draw);
		console.log("Visualization written", name);
	}
}
