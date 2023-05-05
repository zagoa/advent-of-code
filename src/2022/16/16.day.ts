import { parseListString } from "../../utils/parse-input";

export default class Day16 {
	constructor() {
		this.part1();
	}

	part1() {
		const data = parseListString(`${__dirname}/UNIT_TEST_DATA`);
		createValveMap(data);
	}
}

export function createValveMap(data: Array<string>) {}
