import { readFileSync } from "fs";

export function parseListNumber(
	file: string,
	separator: string = "\n",
): Array<number> {
	const data = readFileSync(file, { encoding: "utf-8" });
	return data.split(separator).map((value) => parseInt(value));
}

export function parseListString(
	file: string,
	separator: string = "\n",
): Array<string> {
	let data = readFileSync(file, { encoding: "utf-8" });
	return data.split(separator);
}
