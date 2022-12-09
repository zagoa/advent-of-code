interface FieldValue {
	field: string;
	value: string;
}

const EYE_COLOR = ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"];
const REQUIERED_FIELD = [
	{
		field: "byr",
		requiered: true,
		isValid: (x) => numberBetweenRange(x, 4, 1920, 2002),
	},
	{
		field: "iyr",
		requiered: true,
		isValid: (x) => numberBetweenRange(x, 4, 2010, 2020),
	},
	{
		field: "eyr",
		requiered: true,
		isValid: (x) => numberBetweenRange(x, 4, 2020, 2030),
	},
	{ field: "hgt", requiered: true, isValid: (height) => heightIsValid(height) },
	{
		field: "ecl",
		requiered: true,
		isValid: (eye) => !!EYE_COLOR.find((item) => item === eye),
	},
	{
		field: "hcl",
		requiered: true,
		isValid: (hairColor) =>
			hairColor.length === 7 && RegExp(/#(\d|[a-f]){6}/).test(hairColor),
	},
	{
		field: "pid",
		requiered: true,
		isValid: (pid) => pid.length === 9 && RegExp(/\d{9}/).test(pid),
	},
	{ field: "cid", requiered: false, isValid: (x) => true },
];

export function day4Part1(inputs: Array<string>): number {
	return countValidPassports(inputs);
}

export function day4Part2(inputs: Array<string>): number {
	return countValidPassports(inputs, true);
}

function countValidPassports(
	inputs: Array<string>,
	checkCondition: boolean = false,
): number {
	return inputs.reduce((count: number, input: string) => {
		const arrayOfFields: Array<FieldValue> = input.split(" ").map((item) => {
			const itemSplit = item.split(":");
			return { field: itemSplit[0], value: itemSplit[1] };
		});

		const remainingFields = REQUIERED_FIELD.filter(
			(field) =>
				!arrayOfFields.find((toCheck) => {
					if (field.field === toCheck.field) {
						return checkCondition ? field.isValid(toCheck.value) : true;
					} else {
						return false;
					}
				}),
		);

		if (
			remainingFields.length === 0 ||
			(remainingFields.length === 1 && !remainingFields[0].requiered)
		) {
			count++;
		}
		return count;
	}, 0);
}

function numberBetweenRange(
	input: number | string,
	size: number,
	min: number,
	max: number,
): boolean {
	if (!isNaN(size)) {
		return `${input}`.length === size && +input >= min && +input <= max;
	} else {
		return +input >= min && +input <= max;
	}
}

function heightIsValid(height: string) {
	const size = height.substring(0, height.length - 2);
	const unit = height.substring(height.length - 2, height.length);
	if (!!unit && !isNaN(+size)) {
		if (unit === "cm") {
			return numberBetweenRange(size, undefined, 150, 193);
		} else {
			return numberBetweenRange(size, undefined, 59, 76);
		}
	} else {
		return false;
	}
}
