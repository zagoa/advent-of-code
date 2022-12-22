import { parseListString } from "../../utils/parse-input";
import * as fs from "fs";

function generateNormalizedId(
	data: string,
	rowIndex: number,
	colIndex: number,
) {
	return data === "E"
		? SquareWithInterest.END
		: data === "S"
		? SquareWithInterest.START
		: rowIndex + "-" + colIndex;
}

class Square {
	neighboursIds: Array<string> = new Array<string>();
	value: string;
	neighboursIdsOfStepOne: Array<string> = new Array<string>();
	rowIndex: number;
	colIndex: number;
	id: string;
	visited: boolean;

	constructor(value: string, rowIndex: number, colIndex: number) {
		this.value = value;
		this.rowIndex = rowIndex;
		this.colIndex = colIndex;
		this.id = generateNormalizedId(value, rowIndex, colIndex);
	}
}

enum SquareWithInterest {
	END = "END",
	START = "START",
}

export default class Day12 {
	constructor() {
		this.get_shortest_path();
		this.get_shortest_path_by_choosing_starting_point();
	}

	get_shortest_path() {
		const data = parseListString(`${__dirname}/DAY_12_INPUTS`);
		//const data = parseListString(`${__dirname}/UNIT_TEST_DATA`);
		const squares: Map<string, Square> = this.preProcess(data);
		const start = squares.get(SquareWithInterest.START);

		//let paths = this.recursivelyGetPath(start, new Set<string>(), squares, []); // it works for the UNIT TEST but for real data it's too complex and too slow
		/**
		 * const shortest = paths.sort((a, b) => a.size - b.size)[0]
		 *  this.visualizePath(data, shortest, squares);
		 */

		this.visualizePath(
			data,
			this.dijkstraImplementation(start, squares).get(SquareWithInterest.END)
				.from,
			squares,
		);
		console.log(
			"Day 12 => shortest path length",
			this.dijkstraImplementation(start, squares).get(SquareWithInterest.END)
				.distance,
		);
	}

	get_shortest_path_by_choosing_starting_point() {
		const data = parseListString(`${__dirname}/DAY_12_INPUTS`);
		//const data = parseListString(`${__dirname}/UNIT_TEST_DATA`);
		const squares: Map<string, Square> = this.preProcess(data, true);

		const start = Date.now();
		const results = Array.from(
			this.dijkstraImplementation(
				squares.get(SquareWithInterest.END),
				squares,
			).values(),
		);

		fs.writeFileSync(
			"results",
			JSON.stringify(
				results.filter((item) => squares.get(item.id).value === "a"),
			),
		);

		//results.forEach(result => this.visualizePath(data, result.from, squares));
		console.log(
			`Day 12 => shortest path length for a starting point chosen ${Math.min(
				...results
					.filter((item) => squares.get(item.id).value === "a")
					.map((item) => item.distance),
			)} in ${Date.now() - start}ms`,
		);
	}

	dijkstraImplementation(
		start: Square,
		squares: Map<string, Square>,
	): Map<
		string,
		{ id: string; distance: number; visited: boolean; from?: Array<string> }
	> {
		const distances = new Map<
			string,
			{ id: string; distance: number; visited: boolean; from?: Array<string> }
		>();

		let currentSquare = start;
		let currentNodeDistance = 0;
		// initialization
		distances.set(start.id, {
			id: start.id,
			distance: currentNodeDistance,
			visited: true,
			from: [],
		});

		for (let neighboursOfStepOne of currentSquare.neighboursIdsOfStepOne) {
			distances.set(neighboursOfStepOne, {
				id: neighboursOfStepOne,
				distance: currentNodeDistance + 1,
				visited: false,
				from: [currentSquare.id],
			});
		}

		// elect next shortest path
		let applyAlgo = true;
		while (applyAlgo) {
			let nextNode = Array.from(distances.values())
				.sort((a, b) => a.distance - b.distance)
				.find((item) => !item.visited);
			if (!nextNode) {
				applyAlgo = false;
				break;
			}
			currentSquare = squares.get(nextNode.id);
			distances.set(nextNode.id, {
				...nextNode,
				visited: true,
			});

			for (let neighboursOfStepOne of currentSquare.neighboursIdsOfStepOne) {
				let newDistance = nextNode.distance + 1;
				if (distances.has(neighboursOfStepOne)) {
					distances.set(neighboursOfStepOne, {
						...distances.get(neighboursOfStepOne),
						distance:
							distances.get(neighboursOfStepOne).distance > newDistance
								? newDistance
								: distances.get(neighboursOfStepOne).distance,
						from: nextNode.from.concat([nextNode.id]),
					});
				} else {
					distances.set(neighboursOfStepOne, {
						id: neighboursOfStepOne,
						distance: newDistance,
						visited: false,
						from: nextNode.from.concat([nextNode.id]),
					});
				}
			}
		}

		return distances;
	}

	recursivelyGetPath(
		square: Square,
		path: Set<string>,
		allSquares: Map<string, Square>,
		allPaths: Array<Set<string>>,
	): Array<Set<string>> {
		path.add(square.id);
		for (let i = 0; i < square.neighboursIdsOfStepOne.length; i++) {
			let squareNeighbourId = square.neighboursIdsOfStepOne[i];
			if (!path.has(squareNeighbourId)) {
				const nextSquare = allSquares.get(squareNeighbourId);
				if (nextSquare.id === SquareWithInterest.END) {
					allPaths.push(path);
					return allPaths;
				} else {
					this.recursivelyGetPath(
						nextSquare,
						new Set<string>([...path]),
						allSquares,
						allPaths,
					);
				}
			}
		}
		return allPaths;
	}

	preProcess(
		data: Array<string>,
		reverseSearch: boolean = false,
	): Map<string, Square> {
		const squares = new Map<string, Square>();
		for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
			for (let colIndex = 0; colIndex < data[rowIndex].length; colIndex++) {
				const currentSquare = data[rowIndex][colIndex];
				const squareObject = new Square(currentSquare, rowIndex, colIndex);
				const neighbours = [
					this.getIdDefined(data, rowIndex + 1, colIndex),
					this.getIdDefined(data, rowIndex - 1, colIndex),
					this.getIdDefined(data, rowIndex, colIndex + 1),
					this.getIdDefined(data, rowIndex, colIndex - 1),
				].filter((item) => item);
				squareObject.neighboursIds = [...neighbours] ?? [];
				squares.set(squareObject.id, squareObject);
			}
		}

		squares.forEach((squareObject) => {
			squareObject.neighboursIdsOfStepOne = squareObject.neighboursIds.filter(
				(item) => {
					return reverseSearch
						? this.canAccessSquare(squares.get(item).value, squareObject.value)
						: this.canAccessSquare(squareObject.value, squares.get(item).value);
				},
			);
		});

		return squares;
	}

	getIdDefined(data, rowIndex, colIndex) {
		if (data[rowIndex] && data[rowIndex][colIndex]) {
			return generateNormalizedId(data[rowIndex][colIndex], rowIndex, colIndex);
		} else {
			return undefined;
		}
	}

	private visualizePath(
		data: Array<string>,
		path: Array<string>,
		mapOfIds: Map<string, Square>,
		eachStep: boolean = false,
	) {
		const dataCopy = Object.assign([], [...data]);
		path.forEach((id, index) => {
			const square = mapOfIds.get(id);
			dataCopy[square.rowIndex] =
				dataCopy[square.rowIndex].substring(0, square.colIndex) +
				"@" +
				dataCopy[square.rowIndex].substring(square.colIndex + 1);

			if (eachStep) {
				console.log("\n");
				dataCopy.forEach((line) => {
					console.log(line);
				});
			}
		});

		if (!eachStep) {
			console.log("\n");
			dataCopy.forEach((line) => {
				console.log(line);
			});
		}
	}

	private canAccessSquare(from: string, to: string): boolean {
		if (to === "S" || from === "S" || from === "E") {
			return true;
		} else if (to === "E") {
			return "z".charCodeAt(0) <= from.charCodeAt(0) + 1;
		} else return to.charCodeAt(0) <= from.charCodeAt(0) + 1;
	}
}
