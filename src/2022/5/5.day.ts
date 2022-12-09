import { parseListString } from "../../utils/parse-input";

class Command {
	move: number;
	from: number;
	to: number;

	constructor(move?: number, from?: number, to?: number) {
		this.move = move;
		this.from = from;
		this.to = to;
	}
}

export default class Day5 {
	constructor() {
		this.find_crates_on_top();
		this.find_crates_on_top_with_crate_mover_9001();
	}

	/**
	 *     [D]
	 * [N] [C]
	 * [Z] [M] [P]
	 *  1   2   3
	 *
	 * move 1 from 2 to 1
	 * move 3 from 1 to 3
	 * move 2 from 2 to 1
	 * move 1 from 1 to 2
	 * In this example, there are three stacks of crates. Stack 1 contains two crates: crate Z is on the bottom, and crate N is on top. Stack 2 contains three crates; from bottom to top, they are crates M, C, and D. Finally, stack 3 contains a single crate, P.
	 *
	 * Then, the rearrangement procedure is given. In each step of the procedure, a quantity of crates is moved from one stack to a different stack. In the first step of the above rearrangement procedure, one crate is moved from stack 2 to stack 1, resulting in this configuration:
	 *
	 * [D]
	 * [N] [C]
	 * [Z] [M] [P]
	 *  1   2   3
	 * In the second step, three crates are moved from stack 1 to stack 3. Crates are moved one at a time, so the first crate to be moved (D) ends up below the second and third crates:
	 *
	 *         [Z]
	 *         [N]
	 *     [C] [D]
	 *     [M] [P]
	 *  1   2   3
	 * Then, both crates are moved from stack 2 to stack 1. Again, because crates are moved one at a time, crate C ends up below crate M:
	 *
	 *         [Z]
	 *         [N]
	 * [M]     [D]
	 * [C]     [P]
	 *  1   2   3
	 * Finally, one crate is moved from stack 1 to stack 2:
	 *
	 *         [Z]
	 *         [N]
	 *         [D]
	 * [C] [M] [P]
	 *  1   2   3
	 * The Elves just need to know which crate will end up on top of each stack; in this example, the top crates are C in stack 1, M in stack 2, and Z in stack 3, so you should combine these together and give the Elves the message CMZ.
	 *
	 * After the rearrangement procedure completes, what crate ends up on top of each stack?
	 */
	find_crates_on_top() {
		const { crates, commandsAsString } = this.parseInput();
		// console.log('Data =>', crates, commandsAsString)
		const warehouse = this.createWarehouse(crates);
		// console.log('Warehouse =>', warehouse)
		const commands = this.parseCommands(commandsAsString);
		this.applyCommands(warehouse, commands);
		console.log("DAY 5 => find crates on top", this.getTopLetters(warehouse));
	}

	/**
	 * Some mud was covering the writing on the side of the crane, and you quickly wipe it away. The crane isn't a CrateMover 9000 - it's a CrateMover 9001.
	 *
	 * The CrateMover 9001 is notable for many new and exciting features: air conditioning, leather seats, an extra cup holder, and the ability to pick up and move multiple crates at once.
	 *
	 * Again considering the example above, the crates begin in the same configuration:
	 *
	 *     [D]
	 * [N] [C]
	 * [Z] [M] [P]
	 *  1   2   3
	 * Moving a single crate from stack 2 to stack 1 behaves the same as before:
	 *
	 * [D]
	 * [N] [C]
	 * [Z] [M] [P]
	 *  1   2   3
	 * However, the action of moving three crates from stack 1 to stack 3 means that those three moved crates stay in the same order, resulting in this new configuration:
	 *
	 *         [D]
	 *         [N]
	 *     [C] [Z]
	 *     [M] [P]
	 *  1   2   3
	 * Next, as both crates are moved from stack 2 to stack 1, they retain their order as well:
	 *
	 *         [D]
	 *         [N]
	 * [C]     [Z]
	 * [M]     [P]
	 *  1   2   3
	 * Finally, a single crate is still moved from stack 1 to stack 2, but now it's crate C that gets moved:
	 *
	 *         [D]
	 *         [N]
	 *         [Z]
	 * [M] [C] [P]
	 *  1   2   3
	 * In this example, the CrateMover 9001 has put the crates in a totally different order: MCD.
	 *
	 * Before the rearrangement process finishes, update your simulation so that the Elves know where they should stand to be ready to unload the final supplies. After the rearrangement procedure completes, what crate ends up on top of each stack?
	 */
	find_crates_on_top_with_crate_mover_9001() {
		const { crates, commandsAsString } = this.parseInput();
		const warehouse = this.createWarehouse(crates);
		const commands = this.parseCommands(commandsAsString);
		this.applyCommands(warehouse, commands, "9001");
		console.log(
			"DAY 5 => find crates on top with 9001",
			this.getTopLetters(warehouse),
		);
	}

	applyCommands(
		warehouse: Array<Array<string>>,
		commands: Array<Command>,
		crateMoverType: "9000" | "9001" = "9000",
	) {
		commands.forEach((command) => {
			const removed = warehouse[command.from].splice(
				warehouse[command.from].length - command.move,
				command.move,
			);
			if (crateMoverType === "9000") {
				removed.reverse().forEach((crate) => warehouse[command.to].push(crate));
			} else {
				removed.forEach((crate) => warehouse[command.to].push(crate));
			}
		});
	}

	parseInput(): { crates: Array<string>; commandsAsString: Array<string> } {
		const data = parseListString(`${__dirname}/DAY_5_INPUTS`);
		const splitIndex = data.findIndex((line) => line === "");
		return {
			crates: data.slice(0, splitIndex),
			commandsAsString: data.slice(splitIndex + 1),
		};
	}

	createWarehouse(cratesAsString: Array<string>): Array<Array<string>> {
		const warehouse = new Array<Array<string>>();
		const lastLineDefiningWarehouse = cratesAsString[cratesAsString.length - 1];
		const numberOfCratesByLine: number = parseInt(
			lastLineDefiningWarehouse[lastLineDefiningWarehouse.length - 1],
		);

		for (
			let lineNumber = numberOfCratesByLine - 2;
			lineNumber > -1;
			lineNumber = lineNumber - 1
		) {
			const line = cratesAsString[lineNumber];
			for (let index = 0; index < line.length; index = index + 4) {
				if (line[index + 1] && line[index + 1] !== " ") {
					if (!warehouse[index / 4]) {
						warehouse[index / 4] = new Array<string>();
					}
					warehouse[index / 4].push(line[index + 1]);
				}
			}
		}

		return warehouse;
	}

	parseCommands(commandsAsString: Array<string>): Array<Command> {
		const commands = new Array<Command>();
		commandsAsString.forEach((commandStr) => {
			const commandStrSplit = commandStr.split(" ");
			const command = new Command(
				parseInt(commandStrSplit[1]),
				parseInt(commandStrSplit[3]) - 1,
				parseInt(commandStrSplit[5]) - 1,
			);
			commands.push(command);
		});
		return commands;
	}

	getTopLetters(warehouse: Array<Array<string>>) {
		let result = "";
		warehouse.forEach((column) => {
			result += column[column.length - 1];
		});
		return result;
	}
}
