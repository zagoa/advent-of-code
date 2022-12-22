import { parseListNumber, parseListString } from "../../utils/parse-input";
import { isUndefined } from "util";

export default class Day13 {
	constructor() {
		this.part1();
	}

	part1() {
		//const data = parseListString(`${__dirname}/UNIT_TEST_DATA`).filter(item => item);
		const data = parseListString(`${__dirname}/DAY_13_INPUTS`).filter(
			(item) => item,
		);
		const listOfIndex = new Array<number>();
		let pairIndex = 1;
		for (let index = 0; index < data.length; index = index + 2) {
			let leftList: Array<number | Array<number>> = JSON.parse(data[index]);
			let rightList: Array<number | Array<number>> = JSON.parse(
				data[index + 1],
			);

			if (this.isPairOnTheRightOrder(leftList, rightList)) {
				listOfIndex.push(pairIndex);
			}
			pairIndex++;
		}

		console.log(
			`Day 13 => packet on the right order are ${listOfIndex} and sum equal to ${listOfIndex.reduce(
				(total, value) => total + value,
				0,
			)}`,
		);
	}

	part2() {}

	private convertToArrayIfNeeded(
		item: number | Array<number>,
	): Array<number | Array<number>> {
		if (Array.isArray(item)) {
			return item;
		} else {
			return [item];
		}
	}

	private isPairOnTheRightOrder(
		leftList: Array<number | Array<number>>,
		rightList: Array<number | Array<number>>,
	): boolean {
		for (
			let index = 0;
			index < Math.max(leftList.length, rightList.length);
			index++
		) {
			const leftItem: number | Array<number> = leftList[index];
			const rightItem: number | Array<number> = rightList[index];

			if (rightItem === undefined) {
				return false;
			} else if (leftItem === undefined) {
				return true;
			}

			// one of the items is an array
			if (Array.isArray(leftItem) || Array.isArray(rightItem)) {
				const recursiveResult = this.isPairOnTheRightOrder(
					this.convertToArrayIfNeeded(leftItem),
					this.convertToArrayIfNeeded(rightItem),
				);
				if (recursiveResult !== undefined) {
					return recursiveResult;
				}
			}

			// compare integers
			if (leftItem < rightItem) {
				return true;
			} else if (leftItem > rightItem) {
				return false;
			}
		}
		return undefined;
	}
}
