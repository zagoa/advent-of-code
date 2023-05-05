import { parseListString } from "../../utils/parse-input";
import Day16, { createValveMap } from "./16.day";

describe("Day 16", () => {
	test("create data structure", () => {
		const data = parseListString(`${__dirname}/UNIT_TEST_DATA`);
		createValveMap(data);
	});
});
